var querystring = require('querystring');
var http = require('http');

exports.handler = function (event, context) {
var post_data = querystring.stringify(
      event.body
  );

  // An object of options to indicate where to post to
  var post_options = {
      host: 'https://mjyddfd24b.execute-api.us-east-1.amazonaws.com/dev/pdf',
      port: '80',
      path: '/pdf',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      },
      body: {
        "url": "https://mjyddfd24b.execute-api.us-east-1.amazonaws.com/dev/pdf",
        "landscape": "true",
        "displayHeaderFooter": "true",
        "printBackground": "true",
        "scale": "1",
        "paperWidth": "8",
        "paperHeight": "11",
        "marginTop": "0.2",
        "marginBottom": "0.2",
        "marginLeft": "0.2",
        "marginRight": "0.2"
    }
        
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
          context.succeed();
      });
      res.on('error', function (e) {
        console.log("Got error: " + e.message);
        context.done(null, 'FAILURE');
      });

  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}