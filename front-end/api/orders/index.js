(function (){
  'use strict';

  var async     = require("async")
    , express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , app       = express();

  app.get("/orders", function (req, res, next) {
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
          request(endpoints.ordersUrl + "/orders/search/customerId?sort=date&custId=" + custId + "&custRole="+custRole, function (error, response, body) {
            if (error) {
              return callback(error);
            }
            console.log("Received response: " + JSON.stringify(body));
            if (response.statusCode == 404) {
              console.log("No orders found for user: " + custId);
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

    app.get("/orderdetails/:id", function (req, res, next) {
        if (req.params.id == null) {
            return next(new Error("Must pass id of order to show details"), 400);
        }
        console.log("retrieving orderdetails");
        var orderId = req.params.id;
        var url = endpoints.ordersUrl + "/orderdetails?orderId=" + orderId;
        console.log(url);
        async.waterfall([
            function (callback) {
                request(url, function (error, response, body) {
                    if (error) {
                        return callback(error);
                    }
                    console.log("Received response: " + JSON.stringify(body));
                    if (response.statusCode == 404) {
                        console.log("No orders details found for order: " + orderId);
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

// Delete item from cart and translate original URL to delete URL
    app.delete("/orders/:id", function (req, res, next) {
        if (req.params.id == null) {
            return next(new Error("Must pass id of item to delete"), 400);
        }

        console.log("Delete order from cart: " + req.url);

        var custId = helpers.getCustomerId(req, app.get("env"));

        var options = {
            uri: endpoints.ordersUrl + "/deleteorder?orderId=" + req.params.id.toString(),
            method: 'DELETE'
        };
        request(options, function (error, response, body) {
            if (error) {
                return next(error);
            }
            console.log('Item ' + req.params.id.toString() + ' deleted with status: ' + response.statusCode);
            helpers.respondStatus(res, response.statusCode);
        });
    });

    app.post("/orders/:id", function (req, res, next) {
        if (req.params.id == null) {
            return next(new Error("Must pass id of item to delete"), 400);
        }

        console.log("Update order from cart: " + req.url);

        var custId = helpers.getCustomerId(req, app.get("env"));

        var options = {
            uri: endpoints.ordersUrl + "/processorder?orderId=" + req.params.id.toString(),
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
