import Cdp from 'chrome-remote-interface'
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
  const LOAD_TIMEOUT = process.env.PAGE_LOAD_TIMEOUT || 1000 * 20
  let result

  // @TODO: write a better queue, which waits a few seconds when reaching 0
  // before emitting "empty". Also see other handlers.
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

  console.log(`printOptions ==: ${JSON.stringify(printOptions)}`);
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

  try {
    await Promise.all([Network.enable(), Page.enable()])
    console.log(`url: ${url}`, typeof url, url == 'undefined');
    console.log(`printOptions['html-code']: ${printOptions['html-code']}`, typeof printOptions['html-code']);

    // let pageNavigator;
    if (url == 'undefined') {
      //   pageNavigator = await Page.navigate({ url: 'about:blank' })    
      console.log(`is wrong!`);
      url = 'about:blank';
    }
    const pageNavigator = await Page.navigate({
      url
    })

    await Page.loadEventFired()

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
    if (url == 'about:blank') {
      const {
        frameId
      } = pageNavigator;
      const html = printOptions['html-code'];
      console.log('html', `length: ${html.length}`, html, typeof html);
      await Page.setDocumentContent({
        frameId,
        html
      });
      await Page.loadEventFired()
    } else {
      const {
        result: {
          value: {
            height,
          },
        },
      } = await Runtime.evaluate({
        expression: `(
          () => {
            const height = document.body.scrollHeight
            window.scrollTo(0, height)
            return { height }
          }
        )();
        `,
        returnByValue: true,
      })


      // console.log(`document:: ${JSON.stringify(await Runtime.evaluate({expression: 'document'}))}`);
      // console.log(`document:: ${JSON.stringify(await Runtime.evaluate({expression: 'document.type'}))}`);
      // console.log(`document:: ${JSON.stringify(await Runtime.evaluate({expression: 'document.body'}))}`);
      // console.log(`height:: ${height}`);

      // setting the viewport to the size of the page will force
      // any lazy-loaded images to load
      await Emulation.setDeviceMetricsOverride({
        mobile: !!mobile,
        deviceScaleFactor: 0,
        scale: 1, // mobile ? 2 : 1,
        width: mobile ? 375 : 1280,
        height,
      })

      function demoWait() {
        setTimeout(() => {
          const adata = window.ADATA_READY;
          return {
            adata
          }
        }, 3500);
      }

      Cdp(async (client) => {
        const {
          Runtime
        } = client;
        try {
          console.log(url == undefined, url);
          console.log('im here');

          let adata = await Runtime.evaluate({
            expression: `(${demoWait})()`,
            // returnByValue: true
          });
          log(`soo, adata= ${JSON.stringify(adata)}`);
          console.log('OK');

        } catch (err) {
          console.error(err);
        } finally {
          await client.close();
        }

      }).on('error', (err) => {
        console.error(err);
      });
    }


    log('We think the page has finished loading. Printing PDF.')
    // console.log(`help me printOptions: ${printOptions}`);

    await sleep(7000)
    const pdf = await Page.printToPDF(printOptions)
    result = pdf.data
  } catch (error) {
    console.error(error)
  }

  await client.close()

  return result
}