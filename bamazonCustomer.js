var inquirer = require('inquirer')
var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'YourRootPassword',
    database: 'bamazon'
})

connection.connect(function (err) {
    if (err) throw err
    start()
})

function start() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'Please enter the #ID of the item you would like to purchase.',
            filter: Number,
            validate: function (val) {
                if (!isNaN(val)) {
                    return true
                } else {
                    return 'Please only enter numbers'
                }
            }
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to buy?',
            filter: Number,
            validate: function (val) {
                if (!isNaN(val)) {
                    return true
                } else {
                    return 'Please only enter numbers'
                }
            }
        }
    ]).then(function (input) {


    })
}