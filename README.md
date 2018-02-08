Either expanding on your own in-class work, the example repository (https://github.com/CIS526S18/server-example (Links to an external site.)Links to an external site.), or starting from scratch, build a webserver in Node that will serve static files from a public directory and any of its subdirectories.  This server should:

DONE: 1) Serve files in the public directory when requested, i.e. an HTTP request for /openhouse.html should serve the file public/openhouse.html (note that the virtual path and file path are not identical).

DONE: 2) Use asynchronous methods (i.e. fs.readFile, fs.readdir) to load files and determine the contents of the directory (since we don't know how many files to expect, we won't use a cache strategy).  Refer to the FileSystem documentation for details: https://nodejs.org/api/fs.html (Links to an external site.)Links to an external site. 

DONE: 3) Generate an index page listing a directory's contents when that directory is requested (i.e. the http request for subdirectory/ should list the contents of public/subdirectory, and a request for / should list the contents of public/).  BUT, if the directory/subdirectory has an index.html file defined, it should be served instead.

4) Serve a 404, file not found error if the resource requested does not exist.

Be aware that in grading your homework, we will add files to the public directory as the server is running - therefore you need to make sure it checks for a file's existence every time it is requested.

EXTRA CREDIT: Without using an external (npm) library, supply the appropriate mime type text/html, text/css, text/js, image/jpeg, image/png, image/gif) for the file based on its extension (html, css, js, jpeg, png).  This will need to be set in the response headers using res.setHeader('Content-Type', <mime type>).  See the http.ServerResponse documentation for details: https://nodejs.org/api/http.html#http_class_http_serverresponse (Links to an external site.)Links to an external site..

Zip your project folder and submit it through KSOL.