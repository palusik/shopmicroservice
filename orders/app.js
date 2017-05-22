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
var theorderid =null;
var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    var url1 = url.parse(request.url);
    if (request.method == 'POST') {
        switch (path) {


            /* TODO {PD} adding the new product */
            case "/checkout":
                var body = '';
                console.log("add checkout ");
                request.on('data', function (data) { body += data; });

                request.on('end', function () {

                    console.log(JSON.stringify(body));
                    //var checkoutValues = qs.parse(body);
                    //console.log('new Checkout' + checkoutValues.length);
                    //console.log(JSON.stringify(checkoutValues, null, 2));
                    //console.log(JSON.stringify(checkoutValues));

                    //cartdata = JSON.stringify(checkoutValues);
                    cartdata = JSON.parse(body);

                    //cartdata = cartdata.replace("\\", "");

                    var total=0;
                    var customerId = "";
                    for (i = 0; i < cartdata.length; i++) {
                        console.log("Product " + cartdata[i].productID + " customer ID" + cartdata[i].custid);
                        total += cartdata[i].price* cartdata[i].quantity;
                        customerId = cartdata[i].custid;
                    }
                    console.log(customerId + " , " + total);

                    var currenttimestamp = new Date().toISOString();
                    currenttimestamp = currenttimestamp.replace(/T/, ' ');      // replace T with a space
                    currenttimestamp = currenttimestamp.replace(/\..+/, '');

                    console.log(currenttimestamp);
                    // double-check unique name
                    console.log("test 2");


                    response.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*'
                    });


                    query = "INSERT INTO orders (customerID, saledate, orderstatus, price)"+
                        "VALUES(?, ?, ?, ?)";
                    console.log(query);
                    db.query(
                        query,
                        [customerId,currenttimestamp,"NEW", total],
                        function(err, result) {
                            if (err) {
                                // 2 response is an sql error
                                response.end('{"error": "3 - issue with storing data in DB"}');
                                throw err;
                            }
                            theorderid = result.insertId;

                            console.log("Created Order ID " + theorderid)
                            // create order details
                            for (i = 0; i < cartdata.length; i++) {
                                query2 = "INSERT INTO orderdetails (productID, orderID, quantity)" +
                                    "VALUES(?, ?, ?)";
                                console.log(query2);
                                db.query(
                                    query2,
                                    [cartdata[i].productID, theorderid, cartdata[i].quantity],
                                    function (err, result) {
                                        if (err) {
                                            // 2 response is an sql error
                                            response.end('{"error": "3 - issue with storing data in DB"}');
                                            throw err;
                                        }
                                        console.log("Created Order Details ID " + result.insertId);

                                    }
                                );
                            }

                        }
                    );

                    var order = {
                        id: theorderid
                    }
                    response.end("Order has been added and has the following ID: " + JSON.stringify(order));

                });
                break;

            case "/processorder"    :
                var query = require('url').parse(request.url, true).query;

                var orderId = query.orderId;

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

                    var query = "UPDATE orders SET orderstatus = 'PROCESSED' where orderID=" +
                        orderId;

                    db.query(
                        query,
                        [],
                        function (err, rows) {
                            if (err) throw err;

                            console.log("Updating Order ID " + orderId)
                            response.end(orderId + " updated");
                            console.log("My Order Update completed");
                        }
                    );

                });


                break;


        } //switch
    }
    else if (request.method == 'DELETE')
    {
        console.log("requet method is delete" + path);
        if (path == "/deleteorder") {

            var query = require('url').parse(request.url, true).query;

            var orderId = query.orderId;

            console.log("Selected orderId " + orderId);


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

                var query = "DELETE FROM orderdetails where orderID=" +
                    orderId;

                db.query(
                    query,
                    [],
                    function (err, rows) {
                        if (err) throw err;

                        console.log("Deletingd Order ID " + orderId)

                        query2 = "DELETE FROM orders where orderID="+orderId;
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
                                console.log("Deleted Order " + orderId);
                            }
                        );

                        console.log(JSON.stringify(rows, null, 2));
                        response.end(orderId + " deleted");
                        console.log("My Order Deletion  sent");
                    }
                );

            });


        } // if path == deleteorder


    }
    else {
        switch (path) {
            // /cart/:custId/items
            // case "/getMyOrders"    :
            case "/orders/search/customerId"    :


                var inputparams = qs.parse(request.url.toString());

                var custId = inputparams.custId;
                var custRole = inputparams.custRole;
                console.log("Selected customerId " + custId + " for role " + custRole);

                var body="";
                request.on('data', function (data) {
                    body += data;
                });

                request.on('end', function () {
                    response.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*'
                    });
                    // console.log(JSON.stringify(customer, null, 2));
                    if (custRole == 'admin')
                    {
                        var query = "SELECT t1.*, t2.name FROM orders t1, customer t2 where t1.customerID = t2.customerID";
                    }
                    else
                    {
                        var query = "SELECT * FROM orders where customerID="+
                            custId;
                    }

                    db.query(
                        query,
                        [],
                        function(err, rows) {
                            if (err) throw err;
                            console.log(JSON.stringify(rows, null, 2));
                            response.end(JSON.stringify(rows));
                            console.log("My Orders sent");
                        }
                    );

                });



                break;

            case "/orderdetails"    :

                var query = require('url').parse(request.url,true).query;
                console.log("getOrderDetails for " + request.url.toString());

                var orderId = query.orderId;

                var body="";
                request.on('data', function (data) {
                    body += data;
                });

                request.on('end', function () {
                    response.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*'
                    });
                    // console.log(JSON.stringify(customer, null, 2));

                    var query = "SELECT t1.*, t2.name, t2.price  FROM orderdetails t1, products t2 where t1.productID = t2.productID and t1.orderID="+
                            orderId;

                    db.query(
                        query,
                        [],
                        function(err, rows) {
                            if (err) throw err;
                            console.log(JSON.stringify(rows, null, 2));
                            response.end(JSON.stringify(rows));
                            console.log("My Order Details sent");
                        }
                    );

                });

                break;


        }
    }



});

server.listen(3004);
