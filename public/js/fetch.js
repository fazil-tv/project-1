

// resend otp

async function fetchOTP(userId, email) {

    event.preventDefault();
    try {
        const response = await fetch('/resendotp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, email }),
        });

        if (response.ok) {

            window.location.reload()

 

            console.log('Resend OTP request successful');


        } else {
            console.error('Resend OTP request failed');
        }
    } catch (error) {
        console.error('Error during Resend OTP request:', error);
    }
}




//forget resend otp

// async function forgetOTP(userId, email) {

//     event.preventDefault();
//     try {
//         const response = await fetch('/resendotp', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ userId, email }),
//         });

//         if (response.ok) {

//             window.location.reload()



//             console.log('Resend OTP request successful');


//         } else {
//             console.error('Resend OTP request failed');
//         }
//     } catch (error) {
//         console.error('Error during Resend OTP request:', error);
//     }
// }




// otp timer









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
                // $('#edit-address-div').load('/useraccount #edit-address-div');
                // $('#editdive').load('/useraccount #editdive');
                window.location.reload();



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
                }).then((risult) => {
                    if (risult.isConfirmed) {
                        window.location.href = "/cart"
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
                }).then((result) => {
                    console.log('helooreaxged');
                    if (result.isConfirmed) {
                        window.location.href = "/cart"
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
    console.log("p", productId)
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
            if (data.success === true) {
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



function updateQuantity(productId, count) {
    console.log("heiiiii");

    console.log(productId);
    console.log(count);

    fetch("/updatecart", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId,
            count
        }),
    }).then(response => response.json())
        .then(data => {
            if (data.success === true) {
                console.log("hiiii ok done");

                $('#checkout-relode').load('/cart #checkout-relode');

            } else {
                Swal.fire({
                    icon: 'faile',
                    text: data.message,
                    timer: 2000,
                })

            }

        })


}

// document.addEventListener('DOMContentLoaded', function () {
//     updatesubTottel();
// });


function updatesubTottel() {
    console.log("hiii")
    const totalColumns = document.querySelectorAll('.cart-totals');
    console.log(totalColumns)
    const subtotal = document.getElementById('subtotel-amount');


    // console.log(totalColumns);
    console.log(subtotal);

    let sum = 0;

    totalColumns.forEach((column) => {
        console.log(column.textContent);
        sum += parseFloat(column.textContent.replace("$", '') || 0);
    });

    console.log(totalColumns)

    subtotal.textContent = sum;
    document.getElementById('subtotel-amount').innerHTML;


}


function updateTottal(productId, currentQuantity, productprice) {

    const Id = productId;
    const Quantity = currentQuantity;
    const price = productprice;

    console.log(Id);
    console.log(Quantity);
    console.log(price);

    const tottelelement = document.getElementById('total' + Id);
    const newtottal = price * Quantity;
    tottelelement.innerText = '$' + newtottal.toFixed(2);

    updatesubTottel()

}






function edituser(event) {

    event.preventDefault();
    const fullname = document.getElementById('newUsername').value;
    const mobile = document.getElementById('newUserMobile').value;

    let isValid = true;

    if (!fullname || !mobile) {
        isValid = false;
    }
    if (fullname.trim() === "") {
        document.getElementById('edit-user-name-error').textContent = "please enter your name"

        isValid = false;
    }
    if (mobile.length < 10) {
        document.getElementById('edit-user-phon-error').textContent = "please enter your valid mobile number";
        isValid = false;
    }
    if (isValid === false) {
        return console.log('your validation failed')
    }
    else {
        console.log("haa ok")
        useredit()
    }

}


function useredit() {
    const fullname = document.getElementById('newUsername').value;
    const mobile = document.getElementById('newUserMobile').value;

    fetch("/edituser", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fullname,
            mobile

        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'user edit Successful',
                    text: 'Do you want to see cart?',
                    timer: 2000,
                })
                // window.location.reload();
                document.getElementById('editProfileModal').style.display = "none";
                $('#user-profile-relode').load('/useraccount #user-profile-relode');

                // $('#editProfileModal').load('/useraccount #editProfileModal');

            }

        })
        .catch(error => {
            console.log(error);
        });
}











function checkoutaddressvalidation() {
    console.log("heiiii");

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
        checkoutaddress();
    }

}





function checkoutaddress() {
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

            document.getElementById('checkaddaddressmodal').style.display = "none";
            // $('#edit-address-div').load('/checkour #edit-address-div');
            window.location.reload();


            if (data) {


                // $('#editdive').load('/useraccount #editdive');


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









function checkouteditaddressvalidation() {
    console.log("kkkkkk");
    const fullname = document.getElementById('editfullname').value;
    const mobile = document.getElementById('editmobile').value;
    const email = document.getElementById('editemail').value;
    const houseName = document.getElementById('edithousename').value;
    const state = document.getElementById('editstate').value;
    const city = document.getElementById('editcity').value;
    const pin = document.getElementById('editpin').value;




    document.getElementById('edit-fullname-error').innerText = '';
    document.getElementById('edit-mobile-error').innerText = '';
    document.getElementById('edit-email-error').innerText = '';
    document.getElementById('edit-houseName-error').innerText = '';
    document.getElementById('edit-state-error').innerText = '';
    document.getElementById('edit-city-error').innerText = '';
    document.getElementById('edit-pin-error').innerText = '';


    let isValid = true;

    if (!fullname || !mobile || !email || !houseName || !state || !city || !pin) {
        isValid = false;
    }

    if (fullname.trim() === "") {
        document.getElementById('edit-fullname-error').textContent = 'enter your name';
        isValid = false;
    }



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
        checkouteditaddress();
    }

}



function checkouteditaddress() {

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
                document.getElementById('checkoutEditAddressmodal').style.display = "none";
                // $('#edit-address-div').load('/checkout #edit-address-div')
                window.location.reload();
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








function validateForm(event) {
    event.preventDefault();

    const paymentMethod = document.querySelector('input[name="payment"]:checked');

    if (!paymentMethod) {
        document.getElementById("inputid").style.display = "block";
        event.preventDefault();
    } else {
        checkoutpost()
    }


}



function checkoutpost() {


    const formData = $('#myForm').serialize();
    const params = new URLSearchParams(formData);
    const jsonData = Object.fromEntries([...params.entries()]);

    console.log(formData)

    console.log("klkl");

    fetch('/checkoutform', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonData
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.status === "success") {
                console.log("Product placed successfully");
                window.location.href = "/success";
            } else if (data.status === "false") {

                console.log(data.order, "***********")
                console.log(data.subtotel, "***********")
                razerpay(data.order, data.subtotel)
            } else {

            }
        }).catch(error => {
            console.log(error);

        })
}

function razerpay(order, subtotel) {
    console.log(order, "#######")
    console.log(subtotel, "######")


    var options = {
        "key": "rzp_test_Iss6UqTyR8v6so",
        "amount": subtotel,
        "currency": "INR",
        "name": "Mini Shop",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id,
        "handler": function (responce) {
            verifyPayment(responce, order);

        },
        "prefill": {
            "name": "MUHAMMED FAZIL TV",
            "email": "MUHAMMEDFAZIL@GMAIL.COM",
            "contact": "9947948636"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    }
    let raz = new Razorpay(options);
    raz.open();

}

function verifyPayment(responce, order) {


    fetch('/verifyPayments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            responce,
            order
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                console.log("Product placed successfully");
                window.location.href = "/success";
            }

        }).catch(error => {
            console.log(error);

        })
}






function cancelorder(x, ids, order_id) {
    // const orderId = x;

    const productId = x;
    const id = ids;
    const orderId = order_id;
    console.log(productId);
    console.log(id);
    console.log(orderId);
    fetch('/orderstatus', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId,
            id,
            orderId
        })
    })
        .then(response => response.json())
        .then(data => {


            if (data.status === "success") {
                Swal.fire({
                    icon: 'success',
                    title: 'Order Cancelled',

                });
            }

            window.location.reload();




        }).catch(error => {
            console.log(error);

        })
}


function returnorder(x, y, z) {
    const productId = x;
    const id = y;
    const orderId = z;
    console.log("productId", productId)
    console.log("id", id)
    console.log("orderId", orderId)

    Swal.fire({
        title: 'Enter Return Reason',
        input: 'text',
        inputLabel: 'Return Reason',
        inputPlaceholder: 'Please enter the reason for Return',
        showCancelButton: true,
        confirmButtonText: 'Cancel Order',
        cancelButtonText: 'Cancel',
        preConfirm: (returnReason) => {
            if (!returnReason) {
                Swal.showValidationMessage('Return reason is required');
            }
            return returnReason;
        },
    }).then((result) => {
        if (result.isConfirmed) {
            const data = {
                returnReason: result.value,
                productId,
                id,
                orderId
            };

            fetch('/returnorder', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Order Cancelled',
                        });
                    }
                    window.location.reload();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    });
}

function addwishlist(productId) {
    try {
        fetch('/getwishlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId
            })
        })
            .then(response => response.json())
            .then(data => {

                // if (data.status) {
                //     $('#edit-address-div').load('/checkout #edit-address-div')
                //     // window.location.reload();



                // } else {
                //     $('#edit-address-div').load('/checkout #edit-address-div')
                //     // window.location.reload();


                // }

                window.location.reload();



                // $('#edit-address-div').load('/checkout #edit-address-div')






            }).catch(error => {
                console.log(error);

            })
    } catch (error) {

    }
}


function removewishlist(productId) {
    try {
        fetch('/removewishlist', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId
            })
        })
            .then(response => response.json())
            .then(data => {

                if (data.status) {
                    console.log("failed")
                    Swal.fire({
                        icon: 'error',
                        title: 'removed',

                    });
                    window.location.reload();



                } else {
                    console.log("added")
                    Swal.fire({
                        icon: 'success',
                    });
                    window.location.reload();

                }

                // window.location.reload();
                // $('#relode-div').load('/detaile #relode-div');


            }).catch(error => {
                console.log(error);

            })
    } catch (error) {

    }
}



function couponapply(x) {
    const couponId = x;
    console.log(couponId);
    fetch('/applycoupons', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            couponId

        })
    })
        .then(response => response.json())
        .then(data => {

            if (data.status === "applid") {

                Swal.fire({
                    title: "Success",
                    text: "Coupon added successfully!",
                    icon: "success",
                    confirmButtonText: "OK",

                });

                $('#relodedives').load('/checkout #relodedives');
                $('#checkrelodedives').load('/checkout #checkrelodedives');


            } else if (data.status === 'alreadyused') {

                Swal.fire({
                    title: "You already used this coupon",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                $('#relodedives').load('/checkout #relodedives');


            }
            else if (data.status === 'alreadyapplid') {
                Swal.fire({
                    title: "One coupon is already Active",
                    icon: "info",
                    confirmButtonText: "OK",
                });
                $('#relodedives').load('/checkout #relodedives');



            }

            // window.location.reload();

        }).catch(error => {
            console.log(error);

        })
}

function removecoupon(x) {
    const couponId = x;
    console.log(couponId);
    fetch('/removecoupons', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            couponId

        })
    })
        .then(response => response.json())
        .then(data => {


            if (data.status) {

                Swal.fire({
                    title: "Coupon removed",
                    icon: "success",
                    confirmButtonText: "OK",

                })

                $('#relodedives').load('/checkout #relodedives');

                $('#checkrelodedives').load('/checkout #checkrelodedives');

            } else {
                Swal.fire({
                    title: "Error removing coupon",
                    icon: "error",
                    confirmButtonText: "OK",
                });




            }

            // window.location.reload();




        }).catch(error => {
            console.log(error);

        })
}



// couponapply



function offerapply(x) {
    const offerId = x;
    const productId = document.getElementById(`hiddenproductId${index}`).value;
    console.log(productId,"productid");
    fetch('/admin/applyoffer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            offerId,
            productId
        })
    })
  
        .then(response => response.json())
        .then(data => {

            if (data.status === "applid") {

                Swal.fire({
                    title: "Success",
                    text: "offer added successfully!",
                    icon: "success",
                    confirmButtonText: "OK",

                });

                // $('#relodedives').load('/checkout #relodedives');
                // $('#checkrelodedives').load('/checkout #checkrelodedives');


            }
            window.location.reload();

        }).catch(error => {
            console.log(error);

        })
}


// removeoffer

function removeoffer(i) {
    let index;
    index = i;
    const productId = document.getElementById(`hiddenproductId${index}`).value;
    console.log(productId);
    fetch('/admin/removeoffer', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId
        })
    })
        .then(response => response.json())
        .then(data => {

            if (data.status === "applid") {

                Swal.fire({
                    title: "Success",
                    text: "offer added successfully!",
                    icon: "success",
                    confirmButtonText: "OK",

                });

                // $('#relodedives').load('/checkout #relodedives');
                // $('#checkrelodedives').load('/checkout #checkrelodedives');


            }
            window.location.reload();

        }).catch(error => {
            console.log(error);

        })
}



function removecoupon(x) {
    const couponId = x;
    console.log(couponId);
    fetch('/removecoupons', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            couponId

        })
    })
        .then(response => response.json())
        .then(data => {


            if (data.status) {

                Swal.fire({
                    title: "Coupon removed",
                    icon: "success",
                    confirmButtonText: "OK",

                })

                $('#relodedives').load('/checkout #relodedives');

                $('#checkrelodedives').load('/checkout #checkrelodedives');

            } else {
                Swal.fire({
                    title: "Error removing coupon",
                    icon: "error",
                    confirmButtonText: "OK",
                });




            }

            // window.location.reload();




        }).catch(error => {
            console.log(error);

        })
}



// categoryofferapply

function categoryofferapply(x) {
   
    const offerId = x;
    const categoryId = document.getElementById(`hiddencategoryid${index}`).value;

    fetch('/admin/categoryofferapply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            offerId,
            categoryId
        })
    })
  
        .then(response => response.json())
        .then(data => {

            if (data.status === "applid") {

                Swal.fire({
                    title: "Success",
                    text: "offer added successfully!",
                    icon: "success",
                    confirmButtonText: "OK",

                });

            }
            window.location.reload();

        }).catch(error => {
            console.log(error);

        })
}


// cancel offer

function removecategoryoffer(x) {
    let index;
    index = x;
    const categoryId = document.getElementById(`hiddencategoryid${index}`).value;

    fetch('/admin/removecategoryoffer', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            categoryId
        })
    })
  
        .then(response => response.json())
        .then(data => {

            if (data.status === "applid") {

                Swal.fire({
                    title: "Success",
                    text: "offer added successfully!",
                    icon: "success",
                    confirmButtonText: "OK",

                });

            }
            window.location.reload();

        }).catch(error => {
            console.log(error);

        })
}















