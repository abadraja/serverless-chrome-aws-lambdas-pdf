import log from '../utils/log'
import pdf from '../chrome/pdf'
const AWS = require('aws-sdk');
require('dotenv').config()

export default async function handler(event, context, callback) {

  let printOptions = ["url", "landscape", "displayheaderfooter", "displayheaderfooter", "printbackground",
    "scale", "paperwidth", "paperheight", "margintop", "marginbottom", "marginleft",
    "marginright", "headertemplate", "footertemplate", "x-user-id", "x-user-token", "x-user-systemcode",
    "x-user-metro", "filename"
  ];

  let printParameters = {};
  // Get the url from header
  let url = event.headers.url;
  printParameters['printBackground'] = true;

  try {
    // Decoding the url
    url = decodeURIComponent(url);
  } catch (err) {
    console.error(err);
  }

  if (!url) {
    return new Error(`html-code or url passed incorrectly or absent`);
  }

  // Sort out the needed print options
  for (let key in event.headers) {
    if (event.headers.hasOwnProperty(key)) {
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
      }
    }
  }

  // Call Lambda here: 
  let lambda = new AWS.Lambda();

  let buf = Buffer.from(JSON.stringify(printParameters));

  let params = {
    FunctionName: 'aws2-dev-magic',
    InvocationType: "Event",
    Payload: buf
  };
  lambda.invoke(params, (err, data) => {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log(data); // successful response
    }
  });

  // Make param.key here:
  let file_key = Date.now() + "_" + "tmp.pdf";
  if (event.headers.filename) {
    file_key = event.headers.filename;
  }

  // AWS PART
  return callback(null, {
    statusCode: 200,
    body: `https://s3.amazonaws.com/pdf-cluster-lambda-store/${file_key}`,
    headers: {
      'Content-Type': 'text/html',
    },
  })

}