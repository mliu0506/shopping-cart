var mysql = require("mysql");


function login() {
    var connection;
    if (process.env.JAWSDB_URL) {
        connection = mysql.createConnection(process.env.JAWSDB_URL);
    } else {
        connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root", 
        password: "root", 
        database: "hat_store", 
        multipleStatements: true       
    });
    }
    return connection;
}

module.exports = login;