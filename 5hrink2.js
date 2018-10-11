const localhostPort = process.env.PORT || 31173;
const m_http = require('http');
const m_url  = require('url');
const m_fso  = require('fs');

m_http.createServer(function (req, res) {
	const urlObj = m_url.parse(req.url, true);
	const reqUrl = `.${ urlObj.pathname }`;

	m_fso.readFile(reqUrl, function(err, data) {
    if (err) {
      console.error("Core Server Error", err);
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }  
    const render410 = async (filename="./public/410.html")=> {
      console.log("Whoops! Too late! Awww. -,-")
      m_fso.readFile(filename, function(err, data) {
        if (err) {
          return err;
        }  
        res.writeHead(410, {'Content-Type': 'text/html'});
        res.write(data);
        return 1;
      });
    }
    let hrdData = data.toString();
    let expires = hrdData.replace(/^(\d+).*$/, '$1');
    let present = new Date().getTime();
    let tooLate = (present - expires >= 18000000);
    let targUrl = data.toString().replace(/^\d+\-\|(.*)\|\-$/i,'$1');
    console.log(expires, present, tooLate, targUrl);
    if(!tooLate){    
      res.writeHead(302,{Location: targUrl});  
      return res.end();
    }else{
       render410().then(()=>res.end());
    }
  });

}).listen(localhostPort);
console.log(`NodeJS HTTP server now active and running on port ${localhostPort} (http://localhost:${localhostPort})!`);
