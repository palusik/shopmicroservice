(function (){
  'use strict';

  var express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , app       = express()

  app.get("/catalogue/images*", function (req, res, next) {
    var url = endpoints.catalogueUrl + req.url.toString();
    console.log("images url "+url);
    request.get(url)
        .on('error', function(e) { next(e); })
        .pipe(res);
  });

  app.get("/getProducts", function (req, res, next) {
    var x = endpoints.catalogueUrl+"/getProducts" ;//+ req.url.toString();
    console.log("getProducts "+x);
    helpers.simpleHttpRequest(x
     , res, next);
  });


  app.post("/addProduct", function (req, res, next) {

      var options = {
          uri: endpoints.catalogueUrl + "/newProduct",
          method: 'POST',
          json: true,
          body: req.body
      };

      console.log("Posting New product: " + JSON.stringify(req.body));
      console.log(options);
      request(options, function(error, response, body) {
          if (error !== null ) {
              console.log("error "+JSON.stringify(error));
              return;
          }
          if (response.statusCode == 200 &&
              body != null && body != "") {
              if (body.error) {
                  console.log("Error with log in: " + err);
                  res.status(500);
                  res.end();
                  return;
              }
              console.log(body);
              res.end();
              // helpers.respondStatusBody(res, response.statusCode, response.body)

          }
          console.log(response.statusCode);

      });
  });

// Delete item from cart and translate original URL to delete URL
    app.delete("/product/:id", function (req, res, next) {
        if (req.params.id == null) {
            return next(new Error("Must pass id of product to delete"), 400);
        }

        console.log("Delete product : " + req.url);

        var custId = helpers.getCustomerId(req, app.get("env"));

        var options = {
            uri: endpoints.catalogueUrl + "/deleteproduct?productId=" + req.params.id.toString(),
            method: 'DELETE'
        };
        request(options, function (error, response, body) {
            if (error) {
                return next(error);
            }
            helpers.respondStatusBody(res, response.statusCode, response.body)
        });
    });

    app.get("/tags", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.tagsUrl, res, next);
  });

  module.exports = app;
}());
