function validateForm() {
    // Prevent the default form submission
    event.preventDefault();
    document.getElementById('nameField').style.display = 'none';
    document.getElementById('emailField').style.display = 'none';
    document.getElementById('mobileField').style.display = 'none';
    document.getElementById('passwordField').style.display = 'none';
    document.getElementById('confirmpasswordField').style.display = 'none';

    const username = document.forms["myForm"]["username"].value;
    const email = document.forms["myForm"]["email"].value;
    const mobilenumber = document.forms["myForm"]["mobilenumber"].value;
    const password = document.forms["myForm"]["password"].value;
    const confirmPassword = document.forms["myForm"]["confirmPassword"].value;
    let isValid = true;
    
    const emailevalidator = (email) => {
        const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return emailPattern.test(email);
    }


    if (username.trim() === "") {
        document.getElementById('nameField').style.display = 'block';
        isValid = false;
    }

    if (!emailevalidator(email)) {
        document.getElementById('emailField').style.display = 'block';
        console.log(`${email} is a  valid email address`)
        isValid = false;
    }
    else {
        console.log(`${email} is not a valid email address`)
    }
    if (mobilenumber.length < 10) {
        document.getElementById('mobileField').style.display = 'block';
        isValid = false;
    }
    if (password.length < 8) {
        document.getElementById('passwordField').style.display = 'block';
        isValid = false;
    }
    if (password !== confirmPassword) {
        document.getElementById('confirmpasswordField').style.display = 'block';
        isValid = false;
    }
    if (!isValid) return;

    document.getElementById('myForm').submit();
}