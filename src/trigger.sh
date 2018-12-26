curl -X POST \
  https://mjyddfd24b.execute-api.us-east-1.amazonaws.com/dev/pdf \
  -H 'displayHeaderFooter: true' \
  -H 'footerTemplate: <div class="page-footer" style="width:100%; text-align:right; font-size:12px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>' \
  -H 'headerTemplate: <div class="page-footer" style="width:100%; text-align:right; font-size:12px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>' \
  -H 'landscape: true' \
  -H 'marginBottom: 0.2' \
  -H 'marginLeft: 0.2' \
  -H 'marginRight: 0.2' \
  -H 'marginTop: 0.2' \
  -H 'paperHeight: 11' \
  -H 'paperWidth: 8' \
  -H 'printBackground: true' \
  -H 'scale: 1' \
  -H 'X-User-Id: 55507' \
  -H 'X-User-Token: 9030ffb6-4f28-4b7d-8e96-d57bc1d25ee0' \
  -H 'X-User-SystemCode: W4240241236' \
  -H 'X-User-Metro: tx-ho' \
  -H 'url: http://www.apartmentdata.io/dashboard/tx-ho/change-report' > tmp.pdf
