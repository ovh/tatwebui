#!/usr/bin/env node

/*global require*/
(function () {
    'use strict';

    var cluster = require('cluster');
    var config = require('./app/config.json');

    var logger = function () {
        var d = new Date();
        var data = [d.toISOString() + '[' + process.pid + ']: >'];
        var args = Array.prototype.slice.call(arguments);
        return console.log.apply(this, data.concat(args));
    };

    if (cluster.isMaster) {
        var nbProcesses = parseInt('' + config.process.nb_forks, 10);

        console.log('######################################');
        console.log('############## API REST ##############');
        console.log('######################################' + "\n");
        console.log('Creating ' + (2*nbProcesses) + ' processes');

        // Launch server processes
        var serverProcess = [];
        for (var i = 0; i < nbProcesses; i++) {
            serverProcess.push({
                pid: cluster.fork({
                    task: 'fileServer'
                }).process.pid,
                task: 'fileServer'
            });
            serverProcess.push({
                pid: cluster.fork({
                    task: 'proxyServer'
                }).process.pid,
                task: 'proxyServer'
            });
        }

        cluster.on('exit', function (worker) {
            logger('Worker ' + worker.process.pid + ' died :(');
            // check if this is a server process
            for (var i=0; i<serverProcess.length; i++) {
                if (serverProcess[i].pid === worker.process.pid) {
                    var task = serverProcess[i].task;
                    serverProcess[i] = {
                        pid: cluster.fork({
                            task: task
                        }).process.pid,
                        task: task
                    };
                    return;
                }
            }
        });
    } else {
        switch (process.env.task) {
        case 'fileServer':
            var fileApp = require('./app/file-server.js');
            fileApp.logger = logger;
            fileApp.set('port', process.env.PORT || config.filesystem.listen_port);

            /* Binding */
            var fileServer = fileApp.listen(fileApp.get('port'), function () {
                logger('Express file-server listening on port ' + fileServer.address().port);
            });
            break;
        case 'proxyServer':
            var proxyApp = require('./app/proxy-server.js');
            proxyApp.logger = logger;
            proxyApp.set('port', process.env.PORT || config.proxy.listen_port);

            /* Binding */
            var proxyServer = proxyApp.listen(proxyApp.get('port'), function () {
                logger('Express proxy-server listening on port ' + proxyServer.address().port);
            });
            break;
        default:
            break;
        }
    }
})();
