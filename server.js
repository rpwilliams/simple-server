"use strict";

const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const url = require('url');

const PORT = 8080;

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
    // Map request urls to files
    

    switch(req.url) {
        case '/':
            serveIndex('public', res);
            break;
        default:
        	var path = 'public' + req.url;
        	console.log(req.url);
        	if(isDirectory(path, res)) {
        		console.log(path + " is a directory! Now serving the index.");
        		serveIndex(path, res, req.url);
        	}
        	else if(isFile(path, res)) {
        		console.log(path + " is a file! Now serving the file.");
        		serveFile(path, res);
        	}
        	break;
    }
}

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