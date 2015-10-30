/*jslint nomen: true*/
/*global require, module,  __dirname */

module.exports = function (grunt) {
    "use strict";

    // Load Grunt tasks declared in the package.json file
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Configure Grunt
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        project: {
            build: './.build',
            dist: './.dist',
            app: './app'
        },

        jshint: {
            dev: [
                '<%= project.app%>/**/*.js',
                'index.js',
                'Gruntfile.js'
            ]
        },

        clean: {
            dist: ['<%= project.dist%>', '<%= project.build%>'],
            dev: ['<%= project.build%>']
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        flatten: false,
                        src: ['<%= project.app%>/**/*.*', 'index.js', 'node_modules/**/*.*'],
                        dest: '<%= project.dist%>/',
                        filter: 'isFile'
                    }
                ]
            }
        }
    });

    grunt.registerTask('dist', [
        'jshint:dev',
        'clean:dist',
        'copy:dist'
    ]);

    grunt.registerTask('default', ['dist']);
};
