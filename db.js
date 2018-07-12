var mysql = require("mysql");

function login() {
    var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root", 
        password: "root", 
        database: "hat_store", 
        multipleStatements: true
    });

    return connection;
}

module.exports = login;