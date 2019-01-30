import CDP from 'chrome-remote-interface'
import log from '../utils/log'
import sleep from '../utils/sleep'

const defaultPrintOptions = {
  landscape: false,
  displayHeaderFooter: false,
  printBackground: true,
  scale: 1,
  paperWidth: 8.27,
  paperHeight: 11.69,
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  pageRanges: '',
  headerTemplate: '<div class=\"page-footer\" style=\"width:100%; text-align:right; font-size:12px;\">Page <span class=\"pageNumber\"></span> of <span class=\"totalPages\"></span></div>',
  footerTemplate: '<div class=\"page-footer\" style=\"width:100%; text-align:right; font-size:12px;\">Page <span class=\"pageNumber\"></span> of <span class=\"totalPages\"></span></div>'
}

function cleanPrintOptionValue(type, value) {
  const types = {
    string: String,
    number: Number,
    boolean: Boolean
  }
  return types[type](value)
}

export function makePrintOptions(options = {}) {
  return Object.entries(options).reduce(
    (printOptions, [option, value]) => ({
      ...printOptions,
      [option]: cleanPrintOptionValue(
        typeof defaultPrintOptions[option],
        value
      ),
    }),
    defaultPrintOptions
  )
}

export default async function printUrlToPdf(
  url,
  printOptions = {},
  mobile = false
) {
  let client;
  let result;
  const requestQueue = [];
  try {

    client = await CDP();

    const {
      Network,
      Page,
      Runtime,
      Emulation
    } = client

    const LOAD_TIMEOUT = process.env.PAGE_LOAD_TIMEOUT || 1000 * 20
    const emptyQueue = async () => {
      await sleep(500)

      log('Request queue size:', requestQueue.length, requestQueue)

      if (requestQueue.length > 0) {
        await emptyQueue()
      }
    }
    // console.log(`x-user-id: ${printOptions['X-User-Id']}`);
    // Network.setUserAgentOverride({
    //   'userAgent': 'user agent'
    // });
    Network.setExtraHTTPHeaders({
      'headers': {
        'X-Requested-by': 'Extra User Agent',
        'x-user-id': printOptions['x-user-id'],
        'x-user-token': printOptions['x-user-token'],
        'x-user-systemcode': printOptions['x-user-systemcode'],
        'x-user-metro': printOptions['x-user-metro']
      }
    });

    Network.requestWillBeSent((data) => {

      if (!requestQueue.find(item => item === data.requestId)) {
        requestQueue.push(data.requestId)
      }

      log('Chrome is sending request for:', data.requestId, data.request.url)
    })

    Network.responseReceived(async (data) => {
      // @TODO: handle this better. sometimes images, fonts,
      // etc aren't done loading before we think loading is finished
      // is there a better way to detect this? see if there's any pending
      // js being executed? paints? something?
      await sleep(100) // wait here, in case this resource has triggered more resources to load.
      requestQueue.splice(
        requestQueue.findIndex(item => item === data.requestId),
        1
      )
      log('Chrome received response for:', data.requestId, data.response.url)
    })

    await Promise.all([Network.enable(), Page.enable()])
    console.log(`url: ${url}`, url == undefined);
    console.log(`printOptions['html-code']: ${printOptions['html-code']}`, typeof printOptions['html-code']);
    console.log(`printOptions ==: ${JSON.stringify(printOptions)}`);

    let pageNavigator;
    if (url == undefined) {
      // pageNavigator = await Page.navigate({
      //   url: 'about:blank'
      // })
      url = 'about:blank';
    }
    pageNavigator = await Page.navigate({
      url
    })

    console.log(pageNavigator);

    await Page.loadEventFired()

    const {
      frameId
    } = pageNavigator;
    const html = printOptions['html-code'];
    console.log('html', html, typeof html);
    console.log(`d1`);

    // await Page.setDocumentContent({
    //   frameId,
    //   html
    // });
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(
        reject,
        LOAD_TIMEOUT,
        new Error(`Page load timed out after ${LOAD_TIMEOUT} ms.`)
      )

      const load = async () => {
        await emptyQueue()
        clearTimeout(timeout)
        resolve()
      }

      load()
    })
    await sleep(2000);
    console.log(`d2`);

    function demoWait() {
      setTimeout(() => {
        const adata = window.ADATA_READY;
        return {
          adata
        }
      }, 3500);
    }

    console.log('html', html, typeof html);
    console.log('frameId', frameId);

    await Page.setDocumentContent({
      frameId,
      html
    });
    console.log(`feek it`);
    let adata = await Runtime.evaluate({
      expression: `(${demoWait})()`,
    });
    log(`soo, adata= ${JSON.stringify(adata)}`);
    console.log('OK');
    await sleep(1500)
    const pdf = await Page.printToPDF(printOptions)
    result = pdf.data
  } catch (error) {
    console.error(error)
  } finally {
    if (client) {
      await client.close();
    }
  }


  return result
}