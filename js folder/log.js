
/* =====================================================
   log.js  -  Login
   Looks for the typed username/password inside the
   users ARRAY saved by reg.js.
   ===================================================== */

function loginUser() {
    // 1. Get what the user typed
    const userName = document.getElementById("login_uname").value.trim();
    const password = document.getElementById("login_pword").value;

    // 2. Both fields are required
    if (!userName || !password) {
        showMessage("logMessage", "Enter your username and password.", "error");
        return;
    }

    // 3. Load all registered users
    const users = loadData(KEY_USERS, []);

    // 4. find() returns the matching user OBJECT (or undefined if none)
    const match = users.find(function (user) {
        return user.username.toLowerCase() === userName.toLowerCase()
            && user.password === password;
    });

    // 5. Wrong details -> show an error and stop
    if (!match) {
        showMessage("logMessage", "Wrong username or password.", "error");
        return;
    }

    // 6. Remember who is logged in, then open the grocery list
    if (!saveData(KEY_SESSION, match.username)) {
        showMessage("logMessage", "Cannot save here. Open this page in Edge or Chrome.", "error");
        return;
    }
    showMessage("logMessage", "Login successful! Opening your list...", "ok");

    setTimeout(function () {
        window.location.href = "list.html";
    }, 800);
}