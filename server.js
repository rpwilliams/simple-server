"use strict";

const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const url = require('url');

const PORT = 3000;

/** @function serveIndex
 * Serves a directory and lists its files, unless it contains index.html
 * @param {string} path - the path (WITH public/) to the directory
 * @param {http.serverResponse} res - the http response object
 * @param {string} path - the path (WITHOUT public/) to the directory
 */
function serveIndex(path, res, pathWithoutPublic) {
	fs.readdir(path, function(err, files) {
		if(err) {
			console.log(err);
			res.statusCode = 500;
			res.end("Error 500: Could not read directory");
		}
		var html = "<p>Index of " + path + "</p>";
        html += "<ul>";
        html += files.map(function(item){
        	console.log("Path without public: " + pathWithoutPublic + '/' + item);
        	if(pathWithoutPublic !== undefined) {
        		return "<li><a href='" + pathWithoutPublic + '/' + item + "'>" + item + "</a></li>";
        	}
        	else {
        		/* If the directory has an index.html, serve that instead */
        		// if(item == "index.html") {
        		// 	serveFile(path, res);
        		// 	return;
        		// }
        		return "<li><a href='" + item + "'>" + item + "</a></li>";
        	}
            
        }).join("");
        html += "</ul>";
        res.end(html);
	});
}

/** @function serveFile
 * Serves the specified file with the provided response object
 * @param {string} path - specifies the file path to read 
 * @param {http.serverResponse} res - the http response object
 */
function serveFile(path, res) {
	/* Check for 404: File Not Found */
	fs.existsSync(path, function(exists) {
		if(!exists) {
			createError404(res);
		}
	});

	fs.readFile(path, function(err, data) {
		if(err) {
			console.error(err);
			res.statusCode = 500;
			res.end("Error 500: Could not read file");
			return;
		}
		res.end(data);
	});
}

/** @function handleRequest 
 * Request handler for our http server 
 * @param {http.ClientRequest} req - the http request object
 * @param {http.ServerResponse} res - the http response object
 */
function handleRequest(req, res) {  
    switch(req.url) {
        case '/':
            serveIndex('public', res);
            break;
        default:
        	var path = 'public' + req.url;
        	console.log(req.url);
        	if(isDirectory(path, res)) {
        		console.log(path + " is a directory! Now serving the index.");
        		if(fs.existsSync(path + "/index.html")) {
					console.log("\nOpe just kidding! It had an index.html, serving that instead.");
					serveFile(path + "/index.html", res);
					break;
				}
        		serveIndex(path, res, req.url);
        	}
        	else if(isFile(path, res)) {
        		console.log(path + " is a file! Now serving the file.");
        		serveFile(path, res);
        	}
        	break;
    }
}


/** @function isDirectory
 * Returns true if the path is a directory
 * @param {string} path - the path to the directory or file
 * @param {http.ServerResponse} res - the http response object
 */
function isDirectory(path, res) {
	console.log("\nChecking if " + path + " is a directory...");
	if(fs.existsSync(path)) {
		return fs.lstatSync(path).isDirectory();
	}
	else {
		console.log("Directory could not be found.");
		createError404(res);
		return;
	}
}

/** @function isFile
 * Returns true if the path is a file
 * @param {string} path - the path to the directory or file
 * @param {http.ServerResponse} res - the http response object
 */
function isFile(path, res) {
	console.log("Checking if " + path + " is a file...");
	if(fs.existsSync(path)) {
		return fs.lstatSync(path).isFile();
	}
	else {
		console.log("File could not be found.");
		createError404(res);
		return;
	}
}

/** @function createError404
 * Creates an error 404
 * @param {http.ServerResponse} res - the http response object
 */
function createError404(res) {
	console.log("Error 404");
	res.statusCode = 404;
	res.end("Error 404");
}

// Create the web server
var server = http.createServer(handleRequest);

// Start listening on PORT
server.listen(PORT, function(){
	console.log("Listening on port " + PORT);
});