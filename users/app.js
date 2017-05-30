var http = require('http'),
    url = require('url');

var mysql = require('mysql');


var db = mysql.createConnection({
    host:     'shopdb',
    user:     'root',
    password: '',
    database: 'shop'
});
var cart = [];
var theuser=null;
var theuserid =null;
var therole =null;

var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    var url1 = url.parse(request.url);
    console.log("path: "+path);
    console.log("url: "+url1);
    console.log("method: " + request.method);
    if (request.method == 'POST') {
        switch (path) {


            case "/login":
                var body = '';
                console.log("user Login ");
                request.on('data', function (data) {
                    body += data;
                });

                console.log("body " + JSON.stringify(body));
                request.on('end', function () {
                    var obj = JSON.parse(body);
                    console.log(JSON.stringify(obj, null, 2));
                    var query = "SELECT * FROM Customer where name='"+obj.name+"' and password='"+obj.password+"'";
                    response.writeHead(200, {
                        'Access-Control-Allow-Origin': '*'
                    });

                    db.query(
                        query,
                        [],
                        function(err, rows) {
                            if (err) {
                                response.end('{"error": "1"}');
                                throw err;
                            }
                            if (rows!=null && rows.length>0) {
                                console.log(" user in database" );
                                theuserid = rows[0].customerID;
                                theuser = rows[0].name;
                                therole = rows[0].role;
                                var obj = {
                                    id: theuserid,
                                    name: theuser,
                                    role: therole
                                };
                                response.end(JSON.stringify(obj));

                            }
                            else{
                                response.end('{"error": "1"}');
                                console.log(" user not in database");

                            }

                        }
                    );


                });


                break;

            case "/register":
                var body = '';
                console.log("user Register ");
                request.on('data', function (data) {
                    body += data;
                });

                request.on('end', function () {
                    var obj = JSON.parse(body);
                    console.log(JSON.stringify(obj, null, 2));
                    var query = "SELECT * FROM Customer where name='"+obj.name+"'";
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
                                console.log(" user already in database");
                                response.end('{"error": "2"}');
                            }
                            else{
                                query = "INSERT INTO Customer (name, password, address, email)"+
                                        "VALUES(?, ?, ?, ?)";
                                db.query(
                                    query,
                                    [obj.name,obj.password,obj.address,obj.email],
                                    function(err, result) {
                                        if (err) {
                                            // 2 response is an sql error
                                            response.end('{"error": "3"}');
                                            throw err;
                                        }
                                        theuserid = result.insertId;
                                        var obj = {
                                            id: theuserid
                                        };
                                        response.end(JSON.stringify(obj));

                                    }
                                );
                            }

                        }
                    );
                });
                break;

            case "/processuser"    :
                var query = require('url').parse(request.url, true).query;

                var customerId = query.customerId;
                var newrole = query.newRole;

                if (newrole == 'nothing')
                    newrole = null;

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

                    var query = "UPDATE customer SET role = '" + newrole + "' where customerID=" +
                        customerId;

                    db.query(
                        query,
                        [],
                        function (err, rows) {
                            if (err) throw err;

                            console.log("Updating Customer ID " + customerId);
                            response.end(customerId + " updated");
                            console.log("Role Update completed");
                        }
                    );

                });


                break;




        } //switch
    }
    else {
        switch (path) {
            // /cart/:custId/items
            // case "/getUsers"    :
            case "/users"    :

                var body = "";
                request.on('data', function (data) {
                    body += data;
                });

                request.on('end', function () {
                    response.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*'
                    });

                    var query = "SELECT * FROM customer";


                    db.query(
                        query,
                        [],
                        function (err, rows) {
                            if (err) throw err;
                            console.log(JSON.stringify(rows, null, 2));
                            response.end(JSON.stringify(rows));
                            console.log("My Customers sent");
                        }
                    );

                });

                break;
        }
    }


});
server.listen(3001);

