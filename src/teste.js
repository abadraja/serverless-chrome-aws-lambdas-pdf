data = 'eyJodG1sLWNvZGUiOiAiPEhFQUQ+PFRJVExFPllvdXIgVGl0bGUgSGVyZTwvVElUTEU+PC9IRUFEPjxCT0RZIEJHQ09MT1I9IkZGRkZGRiI+PENFTlRFUj48SU1HIFNSQz0iY2xvdWRzLmpwZyIgQUxJR049IkJPVFRPTSI+IDwvQ0VOVEVSPjxIUj48YSBocmVmPSJodHRwOi8vc29tZWdyZWF0c2l0ZS5jb20iPkxpbmsgTmFtZTwvYT5pcyBhIGxpbmsgdG8gYW5vdGhlciBuaWZ0eSBzaXRlPEgxPlRoaXMgaXMgYSBIZWFkZXI8L0gxPjxIMj5UaGlzIGlzIGEgTWVkaXVtIEhlYWRlcjwvSDI+U2VuZCBtZSBtYWlsIGF0IDxhIGhyZWY9Im1haWx0bzpzdXBwb3J0QHlvdXJjb21wYW55LmNvbSI+c3VwcG9ydEB5b3VyY29tcGFueS5jb208L2E+LjxQPiBUaGlzIGlzIGEgbmV3IHBhcmFncmFwaCE8UD4gPEI+VGhpcyBpcyBhIG5ldyBwYXJhZ3JhcGghPC9CPjxCUj4gPEI+PEk+VGhpcyBpcyBhIG5ldyBzZW50ZW5jZSB3aXRob3V0IGEgcGFyYWdyYXBoIGJyZWFrLCBpbiBib2xkIGl0YWxpY3MuPC9JPjwvQj48SFI+PC9CT0RZPjwvSFRNTD4ifQ==';

buff = new Buffer(data, 'base64');
text = buff.toString('ascii');

console.log(text);
console.log(typeof text);
console.log(JSON.parse(text));

