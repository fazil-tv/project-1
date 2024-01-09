


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
    if(!isValid){
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
                // document.getElementById('#addressdiv').load('/useraccount #addressdiv')
                window.location.reload();
            }
        }).catch(error => {
            console.log(error);
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
    if(!isValid){
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
            pin: pin,
            addressId: addressId
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                // const modal = document.getElementById('editmodal');
                // modal.style.display = 'none';
                // document.getElementById('#edit-address-div').load('/editaddress #edit-address-div')
                window.location.reload();
            }

        }).catch(error => {
            console.log(error);
        })
}

