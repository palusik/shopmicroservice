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
var theissueid =null;
var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    var url1 = url.parse(request.url);
    console.log("Helpdesk microservices");
    if (request.method == 'POST') {
        switch (path) {


            /* TODO {PD} adding the new product */
            case "/addquery":
                var body = '';
                console.log("add issue ");
                request.on('data', function (data) { body += data; });

                request.on('end', function () {

                    console.log(JSON.stringify(body));
                    var query = require('url').parse(request.url, true).query;

                    var custId  = query.custId;
                    var question  = query.question.replace("'", "");


                    var currenttimestamp = new Date().toISOString();
                    currenttimestamp = currenttimestamp.replace(/T/, ' ');      // replace T with a space
                    currenttimestamp = currenttimestamp.replace(/\..+/, '');

                    response.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*'
                    });


                    query = "INSERT INTO customerissue (customerID, issuedate, issuestatus, issuecomment)"+
                        "VALUES(?, ?, ?, ?)";
                    console.log(query);
                    db.query(
                        query,
                        [custId,currenttimestamp,"NEW", question],
                        function(err, result) {
                            if (err) {
                                // 2 response is an sql error
                                response.end('{"error": "3 - issue with storing data in DB"}');
                                throw err;
                            }
                            theissueid = result.insertId;

                            console.log("Created Issue ID " + theissueid)
                        }
                    );

                    var customerissue = {
                        id: theissueid
                    };
                    response.end("Order has been added and has the following ID: " + JSON.stringify(customerissue));

                });
                break;

            case "/updatequery"    :
                var query = require('url').parse(request.url, true).query;

                var issueId = query.issueId;
                var custId  = query.custId;
                var answer  = query.answer.replace("'", "");

                var currenttimestamp = new Date().toISOString();
                currenttimestamp = currenttimestamp.replace(/T/, ' ');      // replace T with a space
                currenttimestamp = currenttimestamp.replace(/\..+/, '');

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

                    var query = "UPDATE customerissue SET issuestatus = 'COMPLETE', resolverID = '" + custId
                        + "', resolution = '" + answer
                        + "', resolvedate = '" + currenttimestamp + "' "
                        + " where customerissueID=" + issueId;

                    db.query(
                        query,
                        [],
                        function (err, rows) {
                            if (err) throw err;

                            console.log("Updating customer issue ID " + issueId);
                            response.end(issueId + " updated");
                            console.log("Customer query update completed");
                        }
                    );

                });


                break;


        } //switch
    }
    else {
        switch (path) {
            // /cart/:custId/items
            // case "/getMyOrders"    :
            case "/queries"    :


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
                    if (custRole == 'admin' || custRole == 'operator')
                    {
                        var query = "SELECT t1.*, t2.name FROM customerissue t1, customer t2 where t1.customerID = t2.customerID";
                    }
                    else
                    {
                        var query = "SELECT t1.*, t2.name FROM customerissue t1, customer t2 where t1.customerID = t2.customerID and t1.customerID="+
                            custId;
                    }

                    db.query(
                        query,
                        [],
                        function(err, rows) {
                            if (err) throw err;
                            console.log(JSON.stringify(rows, null, 2));
                            response.end(JSON.stringify(rows));
                            console.log("My queries sent");
                        }
                    );

                });

                break;

        }
    }




});

server.listen(3005);
