"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var prettier = require("prettier");
var commander = require('commander');
var index_1 = require("./index");
var main = function () {
    commander.option('-o, --output <path>');
    var command = commander.parse(process.argv);
    var args = command.rawArgs;
    var outputPath = command.opts().output || 'schemes.json';
    var filePath = args[2];
    if (filePath == null) {
        console.error('File path is required.');
        process.exit(1);
    }
    var file = fs.readFileSync(path.resolve(filePath), { encoding: 'utf-8' });
    if (file == null) {
        console.log('No such file.', filePath);
        process.exit(1);
    }
    var openapiSchemes = (0, index_1.type2openapiSchemes)(file);
    var formattedSrc = prettier.format(openapiSchemes, { parser: 'json' });
    try {
        fs.writeFileSync(outputPath, formattedSrc);
        console.log("Successfully generated to \"".concat(outputPath, "\""));
    }
    catch (error) {
        console.error('Failed generating', error);
    }
};
exports["default"] = main;
