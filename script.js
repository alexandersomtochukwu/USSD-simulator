//getting the elements from the DOM(html)
const screen = document.getElementById('screen');
const input = document.getElementById('ussdInput');
const form = document.getElementById('form');
const sendButton = document.getElementById('send-btn');



// step 2. variable that remembers where the use is

let balance = 2000; 
let step = "dial"
let amount = 0; 
let planName = "";
let price = 0;


//step 3. menu text

const mainMenu = "My Network:\n1. Check Balance\n2. Buy Airtime\n3. Buy Data\n4 Exit";
const airtimeMenu = "Buy Airtime:\n1. ₦100\n2. ₦200\n3. ₦500\n3. ₦1000\n0. Back";
const dataMenu = " Buy Data: \n1. 1Gb Daily- ₦200\n2. 5Gb-weekly ₦1000\n3. 15Gb-Monthly ₦3000\n0. Back";


// Step 4. What happens when the user presses the Send button
form.addEventListener("submit", (event)=> {
    event.preventDefault();

    let answer = input.value.trim();
    input.value = ""; //resets the input field to empty after getting the initial value

    let text = "";
    let ended = false;

    switch(step) {
        // Step A: When you dial the code (*123#)
        case "dial":
            if (answer === "*123#") {
                text = mainMenu;
               // console.log(text);
                step = "main";
            } else {
                text = "Connection problem or invalid MMI code.";
                console.log(text)
                ended = true;
            }
            break;

        // Step B: Show main menu
        case "main":
            switch(answer) {
                case "1": {
                    let status = balance > 500 ? "Good" : "Bad";
                    text = "Your balance is ₦" + balance + "\nStatus: " + status;
                    step = "balance"
                    ended = true;
                    break;
                }

                case "2":
                    text = airtimeMenu;
                    step = "airtime";
                    break;
                case "3":
                    text = dataMenu;
                    step = "data";
                    break;
                case "4":
                    text = "Thank you for using My Network.";
                    ended = true;
                    break;
                default: 
                    text = "Invalid option. Session ended.";
                    ended = true;
            }
            break;

        // Step C. Choose airtime amount
        case "airtime": 
            amount = 0;
            if (answer === "1") {
                amount = 100;
            } else if (answer === "2") {
                amount = 200;
            } else if (answer === "3") {
                amount = 500;
            }

            if (answer === "0") {
                text = mainMenu;
                step = "main"
            } else if (amount === 0) {
                text = "Invalid option. Session ended.";
                ended = true;
            } else if (balance < amount) {
                text = "Insufficient balance";
                ended = true;
            } else {
                text = "Buy ₦" + amount + " airtime?\n1. Yes\n2. No";
                step = "airtimeConfirm";
            }
            break;

            // Step C1. Confirm airtime
            case "airtimeConfirm":
                if (answer === "1") {
                    balance = balance - amount;
                    text = "Success! ₦" + amount + " airtime added.\n New Balance: ₦" + balance;
                } else if (answer === "2") {
                    text = "Transaction canceled";
                } else {
                    text = "Invalid option. Session ended.";
                }
                ended = true;
                break;
        
        // Step D. Choose data plan
        case "data":
            price = 0;

            switch(answer) {
                case "1":
                    planName = "1GB Daily";
                    price = 200;
                    break;
                case "2":
                    planName = "2GB Weekly";
                    price = 500;
                    break;
                case "3":
                    planName = "5GB Monthly";
                    price = 1000;
                    break;
            }

            if (answer === "0") {
                text = mainMenu;
                step = "main";
            } else if (price === 0) {
                text = "Invalid option. Session ended.";
                ended = true;
            } else if (balance < price) {
                text = "Insufficient balance.";
                ended = true;
            } else {
                text = "Buy " + planName + " for ₦" + price + "?\n1. Yes\n2. No";
                step = "dataConfirm";
            }
            break;

            // Step D1. Confirm data
            case "dataConfirm":
                if (answer === "1") {
                    balance = balance - price;
                    text = " Success! " + planName + " activated.\nNew Balance: ₦" + balance;
                } else if (answer === "2") {
                    text = "Transaction canceled.";
                } else {
                    text = "Invalid option. Session ended.";
                }
                ended = true;
                break;
    }

    // Show the result on the phone screen
    screen.textContent = text;

    if (ended) {
        input.disabled = true;
        sendBtn.disabled = true;
        screen.textContent = text + "\n\n(Session ended. Press Cancel to redial.)";
    }
})