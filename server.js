var http = require('http');
var fs = require('fs');
var db = require('./db');
/* var express = require('express');
   var app = express()
*/
var cors = require('cors');
var path = require('path');
var bodyParser = require('body-parser');
var app = require('express')();
var handlebars = require('express-handlebars');

var port = 3000;
var connection;

app.engine('handlebars', handlebars({ 
    defaultLayout: 'main',
    helpers: {
        foo: function(funcParam) {
            if (funcParam === "param1") {
                return "This is a cool parameter"
            }

            return "This is NOT a cool parameter";
        }
    }
}));
app.set('view engine', 'handlebars');


app.use(cors());
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.render('home', {
        title: "MyAwesomeTitle",
        subheading: "What I wanted to be displayed",
        condition: false,
        tempArray: [
            "Value1", 
            "Value2", 
            "Value3"
        ]
    });
});

app.get('/portfolio', (request, response) => {
    response.render('portfolio');
});

app.get('/inventory', (request, response) => {
    connection.query(`SELECT * FROM inventory`, (err, data) => {
        if (err) {
            throw err;
        }

        response.render('inventory', {
            inventory: data,
            javascriptSources: [
                "https://code.jquery.com/jquery-3.3.1.min.js"
            ]
        });
    });
});

app.get('/api/inventory', (request, response) => {
    connection.query(`SELECT * FROM inventory`, (err, data) => {
        if (err) {
            throw err;
        }
        response.json(data);
    });
});

app.post('/api/inventory', (request, response) =>
{
    var body = request.body;
    console.log(body);
    
    connection.query(`INSERT INTO inventory (product_name, description, price, cost) VALUES (?,?,?,?)`,
                [body.name, body.description, body.price, body.cost], function(err, data) {
            if (err) {
                response.send("Couldn't write to db");
                throw err;
            }

            response.send("Successfully wrote to db");
        })
});

app.put('/api/inventory/:id', (request, response) => {
    var body = request.body;
    
    connection.query(`UPDATE inventory SET product_name = ? WHERE id = ?`, 
        [body.name, request.params.id], function(err, data) {
            if (err) {
                response.send(`Couldn't update ${request.params.id}`);
                throw err;
            }

            response.send(`Updated ${request.params.id}`);
        })
});

app.delete('/api/inventory/:id', (request, response) => {
    connection.query(`DELETE FROM inventory WHERE id = ?`, [request.params.id], (err, data) => {
        if (err) {
            response.json({"succeeded": false});
            throw err;
        }

        response.json({ "succeeded": true});
    });
});

app.post('/', (request, response) => {
    response.send(request.body.name);
});

app.put('/', (request, response) => {
    response.send("This was from a put request");
});

app.listen(port, () => {

    connection = db();
    connection.connect();
    console.log(`Connected on port: ${port}`)
});
