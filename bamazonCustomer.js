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
    console.log("        ______                                             \n        | ___ \\                                            \n        | |_/ /  __ _  _ __ ___    __ _  ____  ___   _ __  \n        | ___ \\ / _` || '_ ` _ \\  / _` ||_  / / _ \\ | '_ \\ \n        | |_/ /| (_| || | | | | || (_| | / / | (_) || | | |\n        \\____/  \\__,_||_| |_| |_| \\__,_|/___| \\___/ |_| |_|\n        ");
    start();
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
        var item = input.item_id;
        var count = input.quantity;

        connection.query('SELECT * FROM products WHERE ?', { item_id: item }, function (err, data) {
            if (err) throw err;
            else {
                var itemData = data[0];

                if (count <= itemData.stock_quantity) {
                    console.log('Your order is being processed!\n');

                    var updateSql = 'UPDATE products SET stock_quantity = ' + (itemData.stock_quantity - count) + ' WHERE item_id = ' + item;

                    connection.query(updateSql, function (err, data) {
                        if (err) throw err;
                        console.log('Your order has been placed! Your total is $' + itemData.price * count + '! Estimated time for delivery is 5 months!');
                        console.log('Have a fantastic day!')
                        console.log('\n=================================================\n')
                        inventory();
                    })
                } else {
                    console.log('Uh oh, there is insufficient quantity!!');
                    console.log('Please come back another day!');
                    console.log('\n=================================================\n');
                    inventory();
                }
                // connection.end();

            }

            function inventory() {

                connection.query('SELECT * FROM products', function (err, data) {
                    if (err) throw err;

                    console.log('Inventory: ');
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
                    connection.end();
                    // restart();
                })
            }

        })
    })
    // function display() {
    //     inventory();
    // }

    // display();
}


// function restart(start) {
//     inquirer.prompt([
//         {
//             type: 'confirm',
//             name: 'restart',
//             message: 'Would you like to order another item?',
//             default: true
//         }
//     ]).then(function (answers) {
//         if (answers === true) {
//             connection.connect(function (err) {
//                 if (err) throw err
//                 console.log("        ______                                             \n        | ___ \\                                            \n        | |_/ /  __ _  _ __ ___    __ _  ____  ___   _ __  \n        | ___ \\ / _` || '_ ` _ \\  / _` ||_  / / _ \\ | '_ \\ \n        | |_/ /| (_| || | | | | || (_| | / / | (_) || | | |\n        \\____/  \\__,_||_| |_| |_| \\__,_|/___| \\___/ |_| |_|\n        ");
//                 start();
//             })
//         } else if (answers === false) {
//             connection.end();
//         }
//     })
// }
