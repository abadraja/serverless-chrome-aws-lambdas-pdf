curl -X POST \
  https://1111111111.execute-api.us-east-1.amazonaws.com/dev/pdf \
  -H 'displayHeaderFooter: true' \
  -H 'footerTemplate: <div class="page-footer" style="width:100%; text-align:right; font-size:12px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>' \
  -H 'headerTemplate: <div class="page-footer" style="width:100%; text-align:right; font-size:12px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>' \
  -H 'landscape: false' \
  -H 'marginBottom: 0.2' \
  -H 'marginLeft: 0.2' \
  -H 'marginRight: 0.2' \
  -H 'marginTop: 0.2' \
  -H 'paperHeight: 11' \
  -H 'paperWidth: 8' \
  -H 'printBackground: true' \
  -H 'scale: 1' \
  -H 'x-user-id: 55507' \
  -H 'x-user-token: 31713417-8868-4e7e-84fa-2221a6a3b028' \
  -H 'x-user-systemcode: W4240241236' \
  -H 'x-user-metro: tx-ho' \
  -H 'filename: test9.pdf' \
  -H 'url: https://www.apartmentdata.io/reports/tx-ho/custom/819/market_survey?s=1&i=1&c=1&h=1&limit=24&hp=1&f=1&fc=1&d=0&ds=1&da=1&df=1&dh=0&dp=2' > tmp

 
