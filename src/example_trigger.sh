curl -X POST \
  https://kmk1g66zoj.execute-api.us-east-1.amazonaws.com/dev/pdf \
  -H 'displayHeaderFooter: true' \
  -H 'landscape: false' \
  -H 'headertemplate: false' \
  -H 'footertemplate: false' \
  -H 'marginBottom: 0.2' \
  -H 'marginLeft: 0.2' \
  -H 'marginRight: 0.2' \
  -H 'marginTop: 0.2' \
  -H 'paperHeight: 11' \
  -H 'paperWidth: 8' \
  -H 'printBackground: true' \
  -H 'scale: 1' \
  -H 'x-user-id: 55507' \
  -H 'x-user-token: 4efb494f-9d2a-4fa1-885d-8f69a88dd869' \
  -H 'x-user-systemcode: W4240241236' \
  -H 'x-user-metro: tx-ho' \
  -H 'filename: test10.pdf' \
  -H 'url: https://www.apartmentdata.io/reports/tx-ho/custom/819/market_survey?s=1&i=1&c=1&h=1&limit=24&hp=1&f=1&fc=1&d=0&ds=1&da=1&df=1&dh=0&dp=2' > tmp
 
