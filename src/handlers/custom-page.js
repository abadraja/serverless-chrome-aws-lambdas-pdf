import Cdp from 'chrome-remote-interface'
import log from '../utils/log'
import sleep from '../utils/sleep'
const AWS = require('aws-sdk');
require('dotenv').config()

export default async function handler(event, context, callback) {

  log(`event: ${JSON.stringify(event)}`);

  let url = event.url;
  let printOptions = event;

  const requestQueue = []

  const emptyQueue = async () => {
    await sleep(1000)

    log('Request queue size:', requestQueue.length, requestQueue)

    if (requestQueue.length > 0) {
      await emptyQueue()
    }
  }

  const tab = await Cdp.New()
  const client = await Cdp({
    host: '127.0.0.1',
    target: tab
  })

  const {
    Network,
    Page,
    Runtime,
    Emulation,
  } = client

  log(`printOptions: ${JSON.stringify(printOptions)}`);
  Network.setUserAgentOverride({
    'userAgent': 'user agent'
  });
  Network.setExtraHTTPHeaders({
    'headers': {
      'X-Requested-by': 'Extra User Agent',
      'x-user-id': printOptions['x-user-id'],
      'x-user-token': printOptions['x-user-token'],
      'x-user-systemcode': printOptions['x-user-systemcode'],
      'x-user-metro': printOptions['x-user-metro'],
    }
  });

  Network.requestWillBeSent((data) => {
    // only add requestIds which aren't already in the queue
    // why? if a request to http gets redirected to https, requestId remains the same
    if (!requestQueue.find(item => item === data.requestId)) {
      requestQueue.push(data.requestId)
    }

    // log('Chrome is sending request for:', data.requestId, data.request.url)
  })

  await Network.responseReceived(async (data) => {
    // @TODO: handle this better. sometimes images, fonts,
    // etc aren't done loading before we think loading is finished
    // is there a better way to detect this? see if there's any pending
    // js being executed? paints? something?
    await sleep(100) // wait here, in case this resource has triggered more resources to load.
    requestQueue.splice(
      requestQueue.findIndex(item => item === data.requestId),
      1
    )
    // log('Chrome received response for:', data.requestId, data.response.url)
  });

  let pdf;

  try {
    await Promise.all([Network.enable(), Page.enable()])
    if (url == 'undefined') {
      url = 'about:blank';
    }
    await Page.navigate({
      url
    })
    await Page.loadEventFired();
    await sleep(4500)
    // Wait for ADATA_READY
    const {
      result: {
        value: {
          adata,
        },
      },
    } = await Runtime.evaluate({
      expression: `(
        () => {
          const adata = window.ADATA_READY
          return { adata }
        }
        )();
        `,
      returnByValue: true,
    })
    await log(`before print to pdf, adata: ${adata}`);
    if (adata === true) {
      await log(`Niiice, should work!`);
    }

    pdf = await Page.printToPDF(printOptions)
    await client.close()
  } catch (error) {
    console.error(error)
  }

  // =========== Start upload =============== //

  // AWS PART
  AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key
  });
  let s3 = new AWS.S3();
  var buf = Buffer.from(pdf.data, 'base64');
  let file_key = Date.now() + "_" + "tmp.pdf";
  if (event.filename) {
    file_key = event.filename;
  }

  let params = {
    Bucket: 'pdf-cluster-lambda-store',
    Key: file_key,
    Body: buf,
    ACL: 'public-read',
    ContentType: 'application/pdf',
  };

  const uploading = async () => {
    s3.upload(params, (err, data) => {
      //handle error
      if (err) {
        console.log("Error", err);
      }
      //success
      if (data) {
        console.log("Uploaded in:", data.Location, `typeof: ${typeof data.Location}`);
      }
    });
  }
  await uploading().catch(err => {
    console.log(err);
  });
  log(`after uploading`);
  await sleep(4000);
  // ================= End upload ==================== //

  return pdf.data
}