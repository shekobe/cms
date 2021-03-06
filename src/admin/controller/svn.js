/*jslint node: true */
"use strict";

var spawn = require('child_process').spawn;
var path = require('path');
var util = require('util');
var EventEmitter = require("events").EventEmitter;
var convert = require("buffer-encoding").convert;

var SVN = function (repo, readyCallback) {
    //console.log('repo',repo);
    var _this = this;
    this.repoConfig = repo;
    this.repoRoot = repo.path;
    this.run('svn', ['--version'], function (err, text) {
        if (!err) {
            _this.refreshInfoCache("info", readyCallback);
        } else {
            readyCallback(err, null);
        }
    });
};

util.inherits(SVN, EventEmitter);

var svn = SVN.prototype;

// TODO: this function really necessary, all I am saving is the scope[...] call?
svn.refreshInfoCache = function (infoCacheName, callback, revision) {
    var scope = this;
    this.getInfo(function (err, info) {
        scope[infoCacheName] = info;
        if (callback) {
            callback(err, info);
        }
    }, revision);
};


//svn.info = function (){
//    return { url:"svn://10.1.23.13/web/branches/founder/qikunode"}
//}


svn.switchUrl = function (path, callback) {
    var _this = this;
    return this.run('svn', ['switch', path, this.repoRoot, '--accept', 'postpone'], function (err, text) {
        if (!err) {
            // Update the info if we successfully updated
            _this.refreshInfoCache("info", function (err, info) {
                callback(null, info);
            });
        } else {
            window.confirm(err + text);
            callback(err, null);
        }
    });
};

// svn.switchPaths = function (rev, paths, callback) {
//     var _this = this, absPaths = paths.map(function (file) { return _this.repoRoot + file; });
//     return this.run('svn', ['switch', '-r', rev].concat(absPaths), callback);
// };

svn.diffExternal = function (file, revision, callback) {
    return this.run('svn', ['diff', '-c', revision, this.repoRoot + file], callback);
};

svn.diffLocal = function (file, callback) {
    return this.run('svn', ['diff', this.repoRoot + file], callback);
};

//returns a summary of changes from a revision range
svn.diffChangeList = function (startRev, endRev, callback) {
    return this.run('svn', ['diff', '-r', startRev + ":" + endRev, '--summarize'], callback);
};

svn.update = function (callback, revision) {
    var args = ['update', this.repoRoot];
    var _this = this;

    if (revision !== undefined) {
        args = args.concat(["-r", revision]);
    }

    args = args.concat(['--accept', 'postpone']);
    return this.run('svn', args, function (err, text) {
        if (!err) {
            // Update the info if we successfully updated
            _this.refreshInfoCache("info", function (err, info) {
                callback(null, info);
            });
        } else {
            callback(err);
        }
    });
};

svn.isUpToDate = function(callback) {
    var _this = this;
    _this.refreshInfoCache("info", function (err, info) {
        if (!err) {
            _this.refreshInfoCache("headInfo", function (headErr, headInfo) {
                callback(!headErr && parseInt(info.revision, 10) >= parseInt(headInfo.revision, 10));
            }, "HEAD");
        } else {
            callback(false);
        }
    });
};

svn.setProperty = function (path, propName, value, callback) {
    if (value === null) {
        this.run('svn', ["pd", propName, path], callback);
    } else {
        this.run('svn', ["ps", propName, value, path], callback);
    }
};

svn.getProperty = function (path, propName, callback) {
    this.run('svn', ["pg", propName, path], callback);
};

svn.getProperties = function (path, callback) {
    var _this = this;
    this.run('svn', ["pl", path], function (err, text) {
        if (!err) {
            var lines = text.replace(/\r\n/g, "\n").replace(/ /g, "").split("\n").filter(function(ele) { return !!ele; });
            var props = {};
            if (lines.length > 0) {
                lines.shift(); // Skip the first one as it is not a property
                lines.forEach(function (ele, i) {
                    var propName = lines[i] = ele.trim();
                    if (propName) {
                        _this.run('svn', ['pg', propName, path], function (err, text) {
                            lines.splice(lines.indexOf(propName), 1);
                            if (!err) {
                                props[propName.trim()] = text;
                                // Were done
                                if (lines.length === 0) {
                                    callback(null, props);
                                }
                            } else {
                                callback(err, null);
                            }
                        });
                    }
                });
            } else {
                callback(null, props)
            }
        } else {
            callback(err, null);
        }
    });
};

//TODO: ghetto. refactor
svn.getFile = function (file, revision, callback) {
    var path = this.repoRoot + file;
    if (revision) {
        return this.run('svn', ["cat", "-r", revision, path], callback);
    }
    return this.run('cat', [path], callback);
};

svn.getInfo = function (callback, revision) {
    var _this = this,
        args = ['info', this.repoRoot];
    if (revision) {
        args = args.concat(['-r', revision]);
    }

    return this.run('svn', args, function (err, text) {
        if (!err) {
            callback(null, _this._parseInfo(text));
        } else {
            callback(err, null);
        }
    });
};

svn.log = function (path, limit, callback) {
    var _this = this;

    return this.run('svn', ['log', 'https://10.100.13.10/svn/EC/ec-b2c/3.development/trunk/front-web/qikuweb', '-v', '-l', limit || 25, '-r', 'HEAD:1', '--incremental'], function (err, text) {
        if (!err) {
            callback(null, _this._parseLog(text));
        } else {
            callback(err, null);
        }
    });
};

svn.revertLocal = function (file, callback) {
    return this.run('svn', ['revert', this.repoRoot + file], callback);
};

svn.revertRevision = function (file, rev, callback) {
    return this.run('svn', ['merge', '-c', "-" + rev, this.info.url + file.replace(/\\/g, "/"), '--accept', 'postpone'], callback);
};

svn.status = function (callback) {
    var _this = this;
    return this.run('svn', ['status', this.repoRoot], function (err, text) {
        if (!err) {
            callback(null, _this._parseStatus(text));
        } else {
            callback(err, null);
        }
    });
};

svn.commit = function (options, callback) {
    var _this = this,
        args = ['commit', "-m", options.message].concat(options.files.map(function (file) { return _this.repoRoot + file; }));
    return this.run('svn', args, callback);
};

svn.add = function (path, callback) {
    return this.run('svn', ['add', this.repoRoot + path], callback);
};

svn.cleanup = function (path, callback) {
    return this.run('svn', ['cleanup', this.repoRoot + path], callback);
};

svn.run = function (cmd, args, callback) {
    var BufHep = require('bufferhelper')
    var outhep = new BufHep()
    var errhep = new BufHep()
    var text = "",
        err = "",
        proc = spawn(cmd, args, { cwd: this.repoRoot });

    if (cmd === "svn") {
        args = args.concat(['--non-interactive', '--trust-server-cert']);
    }

    if (cmd === "svn" && this.repoConfig.username && this.repoConfig.pw) {
        args = args.concat(['--username', this.repoConfig.username, '--password', this.repoConfig.pw]);
    }

    this.emit("cmd", proc, cmd, args);

   // console.warn("Running cmd: ", cmd, args);

    proc.stdout.on('data', function (data) {
        // text += data;
        outhep.concat(data)
    });

    proc.stderr.on('data', function (data) {
        errhep.concat(data)
        // data = String(data);

        //ssh warning, ignore
        if (data.indexOf("Killed by signal 15.") === -1) {
            // err += data;
            // console.error(data);
        }
    });

    proc.on('close', function (code) {
        if (callback) {
            // callback(err, text);
            var errtext = convert(errhep.toBuffer(), 'utf8').toString()
            var outtext = convert(outhep.toBuffer(), 'utf8').toString()
            callback(errtext, outtext);
        }
    });

    return proc;
};

svn._parseLogEntry = function (logText) {
    // console.log('_parseLogEntry',logText);
    var array = logText.split("\n"),
        log = {},
        i = 0,
        header = array[0],
        changeString,
        relativeUrl = this.info.url.replace(this.info.repositoryroot, "");

    while (header === "") {
        header = array[i += 1];
    }

    header = header.split(" | ");

    log.revision = header[0].substr(1);
    log.author = header[1];
    log.date = new Date(header[2]);
    log.changes = [];

    for (i = i + 2; i < array.length; i += 1) {
        changeString = array[i].trim();
        if (changeString === "") {
            break;
        }
        log.changes.push({
            path: path.normalize(changeString.substr(1).trim().replace(relativeUrl, "")),
            status: changeString.substr(0, 1)
        });
    }

    log.message = "";

    for (i += 1; i < array.length - 1; i += 1) {
        log.message += array[i];
        if (i !== array.length - 2) {
            log.message += "\n";
        }
    }

    return log;
};

svn._parseInfo = function (text) {
    var array = text.replace(/\r\n/g, "\n").split("\n"),
        info = {};
    array.forEach(function (line) {
        var firstColon = line.indexOf(":");
        info[line.substring(0, firstColon).replace(/\s*/g, "").toLowerCase()] = line.substring(firstColon + 1).trim();
    });
    return info;
};


svn._parseLog = function (text) {
    var array = text.replace(/\r\n/g, "\n").split("------------------------------------------------------------------------"),
        logList = [],
        item,
        i;

    for (i = 1; i < array.length; i += 1) {
        item = this._parseLogEntry(array[i]);
        if (item) {
            logList.push(item);
        }
    }

    return logList;
};

svn._parseStatus = function (text) {
    var split = text.replace(/\r\n/g, "\n").split("\n"),
        changes = [],
        line;

    for (var i = 0; i < split.length; i += 1) {
        line = split[i];
        if (line.trim().length > 1) {
            changes.push({
                status: line[0],
                path: path.resolve(line.substr(7).trim()).replace(this.repoRoot, "")
            });
        }
    }
    return changes;
};

module.exports = function (repo, readyCallback) {
    return new SVN(repo, readyCallback);
};