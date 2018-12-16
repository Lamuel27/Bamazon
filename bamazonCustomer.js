var inquirer = require('inquirer')
var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'YourRootPassword',
    database: 'bamazon'
})
// create a funtion to show the current inventory
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
// create a function to just show the item ID, product name, and price
function inventory1() {

    connection.query('SELECT * FROM products', function (err, data) {
        if (err) throw err;

        console.log('\nInventory: ');
        console.log('-----------------\n');
        var invent = '';
        for (var i = 0; i < data.length; i++) {
            invent = '';
            invent += 'Item ID: ' + data[i].item_id + '\n';
            invent += 'Product Name: ' + data[i].product_name + '\n';
            invent += 'Price: $' + data[i].price + '\n';

            console.log(invent);
        }
        // connection.end();
        // restart();
    })
}
// start the application
connection.connect(function (err) {
    if (err) throw err
    console.log("        ______                                             \n        | ___ \\                                            \n        | |_/ /  __ _  _ __ ___    __ _  ____  ___   _ __  \n        | ___ \\ / _` || '_ ` _ \\  / _` ||_  / / _ \\ | '_ \\ \n        | |_/ /| (_| || | | | | || (_| | / / | (_) || | | |\n        \\____/  \\__,_||_| |_| |_| \\__,_|/___| \\___/ |_| |_|\n        ");
    inventory1();
    console.log('\n=================================================\n')
    start();
})
// use inquirer to ask the user to input the id of the item they would like to buy and how many
function start() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'Please enter the #ID of the item you would like to purchase.',
            filter: Number,
            // validate that they enter in a numeric value
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
        // use mysql commands to update the inventory
        connection.query('SELECT * FROM products WHERE ?', { item_id: item }, function (err, data) {
            if (err) throw err;
            else {
                var itemData = data[0];
                // if the order count is less than the stock available, the order will be processed
                if (count <= itemData.stock_quantity) {
                    console.log('Your order is being processed!\n');

                    var updateSql = 'UPDATE products SET stock_quantity = ' + (itemData.stock_quantity - count) + ' WHERE item_id = ' + item;
                    // let them know that the order has been placed. show the total price
                    connection.query(updateSql, function (err, data) {
                        if (err) throw err;
                        console.log('Your order has been placed! Your total is $' + itemData.price * count + '! Estimated time for delivery is 5 months!');
                        console.log('Have a fantastic day!')
                        console.log('\n=================================================\n')
                        // show the updated inventory
                        inventory();
                        // give the option to order more
                        restart();
                    })
                    // if they order an amount that is more than our current stock, it will say insufficient quantity
                } else {
                    console.log('Uh oh, there is insufficient quantity!!');
                    console.log('Please come back another day!');
                    console.log('\n=================================================\n');
                    // show the updated inventory
                    inventory();
                    // give the option to order more
                    restart();
                }

            }


        })
    })
    
}
// create a function where they are given the choice to purchase other products or quit the app
function restart(){
	inquirer.prompt([{
		type: 'confirm',
		name: 'choice',
		message: 'Would you like to order another item?'
	}]).then(function(answer){
		if(answer.choice){
			start();
		}
		else{
			console.log('FINE! BE THAT WAY!');
			connection.end();
		}
	})
};
