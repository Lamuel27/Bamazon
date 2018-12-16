var inquirer = require('inquirer')
var mysql = require('mysql')
// create connection to mysql
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'YourRootPassword',
    database: 'bamazon'
})
// create a function to view the current inventory
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
    })
}

connection.connect(function (err) {
    if (err) throw err
    console.log("        ______                                             \n        | ___ \\                                            \n        | |_/ /  __ _  _ __ ___    __ _  ____  ___   _ __  \n        | ___ \\ / _` || '_ ` _ \\  / _` ||_  / / _ \\ | '_ \\ \n        | |_/ /| (_| || | | | | || (_| | / / | (_) || | | |\n        \\____/  \\__,_||_| |_| |_| \\__,_|/___| \\___/ |_| |_|\n        ");
    console.log('\n=================================================\n')
    start();
})
// start the application
function start() {
    // prompt the manager to select a command
    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Please select an option:',
            choices: ['1. View Products for Sale', '2. View Low Inventory', '3. Add to Inventory', '4. Add New Product'],
        }
        // if they want to view the current products, it will call the inventory function
    ]).then(function (input) {
        if (input.option === '1. View Products for Sale') {
            inventory();
            // give the option to restart
            newCommand();
            // if they want to view products with low inventory, it will pull a list of products with under 20 units
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
                // give the option to restart
                newCommand();
            })
        } else if (input.option === '3. Add to Inventory') {
            // prompt the manager to select the id of the product they would like to add stock to and how many
            inquirer.prompt([{
                type: 'input',
                name: 'item_id',
                message: 'Please enter the #ID of the item you would like add stock for.',
                filter: Number,
                // validate that they enter in a numberic value
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
                // use mysql commands to add stock to the database
                connection.query('SELECT * FROM products WHERE ?', { item_id: item }, function (err, data) {
                    if (err) throw err;
                    else {
                        var itemData = data[0];

                        var updateSql = 'UPDATE products SET stock_quantity = ' + (itemData.stock_quantity + count) + ' WHERE item_id = ' + item;

                        connection.query(updateSql, function (err, data) {
                            if (err) throw err;
                            console.log('The units have been added to the current stock!');
                            // show the updated inventory
                            inventory();
                            // give the option to restart
                            newCommand();
                        })
                    }
                })
            })
        } else if (input.option === '4. Add New Product') {
            // prompt the manager to enter in the product name, department, price, and quantity
            inquirer.prompt([{
                name: 'product_name',
                message: 'Enter the name of this new product.'
            }, {
                name: 'department_name',
                message: 'Enter the department for this product'
            }, {
                name: 'price',
                message: 'Enter the price for this product',
                validate: function (val) {
                    if (!isNaN(val)) {
                        return true
                    } else {
                        return 'Please only enter numbers'
                    }
                }
            }, {
                name: 'stock_quantity',
                message: 'Please enter a stock quantity for this product',
                validate: function (val) {
                    if (!isNaN(val)) {
                        return true
                    } else {
                        return 'Please only enter numbers'
                    }
                }
                // use mysql commands to add the new product to the products table
            }]).then(function (input) {
                connection.query('INSERT into products SET ?', {
                    product_name: input.product_name,
                    department_name: input.department_name,
                    price: input.price,
                    stock_quantity: input.stock_quantity
                }, function (err, data) { });
                console.log('Your new product has been added!');
                // show the updated inventory
                inventory();
                // give the option to restart
                newCommand();
            })
        }
    })
};
// create a function where it give the manager the choice to enter a new command or quit the app
function newCommand() {
    inquirer.prompt([{
        type: 'confirm',
        name: 'choice',
        message: 'Would you like to enter in a new command?'
    }]).then(function (input) {
        if (input.choice) {
            start();
        }
        else {
            console.log('FINE! BE THAT WAY!');
            connection.end();
        }
    })
}