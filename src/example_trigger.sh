curl -X POST \
  https://123abc.execute-api.us-east-1.amazonaws.com/dev/pdf \
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
  -H 'url: http://www.google.com' > tmp.pdf
