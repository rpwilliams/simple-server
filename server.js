"use strict";

const http = require('http');
const fs = require('fs');

const PORT = 8080;

function serveIndex(path, req, res) {
	fs.readdir(path, function(err, files) {
		if(err) {
			console.log(err);
			res.statusCode = 500;
			res.end("Error 500: Could not read directory");
		}
		var html = "<p>Index of " + path + "</p>";
        html += "<ul>";
        html += files.map(function(item){
        	if(req.url !== '/') {
        		item = req.url + '/' + item;
        		console.log(item);
        	}
            return "<li><a href='" + item + "'>" + item + "</a></li>";
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
	fs.exists(path, function(exists) {
		if(!exists) {
			console.log("Error 404");
			res.statusCode = 404;
			res.end("Error 404: File not found")
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
    // Map request urls to files
    switch(req.url) {
        case '/':
            serveIndex('public', req, res);
            break;
        default:
        	var path = 'public' + req.url;
        	if(isDirectory(path)) {
        		serveIndex(path, req, res);
        	}
        	else if(isFile(path)) {
        		serveFile(path, res);
        	}
        	break;
    }
}

function isDirectory(path) {
	console.log("Checking if " + path + " is a file");

	return fs.lstatSync(path).isDirectory();
}

function isFile(path) {
	console.log("Checking if " + path + " is a file");

	return fs.lstatSync(path).isFile();
}

// Create the web server
var server = http.createServer(handleRequest);

// Start listening on PORT
server.listen(PORT, function(){
	console.log("Listening on port " + PORT);
});