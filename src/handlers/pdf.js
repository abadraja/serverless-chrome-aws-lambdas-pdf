import log from '../utils/log'
const AWS = require('aws-sdk');

export default async function handler(event, context, callback) {

  let printOptions = ["url", "landscape", "displayheaderfooter", "printbackground",
    "scale", "paperwidth", "paperheight", "margintop", "marginbottom", "marginleft",
    "marginright", "headertemplate", "footertemplate", "x-user-id", "x-user-token", "x-user-systemcode",
    "x-user-metro", "filename"
  ];
  log(`event: ${JSON.stringify(event)}`);

  let printParameters = {};
  // Get the url from header
  let url = event.headers.url;
  // printParameters['printBackground'] = true;
  log(`url: ${url}`);

  if (!url) {
    return new Error(`url passed incorrectly or absent`);
  }

  try {
    // Decoding the url
    log(`url: ${url}`);

    url = decodeURIComponent(url);
    log(`url: ${url}`);

  } catch (err) {
    console.error(err);
  }

  // Sort out the needed print options
  for (let key in event.headers) {
    if (event.headers.hasOwnProperty(key)) {
      if (printOptions.includes(key)) {
        if (["landscape", "printbackground", "displayheaderfooter"].includes(key)) {
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
  log(`url: ${url}`);
  printParameters['url'] = url;
  log(`printParams: ${JSON.stringify(printParameters)}`);
  let buf = Buffer.from(JSON.stringify(printParameters));

  let params = {
    FunctionName: `${process.env.LAMBDANAME}`,
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
  let file_key = Date.now() + ".pdf";
  if (event.headers.filename) {
    file_key = event.headers.filename;
  }

  // AWS PART
  return callback(null, {
    statusCode: 200,
    body: `https://s3.amazonaws.com/${process.env.BUCKETNAME}/${file_key}`,
    headers: {
      'Content-Type': 'text/html',
    },
  })

}