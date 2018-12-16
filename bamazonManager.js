var inquirer = require('inquirer')
var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'YourRootPassword',
    database: 'bamazon'
})

function inventory() {

    connection.query('SELECT * FROM products', function (err, data) {
        if (err) throw err;

        console.log('\nInventory: ');
        console.log('-----------------\n');
        var invent = '';
        for (var i = 0; i < data.length; i++) {
            invent = '';
            invent += 'Item ID: ' + data[i].item_id + ' | ';
            invent += 'Product Name: ' + data[i].product_name + ' | ';
            invent += 'Department: ' + data[i].department_name + ' | ';
            invent += 'Price: $' + data[i].price + ' | ';
            invent += 'Quantity: ' + data[i].stock_quantity + ' units\n';

            console.log(invent);
        }
        // connection.end();
        // restart();
    })
}

connection.connect(function (err) {
    if (err) throw err
    console.log("        ______                                             \n        | ___ \\                                            \n        | |_/ /  __ _  _ __ ___    __ _  ____  ___   _ __  \n        | ___ \\ / _` || '_ ` _ \\  / _` ||_  / / _ \\ | '_ \\ \n        | |_/ /| (_| || | | | | || (_| | / / | (_) || | | |\n        \\____/  \\__,_||_| |_| |_| \\__,_|/___| \\___/ |_| |_|\n        ");
    console.log('\n=================================================\n')
    start();
})

function start() {

    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Please select an option:',
            choices: ['1. View Products for Sale', '2. View Low Inventory', '3. Add to Inventory', '4. Add New Product'],
        }
    ]).then(function (input) {
        if (input.option === '1. View Products for Sale') {
            inventory();
            // newCommand();
        } else if (input.option === '2. View Low Inventory') {
            connection.query('SELECT * FROM products WHERE stock_quantity < 20', function (err, data) {
                if (err) throw err;
                console.log('Low Inventory:');
                console.log('-----------------\n')
                var lowInvent = ''
                for (i = 0; i < data.length; i++) {
                    lowInvent += 'Name: ' + data[i].product_name + ' | ';
                    lowInvent += 'Item ID: ' + data[i].item_id + ' | ';
                    lowInvent += 'Quantity: ' + data[i].stock_quantity + ' | ';
                    console.log(lowInvent);
                }
                // newCommand();
            })
        } else if (input.option === '3. Add to Inventory') {
            inquirer.prompt([{
                type: 'input',
                name: 'item_id',
                message: 'Please enter the #ID of the item you would like add stock for.',
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
                message: 'How many units would you like to add?',
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
                var item = input.item_id;
                var count = input.quantity;

                connection.query('SELECT * FROM products WHERE ?', { item_id: item }, function (err, data) {
                    if (err) throw err;
                    else {
                        var itemData = data[0];

                        var updateSql = 'UPDATE products SET stock_quantity = ' + (itemData.stock_quantity + count) + ' WHERE item_id = ' + item;

                        connection.query(updateSql, function (err, data) {
                            if (err) throw err;
                            console.log('The units have been added to the current stock!');
                            inventory();
                            // newCommand();
                        })
                    }
                })
            })
        }
    })
}