
/* =====================================================
   reg.js  -  Registration
   Stores every user as an OBJECT inside an ARRAY,
   then saves that array to localStorage.
   ===================================================== */

function saveUserRecord() {
    // 1. Get the values from the form (trim() removes extra spaces)
    const fullName = document.getElementById("full_name").value.trim();
    const address  = document.getElementById("address").value.trim();
    const userName = document.getElementById("user_name").value.trim();
    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("pword").value;

    // 2. Validation: no empty fields
    if (!fullName || !address || !userName || !email || !password) {
        showMessage("regMessage", "Please fill in all fields.", "error");
        return;
    }

    // 3. Validation: simple email format check (text@text.text)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showMessage("regMessage", "Please enter a valid email address.", "error");
        return;
    }

    // 4. Validation: password length
    if (password.length < 6) {
        showMessage("regMessage", "Password must be at least 6 characters.", "error");
        return;
    }

    // 5. Load the existing users array (empty array if none yet)
    const users = loadData(KEY_USERS, []);

    // 6. Check if the username is already taken (not case-sensitive)
    const taken = users.some(function (user) {
        return user.username.toLowerCase() === userName.toLowerCase();
    });
    if (taken) {
        showMessage("regMessage", "That username is already taken. Try another one.", "error");
        return;
    }

    // 7. Build the user OBJECT and add it to the ARRAY
    const newUser = {
        fullName: fullName,
        address: address,
        username: userName,
        email: email,
        password: password
    };
    users.push(newUser);

    // 8. Save the whole array back to localStorage
    //    (if the browser blocks storage, tell the user instead of failing silently)
    if (!saveData(KEY_USERS, users)) {
        showMessage("regMessage", "Cannot save here. Open this page in Edge or Chrome.", "error");
        return;
    }

    showMessage("regMessage", "Account created! Taking you to the login page...", "ok");

    // 9. Go to the login page after a short delay so the message can be read
    setTimeout(function () {
        window.location.href = "login.html";
    }, 1200);
}