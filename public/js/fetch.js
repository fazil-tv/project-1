const { json } = require("express");
const { response } = require("../../routes/userRoute");


function addressvalidation() {

    const fullname = document.getElementById('fullname').value;
    const mobile = document.getElementById('mobile').value;
    const email = document.getElementById('email').value;
    const houseName = document.getElementById('housename').value;
    const state = document.getElementById('state').value;
    const city = document.getElementById('city').value;
    const pin = document.getElementById('pin').value;

    document.getElementById('fullname-error').innerText = '';
    document.getElementById('mobile-error').innerText = '';
    document.getElementById('email-error').innerText = '';
    document.getElementById('houseName-error').innerText = '';
    document.getElementById('state-error').innerText = '';
    document.getElementById('city-error').innerText = '';
    document.getElementById('pin-error').innerText = '';


    let isValid = true;

    if (!fullname || !mobile || !email || !houseName || !state || !city || !pin) {
        isValid = false;
    }
    if (fullname.trim() === "") {
        document.getElementById('fullname-error').textContent = 'enter your name';
        isValid = false;
    }
    console.log(email)
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (!email || !emailPattern.test(email)) {
        document.getElementById('email-error').innerText = 'email is not valid';
        isValid = false;
    }

    const housenameRegex = /^[a-zA-Z\s]+$/;
    if (!housenameRegex.test(houseName)) {
        document.getElementById('houseName-error').innerText = 'email is not valid';
        isValid = false;
    }

    const cityRegex = /^[a-zA-Z\s]+$/;
    if (!cityRegex.test(city)) {
        document.getElementById('city-error').innerText = 'enter a city name';
        isValid = false;
    }
    const stateRegex = /^[a-zA-Z\s]+$/;
    if (!stateRegex.test(state)) {
        document.getElementById('state-error').innerText = 'enter valid state';
        isValid = false;
    }
    if (mobile.length < 10) {
        document.getElementById('mobile-error').innerText = 'enter valid mobile number';
        isValid = false;
    }
    function isValidPIN(pin) {
        return /^\d{6}$/.test(pin);
    }
    if (!isValidPIN(pin)) {
        document.getElementById('pin-error').innerText = 'enter six digits pin code';
        isValid = false;
    }
    if (!isValid) {
        return

    }
    else {
        address();
    }

}



function address() {
    console.log("ok");

    const fullname = document.getElementById('fullname').value;
    const mobile = document.getElementById('mobile').value;
    const email = document.getElementById('email').value;
    const houseName = document.getElementById('housename').value;
    const state = document.getElementById('state').value;
    const city = document.getElementById('city').value;
    const pin = document.getElementById('pin').value;

    fetch('/adaddress', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullname: fullname,
            mobile: mobile,
            email: email,
            houseName: houseName,
            state: state,
            city: city,
            pin: pin
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data) {

                document.getElementById('addaddressmodal').style.display = "none";
                $('#edit-address-div').load('/useraccount #edit-address-div')

                Swal.fire({
                    icon: 'success',
                    title: 'Add Successful',
                    text: 'The address has been added successfully!',
                });


            }
        }).catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Add Error',
                text: 'An error occurred during address addition. Please try again.',
            });
        })

}




function editaddressvalidation() {
    const fullname = document.getElementById('editfullname').value;
    const mobile = document.getElementById('editmobile').value;
    const email = document.getElementById('editemail').value;
    const houseName = document.getElementById('edithousename').value;
    const state = document.getElementById('editstate').value;
    const city = document.getElementById('editcity').value;
    const pin = document.getElementById('editpin').value;


    console.log(email);

    document.getElementById('fullname-error').innerText = '';
    document.getElementById('mobile-error').innerText = '';
    document.getElementById('email-error').innerText = '';
    document.getElementById('houseName-error').innerText = '';
    document.getElementById('state-error').innerText = '';
    document.getElementById('city-error').innerText = '';
    document.getElementById('pin-error').innerText = '';


    let isValid = true;

    if (!fullname || !mobile || !email || !houseName || !state || !city || !pin) {
        isValid = false;
    }

    if (fullname.trim() === "") {
        document.getElementById('edit-fullname-error').textContent = 'enter your name';
        isValid = false;
    }

    console.log(email)

    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!email || !emailPattern.test(email)) {
        document.getElementById('edit-email-error').innerText = 'email is not valid';
        isValid = false;
    }


    const housenameRegex = /^[a-zA-Z\s]+$/;
    if (!housenameRegex.test(houseName)) {
        document.getElementById('edit-houseName-error').innerText = 'enter your house name';
        isValid = false;
    }

    const cityRegex = /^[a-zA-Z\s]+$/;
    if (!cityRegex.test(city)) {
        document.getElementById('edit-city-error').innerText = 'enter a city name';
        isValid = false;
    }
    const stateRegex = /^[a-zA-Z\s]+$/;
    if (!stateRegex.test(state)) {
        document.getElementById('edit-state-error').innerText = 'enter valid state';
        isValid = false;
    }
    if (mobile.length < 10) {
        document.getElementById('edit-mobile-error').innerText = 'enter valid mobile number';
        isValid = false;
    }
    function isValidPIN(pin) {
        return /^\d{6}$/.test(pin);
    }
    if (!isValidPIN(pin)) {
        document.getElementById('edit-pin-error').innerText = 'enter six digits pin code';
        isValid = false;
    }
    if (!isValid) {
        return
    }
    else {
        editaddress();
    }

}


function editaddress() {

    const fullname = document.getElementById('editfullname').value;
    const mobile = document.getElementById('editmobile').value;
    const email = document.getElementById('editemail').value;
    const houseName = document.getElementById('edithousename').value;
    const state = document.getElementById('editstate').value;
    const city = document.getElementById('editcity').value;
    const pin = document.getElementById('editpin').value;
    const addressId = document.getElementById('editAddressId').value;

    // console.log(addressId);

    fetch('/editaddress', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fullname: fullname,
            mobile: mobile,
            email: email,
            houseName: houseName,
            state: state,
            city: city,
            pin: pin,
            addressId: addressId
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                console.log("now")
                document.getElementById('EditAddressmodal').style.display = "none";
                $('#edit-address-div').load('/useraccount #edit-address-div')
                Swal.fire({
                    icon: 'success',
                    title: 'Edit Successful',
                    text: 'The address has been edited successfully!',
                });


            }

        }).catch(error => {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Deletion Error',
                text: 'An error occurred during editing. Please try again.',
            });
        })
}



// delete address

function deletaddress(k) {
    const adderssId = k;
    console.log("addressid", adderssId);


    fetch('/deletaddress', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            addressId: adderssId,
        }),
    })
        .then(response => response.json())
        .then(data => {
            $('#edit-address-div').load('/useraccount #edit-address-div');
            Swal.fire({
                icon: 'success',
                title: 'Deletion Successful',
                text: 'The address has been deleted successfully!',
            });
        })
        .catch(error => {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Deletion Error',
                text: 'An error occurred during deletion. Please try again.',
            });
        });
}





//  add to cart


function addcart(x) {

    const productId = x;
    console.log("ha ok ", x);

    fetch('/getcart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId: productId,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'cart already added') {
                Swal.fire({
                    icon: 'error',
                    title: 'cart already added',
                    text: 'Do you want to see cart?',
                    confirmButtonText: 'Show Cart',
                    confirmButtonColor: '#dbcc8f',
                    timer: 2000,
                }).then((risult)=>{
                    if(risult.isConfirmed){
                        window.location.href ="/cart"
                    }
                });
            } else if (data.success === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'cart added Successful',
                    text: 'Do you want to see cart?',
                    confirmButtonText: 'Show Cart',
                    confirmButtonColor: '#dbcc8f',
                    timer: 3000,
                }).then((result)=>{
                    console.log('helooreaxged');
                    if(result.isConfirmed){
                        window.location.href ="/cart"
                    }
                });

            } else {
                alert('An error occurred. Please try again.');
            }
        })
        .catch(error => {
            console.log(error);

        });
}


function removecart(x) {
  
    const productId = x;
    console.log("p",productId)
    fetch("/removecarts", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId,
        }),
    })
    .then(response => response.json())
    .then(data => { 
        if(data.success===true){
            Swal.fire({
                icon: 'success',
                title: 'cart removed Successful',
                text: 'Do you want to see cart?',
                timer: 2000,
            })
            $('#cart-relod-div').load('/cart #cart-relod-div');
            $('#cart-relod-divs').load('/cart #cart-relod-divs');
            $('#checkout-relode').load('/cart #checkout-relode');
        
            
        }  

        
    })
    .catch(error => {
        console.log(error);       
    });
}



//

function  decreasequantity(productId,productprice){
    console.log(productId);
    console.log(productprice);

    let quantityDisplay = document.getElementById('quantity-display'+productId);
    let currentQuantity = parseInt(quantityDisplay.value);
    console.log(currentQuantity);
    console.log(quantityDisplay);
    if(currentQuantity >1){
        quantityDisplay.value = currentQuantity-1;
        updateTottal(productId,currentQuantity-1,productprice);
        updateQuantity(productId , currentQuantity-1);
    }

}


function increasequantity(productId,productprice){
    console.log(productId);
    console.log(productprice);

    let quantityDisplay = document.getElementById('quantity-display'+productId);
    let currentQuantity = parseInt(quantityDisplay.value);
    console.log(currentQuantity);
    console.log(quantityDisplay);
    
        quantityDisplay.value = currentQuantity+1;
        updateTottal(productId,currentQuantity+1,productprice);
        updateQuantity(productId , currentQuantity+1);

}



// function updateTottal(){

// }

function updateQuantity(productId,currentQuantity){

    console.log(productId);        
    console.log(currentQuantity);

    fetch("/updatecart", {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId,
            currentQuantity
        }),
    }).then(response => response.json)
    .then(data=>{
        console.log("hiiii ok");

    })

    
}

// function updatesubTottel(){
//     console.log("hiii")
//     const totalColumns = document.querySelector('.cart-totals');
//     const subtotal = document.getElementById('subtotel-amount');

//     // console.log(totalColumns);
//     console.log(subtotal);

//     let sum = 0 ;
//     totalColumns.forEach(column => {
//         sum += parseFloat(column.textContent.replace("$", ''));
//     });

//     console.log(totalColumns)

//     subtotal.textContent.sum.fixed(2);
//     document.getElementById('subtotel-amount').innerHTML = document.getElementById('subtotel')


// }


function updateTottal(productId,currentQuantity,productprice){

    const  Id = productId;
    const Quantity = currentQuantity;
    const price = productprice;
 
    console.log(Id);
    console.log(Quantity);
    console.log(price);
 
    const tottelelement = document.getElementById('total' + Id);
    const newtottal = price*Quantity;
    tottelelement.innerText = '$' + newtottal.toFixed(2);

    // updatesubTottel()

} 