var express = require("express")
    , morgan = require("morgan")
    , path = require("path")
    , bodyParser = require("body-parser")

    , app = express();


app.use(morgan('combined'));
app.use(morgan("dev", {}));
app.use(bodyParser.json());

//app.use(morgan("dev", {}));
var cart = [];

app.post("/add", function (req, res, next) {
    var obj = req.body;

    var max = 0;
    var ind = 0;
    var neednewcart = true; // keeps the logic for adding the cart to available carts;

    var custId = obj.custId;
    if (cart["" + obj.custId] === undefined)
        cart["" + obj.custId] = [];
    var c = cart["" + obj.custId];
    for (ind = 0; ind < c.length; ind++) {
        if (max < c[ind].cartid)
            max = c[ind].cartid;
        if (c[ind].productID == obj.productID) {
            c[ind].quantity = parseInt(c[ind].quantity) + parseInt(obj.quantity);
            neednewcart = false;

        }
    }
    if (neednewcart == true) {
        var cartid = max + 1;
        var data = {
            "custid": custId,
            "cartid": cartid,
            "productID": obj.productID,
            "name": obj.name,
            "price": obj.price,
            "image": obj.image,
            "quantity": obj.quantity
        };
        console.log(JSON.stringify(data));
        c.push(data);
    }

    res.status(201);

    res.send("");


});

// pd customization of the code for cart
app.delete("/cart/:custId/items/:id", function (req, res, next) {
    var body = '';
    console.log("Delete item from cart: for custId " + req.url + ' ' +
        req.params.id.toString());

    var custId = req.params.custId;

    var c = cart["" + custId];
    // locate the index of the array which contains expected cartId
    for (ind = 0; ind < c.length; ind++) {
        if (c[ind].cartid == req.params.id)
        {
            c.splice(ind, 1);
        }
    }

    res.send(JSON.stringify(cart["" + custId]));


// pd code end
});


app.get("/cart/:custId/items", function (req, res, next) {

    var custId = req.params.custId;
    res.send(JSON.stringify(cart["" + custId]));

});


var server = app.listen(process.env.PORT || 3003, function () {
    var port = server.address().port;
    console.log("App now running in %s mode on port %d", app.get("env"), port);
});
