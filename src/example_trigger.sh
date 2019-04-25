curl -X POST \
  https://hrcd959oka.execute-api.us-east-1.amazonaws.com/production-pdf-cluster/pdf \
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
  -H 'x-user-token: 3aac14d8-d18d-4abd-b982-b9373f0a2d1f' \
  -H 'x-user-systemcode: W4240241236' \
  -H 'x-user-metro: tx-ho' \
  -H 'filename: test10.pdf' \
  -H 'url: https://www.apartmentdata.io/reports/tx-ho/custom/692/market_survey?s=1&i=1&c=1&h=1&limit=13&hp=0&f=1&fc=1&d=0&ds=1&da=1&df=1&dh=1&dp=2' > tmp
 
