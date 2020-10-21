const express = require("express");
const app = express();
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static("public"));
const mysql = require('mysql');

var conn = mysql.createConnection({
    host: "ixqxr3ajmyapuwmi.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "fkok2gg2kha19w47",
    password: "txv0z9g1mik4akwg",
    database: "hig8ctubbg4keh2e",
    debug: false,
    multipleStatements: true
    
});
//routes
app.get("/", function(req, res){
    res.render('index');
});

app.get('/customers', function(req, res, next) {
    var sql = `SELECT * FROM customers; UPDATE customers SET transferamount = 0, sent = 0`;
    console.log(sql);
    conn.query(sql, function (err, data, fields) {
        if (err) {
            throw err;
        } 
        else {
            res.render('customerlist', {title: 'Customers', userData: data});
        }
    });
});

app.get('/select', function(req, res) {
    var sql = `SELECT * FROM customers WHERE customerid = ${req.query.name}`;
            
    // var log1 = sql.charAt(sql.length-1);
    console.log(sql);
    conn.query(sql, function (err, data, fields) {
        if (err) {
            throw err;
        } 
        else {
            res.render('selection', {title: 'Selected Customer', data: data});
        }
    });
});

// var transferTo = 1;
app.get('/transfer', function(req, res, next) {
    // var sql = `UPDATE transfers SET customerid = ${req.query.giver}, transferout = ${req.query.transferAmount}; UPDATE customers SET balance = balance - ${req.query.transferAmount}`;
    var sql = `SELECT * FROM customers;
                UPDATE customers SET balance = balance - ${req.query.transferAmount}, transferamount = ${req.query.transferAmount}, sent = ${req.query.funder} 
                WHERE customerid = ${req.query.funder}; 
                INSERT INTO transfers (customerid, transferout) VALUES (${req.query.funder},${req.query.transferAmount})`;
    console.log("111111111111111111111");
    console.log(sql);
    conn.query(sql, function (err, results, fields) {
        
        if (err) {
            throw err;
        } 
        else {
            res.render('transfer', {title: 'Transfer to Customers', 
            transferData: results});
        }
        
    });
});
app.get('/customerlast', function(req, res, next) {
    var sql = `SELECT * FROM customers; 
                UPDATE customers SET customerid_recipient = ${req.query.receiver}
                WHERE customerid = sent AND customerid < 11;
                INSERT INTO transfers (customerid, transferin) 
                SELECT customerid_recipient, transferamount
                FROM customers 
                WHERE customerid = sent;
                DROP TABLE IF EXISTS customers_temp;
                CREATE TEMPORARY TABLE customers_temp SELECT transferamount FROM customers WHERE customerid = sent;
                UPDATE customers SET transferamount = (SELECT transferamount from customers_temp
                WHERE customerid = ${req.query.receiver});
                UPDATE customers SET balance = balance + transferamount 
                WHERE customerid = ${req.query.receiver}`;
    console.log("22222222222222222222222");
    console.log(sql);
    conn.query(sql, function (err, data, fields) {
        if (err) {
            throw err;
        } 
        else {
            res.render('customerlast', {title: 'Customers', userData: data});
        }
    });
});
//starting server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Express server is running...");
});


