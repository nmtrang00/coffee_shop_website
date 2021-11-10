// const coffeeShop = {
//     "type":[
//        "Espresso",
//        "Cappuccino",
//        "Americano",
//        "Pour over",
//        "Chemex"
//     ],
//     "coffee":[
//        "House espresso",
//        "Guest espresso",
//        "House blend",
//        "Single origin"
//        
//     ],
//     "size":[
//        "Single",
//        "Double",
//        "Medium",
//        "Small",
//        "Large",
//        "Onesize"
//     ],
//     "extra":[
//        "Cold milk",
//        "Hot milk",
//        "Chocolate dusting",
//        "Marshmallows",
//        "Whipped cream"
//     ]
//  }

let coffeeShop

function changeType(){
    // Change the options of Size and Coffee when the type of coffee is changed
    buttonState();
    // Change coffee options
    let sel = document.getElementById('coffee');
    clearSelectOptions("coffee");
    if (["Espresso", "Cappuccino", "Americano"].includes(document.querySelector('input[name="type"]:checked').value))
    {
        addOption(sel, "coffee", 0, 2);
    }
    else{
        addOption(sel, "coffee", 2, coffeeShop.coffee.length);
    }
    // Change size options
    let sel_size = document.getElementById('size');
    clearSelectOptions("size");
    switch(document.querySelector('input[name="type"]:checked').value){
        case "Espresso":
            addOption(sel_size, "size", 0, 2);
            break;
        case "Chemex":
            addOption(sel_size, "size", coffeeShop.size.length-1, coffeeShop.size.length);
            break;
        default:
            addOption(sel_size, "size", 2, coffeeShop.size.length-1);
        };
    current();
}
function buttonState(){
    // Activate the Save Favorite button and vice versa
    current();
    if (document.querySelector('input[name="type"]:checked')===null)
    {
        document.getElementById("save").disabled = true;
    }
    else 
    {
        document.getElementById("save").disabled = false;
    }
}

function current(){
    // Return the current choices and price accordingly
    let extras = [];
    let markedCheckbox = document.querySelectorAll('input[type="checkbox"]');  
    for (let i = 0; i<markedCheckbox.length; i++) {  
        if (markedCheckbox[i].checked){
            extras.push(markedCheckbox[i].value);  
        }
    }
    let current = {
        "type": document.querySelector( 'input[name="type"]:checked').value,
        "coffee": document.getElementById("coffee").value,
        "size": document.getElementById("size").value,
        "extra": extras,
    }
    let price = priceCal(current.type, current.size, extras);
    current["price"] = price;
    let current_text = `${current.size} ${current.type}<br>${current.coffee}<br><i>Extras:</i>`;
    for (let i = 0; i<extras.length; i++) {  
        current_text+='<br>'+extras[i];
    }
    current_text+=`<br><i>Price<i>: VND ${new Intl.NumberFormat('en-US', {style: 'decimal'}).format(price)}`;
    document.getElementById("currentDrink").innerHTML=`<b>CURRENT DRINK:</b><br>${current_text}`;
    return [current,current_text];
}

function priceCal(type, size, extras){
    // Calculate the price of the chosen drink
    let price = 0;
    switch(type){
        case "Espresso":
            if (size==="Single"){
                price=25000;
            }
            else{
                price=50000;
            }
            break;
        case "Chemex":
            price=80000;
            break;
        default:
            price=defaultPrice(type, size);
    }
    let extra_price=10000*extras.length;
    price+=extra_price;
    return price;
}

function defaultPrice(field, size){
    // Return price for drinks with S,M,L sizes
    let price=0;
    base_price={
        "Cappuccino": 30000,
        "Americano": 25000,
        "Pour over": 40000,
    }
    switch(size){
        case "Small":
            price=base_price[field];
            break;
        case "Medium":
            price=base_price[field]*1.5;
            break;
        case "Large":
            price=base_price[field]*1.5*1.5;
            break;
    }
    return price;
}    

function addToCart(){
    // Add the favorite drink to cart and activate the Checkout button
    const fav_text = localStorage.getItem("fav");
    const fav = JSON.parse(fav_text);
    let to_cart = `${fav.size} ${fav.type.toLowerCase()}, ${fav.coffee.toLowerCase()}: `;
    if (fav.extra.length===0)
    {
        to_cart+= 'No extra | ';
    }
    else{
        for (let i =0; i<fav.extra.length; i++){
            to_cart+= `${fav.extra[i]} | `; 
        }
    };
    to_cart+=`<i>VND ${new Intl.NumberFormat('en-US', {style: 'decimal'}).format(fav["price"])}<i>`;
    let old_total=localStorage.getItem("total");
    let new_total=Number(old_total)+Number(fav["price"]);
    localStorage.setItem("total", new_total);
    console.log(new_total);
    document.getElementById("cart").innerHTML+=to_cart+'<br>';
    document.getElementById("total").innerHTML=`<b>TOTAL:<b> VND ${new Intl.NumberFormat('en-US', {style: 'decimal'}).format(new_total)}`;
    document.getElementById("final").disabled = false;
}

function clearSelectOptions (field) {
    // Remove all options created in Select 
    var sel = document.getElementById(field);
    // console.log('sel', sel);
    for (i = sel.options.length - 1; i >= 0; i--) {
        sel.remove(sel.i);
    }
}

function addOption(sel, field, start, end){
    // Add options to Select
    for (let i =start; i<end; i++){
        let opt = document.createElement('option');
        opt.appendChild(document.createTextNode(coffeeShop[field][i]));
        opt.value = coffeeShop[field][i];
        sel.appendChild(opt);
    }
}

function saveFav(){
    // Save current drink (favorite drink) and activate the Add to Cart button
    const [currentDrink, current_text] = current();
    localStorage.setItem("fav", JSON.stringify(currentDrink));
    document.getElementById("currentDrink").innerHTML='<b>CURRENT DRINK:</b><br>';
    document.getElementById("favDrink").innerHTML=`<br><b>FAVORITE DRINK:</b><br>${current_text}`;
    document.getElementById("add").disabled = false;
    return false;
}

function checkOut(){
    // Submit the form (Check out) and return the confirmation
    let order = document.getElementById("cart").innerHTML;
    localStorage.setItem("currentOrder",order);
    document.querySelector('main').innerHTML="Thank you. We have well received your order.<br>Press F5 or reload the page to make a new order.";
}

function generateField(field, formType, onchange){
    // Generate options for radio or checkbox
    let opts = coffeeShop[field];
    if (["radio","checkbox"].includes(formType))
    {
        for (let i = 0; i<opts.length; i++)
        {
            let input_text = `<input type="${formType}" id="${opts[i]}" name="${field}" value="${opts[i]}" onchange="${onchange}">` ;
            let label_text = `<label for="${opts[i]}">${opts[i]}</label><br>`;
            document.getElementById(field).innerHTML+=input_text+label_text;
        }
    }
    else
    {
        console.log("Invalid form type");
    }
}

let requestURL = "https://han20100128.github.io/wdos2-a3/coffeeShop.json";

fetch(requestURL)
    .then(res => res.json())
    .then((out) => {
        console.log('Output', out);
        coffeeShop = out;
        
        localStorage.setItem("total", 0); 
        generateField("type", "radio", "changeType()");
        generateField("extra", "checkbox", "current()");
        document.getElementById("save").addEventListener("click", saveFav);
        document.getElementById("add").addEventListener("click", addToCart);
        document.getElementById("final").addEventListener("click", checkOut);        
}).catch(err => console.error(err));
