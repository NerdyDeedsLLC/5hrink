const m_http = require('http');
const m_url  = require('url');
const m_fso  = require('fs');

m_http.createServer(function (req, res) {
	const urlObj = m_url.parse(req.url, true);
	const reqUrl = `.${ urlObj.pathname }`;

	m_fso.readFile(reqUrl, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }  
// 1538607315553-|http://www.google.com|-
    let hrdData = data.toString();
    let expires = hrdData.replace(/^(\d+).*$/, '$1');
    let present = new Date().getTime();
    let tooLate = (present - expires >= 18000000);
    let targUrl = data.toString().replace(/^\d+\-\|(.*)\|\-$/i,'$1');
    console.log(expires, present, tooLate, targUrl);
    if(!tooLate) res.writeHead(302,{Location: targUrl});
    // else res.writeHead(410, {'Content-Type': 'text/html'});
    // res.write(data.replace(/^\d+\-\|(.*)\|\-/,"$1"));
    // res.redirect(301, 'http://www.' + url);
    return res.end();
  });
}).listen(8080);