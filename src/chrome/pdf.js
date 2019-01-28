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
  try {

    client = await CDP();

    const {
      Network,
      Page
    } = client

    // console.log(`x-user-id: ${printOptions['X-User-Id']}`);
    // Network.setUserAgentOverride({
    //   'userAgent': 'user agent'
    // });
    // Network.setExtraHTTPHeaders({
    //   'headers': {
    //     'X-Requested-by': 'Extra User Agent',
    //     'X-User-Id': printOptions['X-User-Id'],
    //     'X-User-Token': printOptions['X-User-Token'],
    //     'X-User-SystemCode': printOptions['X-User-SystemCode'],
    //     'X-User-Metro': printOptions['X-User-Metro']
    //   }
    // });

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
    // if (html) {
    await Page.setDocumentContent({
      frameId,
      html
    });


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