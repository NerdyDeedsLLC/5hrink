const m_http = require('http');
const m_url  = require('url');
const m_fso  = require('fs');
const m_path = require('path')

const contentTypes = {
    aac:   "audio/aac",                                       // "AACaudio"
    arc:   "application/octet-stream",                        // "Archivedocument(multiplefilesembedded)"
    avi:   "video/x-msvideo",                                 // "AVI:AudioVideoInterleave"
    bin:   "application/octet-stream",                        // "Anykindofbinarydata"
    bmp:   "image/bmp",                                       // "WindowsOS/2BitmapGraphics"
    css:   "text/css",                                        // "CascadingStyleSheets(CSS)"
    csv:   "text/csv",                                        // "Comma-separatedvalues(CSV)"
    doc:   "application/msword",                              // "MicrosoftWord"
    docx:  "application/msword",                              // "MicrosoftWord"
    eot:   "application/vnd.ms-fontobject",                   // "MSEmbeddedOpenTypefonts"
    epub:  "application/epub+zip",                            // "Electronicpublication(EPUB)"
    es:    "application/ecmascript",                          // "ECMAScript(IANASpecification4329-8.2)"
    gif:   "image/gif",                                       // "GraphicsInterchangeFormat(GIF)"
    htm:   "text/html",                                       // "HyperTextMarkupLanguage(HTML)"
    html:  "text/html",                                       // "HyperTextMarkupLanguage(HTML)"
    ico:   "image/x-icon",                                    // "Iconformat"
    ics:   "text/calendar",                                   // "iCalendarformat"
    jar:   "application/java-archive",                        // "JavaArchive(JAR)"
    jpg:   "image/jpeg",                                      // "JPEGimages"
    jpeg:  "image/jpeg",                                      // "JPEGimages"
    js:    "application/javascript",                          // "JavaScript(IANASpecification4329-8.2))"
    json:  "application/json",                                // "JSONformat"
    mpeg:  "video/mpeg",                                      // "MPEGVideo"
    odp:   "application/vnd.oasis.opendocument.presentation", // "OpenDocumentpresentationdocument"
    ods:   "application/vnd.oasis.opendocument.spreadsheet",  // "OpenDocumentspreadsheetdocument"
    odt:   "application/vnd.oasis.opendocument.text",         // "OpenDocumenttextdocument"
    otf:   "font/otf",                                        // "OpenTypefont"
    png:   "image/png",                                       // "PortableNetworkGraphics"
    pdf:   "application/pdf",                                 // "AdobePortableDocumentFormat(PDF)"
    rar:   "application/x-rar-compressed",                    // "RARarchive"
    sh:    "application/x-sh",                                // "Bourneshellscript"
    svg:   "image/svg+xml",                                   // "ScalableVectorGraphics(SVG)"
    swf:   "application/x-shockwave-flash",                   // "Smallwebformat(SWF)orAdobeFlash"
    tar:   "application/x-tar",                               // "TapeArchive(TAR)"
    tif:   "image/tiff",                                      // "TaggedImageFileFormat(TIFF)"
    tiff:  "image/tiff",                                      // "TaggedImageFileFormat(TIFF)"
    ts:    "application/typescript",                          // "Typescriptfile"
    ttf:   "font/ttf",                                        // "TrueTypeFont"
    txt:   "text/plain",                                      // "Text;(generallyASCIIorISO8859-n)"
    woff:  "font/woff",                                       // "WebOpenFontFormat(WOFF)"
    woff2: "font/woff2",                                      // "WebOpenFontFormat(WOFF)"
    xhtml: "application/xhtml+xml",                           // "XHTML"
    xml:   "application/xml",                                 // "XML"
    xul:   "application/vnd.mozilla.xul+xml",                 // "XUL"
    zip:   "application/zip",                                 // "ZIP archive"
}

const PUBLIC_ROOT="./public/";

m_http.createServer(function(req, res) {
    const urlObj = m_url.parse(req.url, true);
    const reqUrl = `.${ urlObj.pathname }`;
    console.log('Requested URL (reqUrl) ', reqUrl)
    // if(null == reqUrl) return false;
    const filExt = m_path.extname(reqUrl).replace(/\./g,'');
    console.log('filExt', filExt)
    // if(null == filExt) return false;

    function serveStaticFile(res, path, extension='html', contentType=contentTypes['html'], responseCode=200) {
        //console.log('serveStaticFile', 'path:', path, 'contentType:', contentType, 'responseCode:', responseCode, 'ext', parseFileExtension(path))
        console.log(extension, " : ", contentType);
        
        m_fso.readFile(PUBLIC_ROOT + path, function(err, data) {
            if(err) {
                res.writeHead(500, { 'Content-Type' : 'text/plain' });
                res.end('500 - Internal Error', err);
            } 
            else {
                res.writeHead( responseCode, { 'Content-Type' : contentType });
                res.write(data)
                res.end();
            }
        });
    }

    if(filExt == ''){
        // Do the expiry shit
        serveStaticFile(res, '410.html');
    }else{
        serveStaticFile(res, reqUrl, filExt, contentTypes[filExt]);
    }
    // return res.end();
    // switch(filExt){
    //     case "":
    //         m_fso.readFile(reqUrl, function(err, data) {
    //             if (err) {
    //                 res.writeHead(404, {
    //                     'Content-Type': 'text/html'
    //                 });
    //                 return res.end("404 Not Found");
    //             }

    //             const render410 = async (filename="./public/410.html")=> {
    //               m_fso.readFile(filename, function(err, data) {
    //                 if (err) {
    //                   return err;
    //                 }  
    //                 res.writeHead(410, {'Content-Type': 'text/html'});
    //                 res.write(data);
    //                 return 1;
    //               });
    //             }

    //             let hrdData = data.toString();
    //             let expires = hrdData.replace(/^(\d+).*$/, '$1');
    //             let present = new Date().getTime();
    //             let tooLate = (present - expires >= 18000000);
    //             let targUrl = data.toString().replace(/^\d+\-\|(.*)\|\-$/i, '$1');
    //             if (!tooLate) {
    //                 // res.writeHead(302, {
    //                 //     Location: targUrl
    //                 // });
    //                 // return res.end();
    //             } else {
    //                 // m_fso.readFile("public/410.html", function(err, data) {
    //                 //     if (err) {
    //                 //         res.writeHead(404, {
    //                 //             'Content-Type': 'text/html'
    //                 //         });
    //                 //         return res.end("Can't even 410 out, yo! Dassa 404!");
    //                 //     }
    //                 //     let op=data;
    //                 //     res.writeHead(200, {
    //                 //         'Content-Type': 'text/html'
    //                 //     });
    //                 //     res.write(op, 'utf-8');
    //                 //     return res.end();
    //                 // });
    //                 serveStaticFile(res, 'public/410.html', 'text/html');

    //             }
    //         });
    //     break;
    //     case "png":
    //         serveStaticFile(res, reqUrl, 'image/png');
    //         break;
    //     case "woff":
    //         serveStaticFile(res, reqUrl, 'font/woff');
    //         break;
    // }
}).listen(8080);