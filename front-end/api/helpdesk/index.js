(function() {
    'use strict';

    var async = require("async"),
        express = require("express"),
        request = require("request"),
        endpoints = require("../endpoints"),
        helpers = require("../../helpers"),
        app = express(),
        cookie_name = "logged_in";


    app.get("/queries", function (req, res, next) {
        console.log("Request received with body: " + JSON.stringify(req.body));

        var logged_in = req.cookies.logged_in;
        if (!logged_in) {
            throw new Error("User not logged in.");
            return
        }

        var custId = helpers.getCustomerId(req, app.get("env"));

        var custId = req.session.customerId;
        var custRole = req.session.customerRole;
        console.log(custId);
        console.log(req.url.toString());

        async.waterfall([
                function (callback) {
                    request(endpoints.helpdeskUrl + "/queries?custId=" + custId + "&custRole="+custRole, function (error, response, body) {
                        if (error) {
                            return callback(error);
                        }
                        console.log("Received response: " + JSON.stringify(body));
                        if (response.statusCode == 404) {
                            console.log("No queries found for user: " + custId);
                            return callback(null, []);
                        }
                        //   callback(null, JSON.parse(body)._embedded.customerOrders);
                        callback(null, JSON.parse(body));
                    });
                }
            ],
            function (err, result) {
                if (err) {
                    return next(err);
                }
                helpers.respondStatusBody(res, 201, JSON.stringify(result));
            });
    });

    app.post("/addquery/:id/:question", function (req, res, next) {

        var logged_in = req.cookies.logged_in;
        if (!logged_in) {
            throw new Error("User not logged in.");
            return
        }

        console.log("create query: " + req.url);

        var custId = helpers.getCustomerId(req, app.get("env"));

        console.log("CustId: " + custId);

        var options = {
            uri: endpoints.helpdeskUrl + "/addquery?custId=" + req.params.id.toString() + "&question=" + req.params.question.toString(),
            method: 'POST'
        };
        console.log(options);
        request(options, function (error, response, body) {
            if (error) {
                return next(error);
            }
            console.log('Item ' + req.params.id.toString() + ' submitted: ' + response.statusCode);
            helpers.respondStatus(res, response.statusCode);
        });
    });

    app.post("/updatequery/:custId/:id/:answer", function (req, res, next) {

        var logged_in = req.cookies.logged_in;
        if (!logged_in) {
            throw new Error("User not logged in.");
            return
        }
        console.log("Update issue: " + req.url);

        var custId = helpers.getCustomerId(req, app.get("env"));

        var options = {
            uri: endpoints.helpdeskUrl + "/updatequery?issueId=" + req.params.id.toString() +"&custId=" + custId +"&answer=" + req.params.answer.toString(),
            method: 'POST'
        };
        console.log(options);
        request(options, function (error, response, body) {
            if (error) {
                return next(error);
            }
            console.log('Item ' + req.params.id.toString() + ' updated with status: ' + response.statusCode);
            helpers.respondStatus(res, response.statusCode);
        });
    });


    module.exports = app;
}());
