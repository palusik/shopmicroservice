var http = require('http'),
    fs = require('fs'),
    url = require('url');
var p = require('path');
var qs = require('querystring');
var mysql = require('mysql');
var root = __dirname;
var headers = [
    "Product Name", "Price", "Picture", "Buy Button"
];


var db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'root',
    database: 'shop'
});
var cart = [];
var theuser=null;
var theuserid =null;
var theproductid =null;
var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    var url1 = url.parse(request.url);
    if (request.method == 'POST') {
        switch (path) {


            /* TODO {PD} adding the new product */
            case "/newProduct":
                var body = '';
                console.log("add ");
                request.on('data', function (data) { body += data; });

                request.on('end', function () {

                    var product = JSON.parse(body);
                    console.log('new Product');
                    console.log(JSON.stringify(product, null, 2));

                    // double-check unique name
                    console.log("test 2");
                    var query = "SELECT * FROM products where name='"+product.name+"'";
                    response.writeHead(200, {
                        'Access-Control-Allow-Origin': '*'
                    });

                    db.query(
                        query,
                        [],
                        function(err, rows) {
                            if (err) {
                                response.end("error");
                                throw err;
                            }
                            if (rows!=null && rows.length>0) {
                                console.log(" product already in database");
                                response.end('{"error": "2 - this product already exist in database"}');
                            }
                            else{
                                query = "INSERT INTO products (name, quantity, price, image)"+
                                    "VALUES(?, ?, ?, ?)";
                                db.query(
                                    query,
                                    [product.name,product.quantity,product.price,product.image],
                                    function(err, result) {
                                        if (err) {
                                            // 2 response is an sql error
                                            response.end('{"error": "3 - issue with storing data in DB"}');
                                            throw err;
                                        }
                                        theproductid = result.insertId;
                                        var product = {
                                            id: theproductid
                                        };
                                        response.end("Product has been added and has the following ID: " + JSON.stringify(product));

                                    }
                                );
                            }

                        }
                    );


                });

/* END TODO {pd} */
                break;
        } //switch
    }
    else if (request.method == 'DELETE')
    {
        console.log("requet method is delete" + path);
        if (path == "/deleteproduct") {

            var query = require('url').parse(request.url, true).query;
            console.log("getDelete for " + request.url.toString());
            // console.log("input params" + inputparams);
            // console.log("query string for " + qs.parserequest.url.toString());

            var productId = query.productId;

            console.log("Selected productId " + productId);


            var body = "";
            request.on('data', function (data) {
                body += data;
            });

            request.on('end', function () {
                response.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Access-Control-Allow-Origin': '*'
                });
                // console.log(JSON.stringify(customer, null, 2));

                var query = "SELECT * FROM orderdetails where productID=" +
                    productId;

                db.query(
                    query,
                    [],
                    function (err, rows) {
                        if (err) throw err;
                        if (rows!=null && rows.length>0) {
                            console.log(" product has some orderdetails");
                            response.end('{"error": "2 - this can not be deleted as it has some ordders associated"}');
                        }
                        else {

                            console.log("Deleting product ID " + productId);

                            query2 = "DELETE FROM products where productID=" + productId;
                            console.log(query2);
                            db.query(
                                query2,
                                [],
                                function (err, rows) {
                                    if (err) {
                                        // 2 response is an sql error
                                        response.end('{"error": "3 - issue with deleting data in DB"}');
                                        throw err;
                                    }
                                    console.log(JSON.stringify(rows, null, 2));
                                    console.log("Deleted product " + productId);
                                }
                            );

                            console.log(JSON.stringify(rows, null, 2));
                            response.end("");
                            console.log("My product Deletion  sent");
                        }
                    }
                );

            });


        } // if path == deleteorder


    }

    else {
        switch (path) {

            case "/getProducts"    :
                console.log("getProducts");
                response.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Access-Control-Allow-Origin': '*'
                });
                var query = "SELECT * FROM products ";


                db.query(
                    query,
                    [],
                    function(err, rows) {
                        if (err) throw err;
                        console.log(JSON.stringify(rows, null, 2));
                        response.end(JSON.stringify(rows));
                        console.log("Products sent");
                    }
                );

                break;
            case "/getProduct"    :
                console.log("getProduct");
                var body="";
                request.on('data', function (data) {
                    body += data;
                });

                request.on('end', function () {
                    var product = JSON.parse(body);
                    response.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*'
                    });
                    console.log(JSON.stringify(product, null, 2));
                    var query = "SELECT * FROM products where productID="+
                        product.id;


                    db.query(
                        query,
                        [],
                        function(err, rows) {
                            if (err) throw err;
                            console.log(JSON.stringify(rows, null, 2));
                            response.end(JSON.stringify(rows[0]));
                            console.log("Products sent");
                        }
                    );

                });



                break;
            case "/newProduct":
                //{ var product = qs.parse(body); console.log('new Product'); console.log(JSON.stringify(product, null, 2)); }); break;            case "/newProduct"    :
                console.log("newProduct");
                var body="";
                request.on('data', function (data) {
                    body += data;
                });

                request.on('end', function () {
                    var product = JSON.parse(body);
                    response.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*'
                    });
                    console.log(JSON.stringify(product, null, 2));
                    var query = "SELECT * FROM products where productID="+
                        product.id;


                    db.query(
                        query,
                        [],
                        function(err, rows) {
                            if (err) throw err;
                            console.log(JSON.stringify(rows, null, 2));
                            response.end(JSON.stringify(rows[0]));
                            console.log("Products sent");
                        }
                    );

                });



                break;




        }
    }



});

server.listen(3002);
