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
  -d '<HEAD><TITLE>Your Title Here</TITLE></HEAD><BODY BGCOLOR="FFFFFF"><CENTER><IMG SRC="clouds.jpg" ALIGN="BOTTOM"> </CENTER><HR><a href="http://somegreatsite.com">Link Name</a>is a link to another nifty site<H1>This is a Header</H1><H2>This is a Medium Header</H2>Send me mail at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>.<P> This is a new paragraph!<P> <B>This is a new paragraph!</B><BR> <B><I>This is a new sentence without a paragraph break, in bold italics.</I></B><HR></BODY></HTML>' > tmp.pdf
  

  # -H 'url: http://www.apartmentdata.io/dashboard/tx-ho/change-report' > tmp.pdf
  # -H 'X-User-Id: 55507' \
  # -H 'X-User-Token: some-key' \
  # -H 'X-User-SystemCode: W4240241236' \
  # -H 'X-User-Metro: tx-ho' \


  # -d '<HEAD><TITLE>Your Title Here</TITLE></HEAD><BODY BGCOLOR="FFFFFF"><CENTER><IMG SRC="clouds.jpg" ALIGN="BOTTOM"> </CENTER><HR><a href="http://somegreatsite.com">Link Name</a>is a link to another nifty site<H1>This is a Header</H1><H2>This is a Medium Header</H2>Send me mail at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>.<P> This is a new paragraph!<P> <B>This is a new paragraph!</B><BR> <B><I>This is a new sentence without a paragraph break, in bold italics.</I></B><HR></BODY></HTML>' > tmp.pdf
