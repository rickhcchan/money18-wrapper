var async = require('async');
var express = require('express');
var iconv = require('iconv-lite')
var request = require('request');
var util = require('util');

var extend = util._extend;

var PORTS = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT;
var IPS = process.env.IP || process.env.OPENSHIFT_NODEJS_IP;

var InfoType = Object.freeze({
    STOCK_DAILY_INFO: 0,
    STOCK_OPENING_INFO: 1,
    STOCK_REALTIME_INFO: 2
});

var DAILY_MODE_RESOURCE = 'd';
var OPENING_MODE_RESOURCE = 'o';
var REALTIME_MODE_RESOURCE = 'r';
var FULL_MODE_RESOURCE = 's';

var STOCK_DAILY_INFO_URL = 'http://money18.on.cc/js/daily/hk/quote/%s_d.js?t=%s';
var STOCK_OPENING_INFO_URL = 'http://money18.on.cc/js/real/hk/opening/%s_o.js?t=%s';
var STOCK_REALTIME_INFO_URL = 'http://money18.on.cc/js/real/hk/quote/%s_r.js?t=%s';

var CONTENT_TYPE = 'application/json; charset=utf8';
var REFERER = 'http://money18.on.cc/';
var BIG5 = 'Big5';

var app = express();

var getURL = function(type, code) {
    var url;
    switch (type) {
        case InfoType.STOCK_DAILY_INFO:
            url = STOCK_DAILY_INFO_URL;
            break;
        case InfoType.STOCK_OPENING_INFO:
            url = STOCK_OPENING_INFO_URL;
            break;
        case InfoType.STOCK_REALTIME_INFO:
        default:
            url = STOCK_REALTIME_INFO_URL;
    }
    var timestamp = new Date().getTime().toString();
    return util.format(url, code, timestamp.substring(0, timestamp.length - 3) + "9" + timestamp.substring(timestamp.length - 2))
}

var fetch = function(url, callback) {
    var options = {
        url: url,
        headers: {
            'Content-type': CONTENT_TYPE,
            'Referer': REFERER
        },
        encoding: null
    };
    var json = {};
    request(options, function(error, response, body) {
        if (error) {
            json.error = error.message;
        }
        else if (!response) {
            json.error = 'invalid response';
        }
        else if (response.statusCode != 200) {
            json.error = 'invalid response code';
        }
        else {
            body = iconv.decode(body, BIG5).replace(/'/g, '\"');
            var match = body.match(/\{([^)]+)\}/);
            if (match && match.length > 0) {
                try {
                    json = JSON.parse(match[0]);
                }
                catch (e) {
                    json.error = 'invalid response content'
                }
            }
            else {
                json.error = 'invalid response content';
            }

        }
        callback(null, json);
    });
};

var getStockInfo = function(type, code, callback) {
    fetch(getURL(type, code), function(error, result) {
        if (error) {
            callback(error);
        }
        else {
            callback(null, result);
        }
    });
};

var processRequest = function(types, codes, callback) {
    codes = codes.map(function(code) {
        return (!isNaN(code) && code.length <= 5) ? ('00000' + code).slice(-5) : code;
    });
    codes = codes.filter(function(code, index) {
        return codes.indexOf(code) == index;
    });
    async.map(codes, function(code, cb_code) {
        async.map(types, function(type, cb_type) {
            getStockInfo(type, code, function(error, results) {
                extend(results, {
                    'code': code
                });
                cb_type(error, results);
            });
        }, cb_code);
    }, function(error, results) {
        var jsons = [];
        for (var i = 0; i < results.length; ++i) {
            var json = {};
            for (var j = 0; j < results[i].length; ++j) {
                extend(json, results[i][j]);
            }
            jsons.push(json);
        }
        callback(error, jsons);
    });
};

app.get('/:mode/:codes', function(req, res) {
    var codes = req.params.codes.split(',');
    var mode = req.params.mode;
    var types;
    switch (mode) {
        case DAILY_MODE_RESOURCE:
            types = [InfoType.STOCK_DAILY_INFO];
            break;
        case OPENING_MODE_RESOURCE:
            types = [InfoType.STOCK_OPENING_INFO];
            break;
        case REALTIME_MODE_RESOURCE:
            types = [InfoType.STOCK_REALTIME_INFO];
            break;
        case FULL_MODE_RESOURCE:
            types = [InfoType.STOCK_DAILY_INFO, InfoType.STOCK_OPENING_INFO, InfoType.STOCK_REALTIME_INFO];
            break;
        default:
            res.jsonp({ 'error' : 'invalid resource' });
    }
    processRequest(types, codes, function(error, results) {
        if (error) {
            res.jsonp({
                'error': error.message
            });
        }
        else {
            res.jsonp(results);
        }
    });
});

app.listen(PORTS, IPS);
