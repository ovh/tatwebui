module.exports = function(grunt) {
    'use strict';

    var _ = require('lodash');

    grunt.registerMultiTask('xml2json', 'Transform XML to JSON', function() {

        function formatTranslation(object) {
            var result = {};
            object.forEach(function(elem) {
                if (elem.hasOwnProperty('id') && elem.hasOwnProperty('text') && !~elem.id.indexOf('>')) {
                    result[elem.id] = elem.text;
                }
                else {
                    grunt.fail.fatal('Error: xml: format is incorrect');
                }
            });
            return result;
        }

        function toJson(filePath) {
            var data = grunt.file.read(filePath),
                reg = /<translation\s+id="([\w-]+?)"\s*(qtlid="([0-9]+)")?\s*(?:translate="none")?\s*?>((?:.|\n|\r)*?)<\/translation>/gi,
                obj = [], match;

            while ((match = reg.exec(data))) {
                var elem = {
                    id: match[1],
                    text: match[4].replace(/&#13;\n/g, " ")
                };
                obj.push(elem);
            }
            return JSON.stringify(formatTranslation(obj));
        }

        var files = grunt.file.expand(this.data);
        files.forEach(function(file) {
            var newFilePath = file.replace(/\.xml/, '.json');
            var json = toJson(file);
            grunt.file.write(newFilePath, json);
        });


        // Extend missing key
        var regExpFrFR = new RegExp(/Messages_fr_FR\.json$/g);
        var regExpOther = new RegExp(/Messages_fr_FR\.json$/g);
        var memoize = {};

        this.files.forEach(function (d) {

            var jsonFile = d.dest.replace(/\.xml$/, '.json');
            var xmlFiles = d.src;

            var str = '';
            for (var i=0; i<xmlFiles.length; i++) {
                str += toJson(xmlFiles[i]);
            }

            if (d.baseFile) {
                for (var j=0; j< d.baseFile.length; j++) {
                    var customJsonFile = jsonFile.replace(/[^\/]*$/, d.baseFile[j]);
                    grunt.log.subhead('Writing translation ' + customJsonFile);
                    grunt.file.write(customJsonFile, str);
                }
            } else {
                grunt.log.subhead('Writing translation ' + jsonFile);
                grunt.file.write(jsonFile, str);
            }
        });

    });
};
