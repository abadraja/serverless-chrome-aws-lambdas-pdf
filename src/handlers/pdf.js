import log from '../utils/log'
import pdf from '../chrome/pdf'

export default async function handler(event, context, callback) {

  var printOptions = ["url", "landscape", "displayHeaderFooter", "displayHeaderFooter", "printBackground",
    "scale", "paperWidth", "paperHeight", "marginTop", "marginBottom", "marginLeft",
    "marginRight", "headertemplate", "footertemplate", "x-user-id", "x-user-token", "x-user-systemcode",
    "x-user-metro"
  ];

  console.log(`real event: ${JSON.stringify(event)}`);
  let text;
  // console.log(`buffer to json: ${JSON.stringify(new Buffer(event.body, 'base64'))}`);
  // // console.log(`event: ${new Buffer(event.body, 'base64').toString()}`);
  // console.log(`event: ${JSON.parse(new Buffer(event.body, 'base64').toString()['html-code'])}`);
  // console.log(`event: ${new Buffer(event.body, 'base64')['html-code']}`);
  var printParameters = {};
  let url = event.headers.url;
  printParameters['printBackground'] = true;
  try {
    // console.log(`decoded: ${decodeURIComponent(url)}`);
    url = decodeURIComponent(url);
  } catch (err) {
    console.error(err);
  }
  if (event.body) {
    text = new Buffer(event.body, 'base64').toString();

    // console.log(`textbig: ${text}`);
    // printParameters['html-code'] = text;
    // console.log(`decoded: ${decodeURIComponent(text)}`);
    printParameters['html-code'] = decodeURIComponent(text);

  }
  if (!printParameters['html-code'] && !url) {
    console.log('fek it');
    return new Error(`html-code or url passed incorrectly or absent`);
  }

  for (var key in event.headers) {
    if (event.headers.hasOwnProperty(key)) {
      log("key is " + key + ", value is" + event.headers[key]);
      if (printOptions.includes(key)) {
        if (["landscape", "ignoreInvalidPageRanges", "printBackground", "displayHeaderFooter"].includes(key)) {
          printParameters[key] = (event.headers[key] === 'true');
        } else if (["scale", "paperWidth", "paperHeight", "marginTop", "marginBottom", "marginLeft", "marginRight"].includes(key)) {
          printParameters[key] = Number(event.headers[key]);
        } else if (["footertemplate", "headertemplate"].includes(key)) {
          printParameters[key] = decodeURIComponent(event.headers[key]);
        } else {
          printParameters[key] = event.headers[key];
        }
      } else {
        log(`${key}key, with value ${event.headers[key]}`, printOptions.includes(key));
      }
    }
  }

  // console.log(`printParameters: ${JSON.stringify(printParameters)}`);

  let data
  log('Processing PDFification for', url, printParameters)
  const startTime = Date.now()

  try {
    data = await pdf(url, printParameters)
  } catch (error) {
    console.error('Error printing pdf for', url, error)
    return callback(error)
  }
  log(`Chromium took ${Date.now() - startTime}ms to load URL and render PDF.`)

  // TODO: handle cases where the response is > 10MB
  // with saving to S3 or something since API Gateway has a body limit of 10MB
  return callback(null, {
    statusCode: 200,
    body: data,
    isBase64Encoded: true,
    headers: {
      'Content-Type': 'application/pdf',
    },
  })
}