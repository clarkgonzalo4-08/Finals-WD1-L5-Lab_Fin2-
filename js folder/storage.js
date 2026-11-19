
/* =====================================================
   storage.js
   Shared helper functions for reading/writing data.
   Data is kept as Arrays/Objects in memory, then saved
   to localStorage as JSON text (localStorage can only
   store strings).
   Refactored: reg.js, log.js and list.js all reuse these
   so the same code is not repeated in every file.
   ===================================================== */

// Keys used in localStorage (kept in one place to avoid typos)
const KEY_USERS = "gk_users";           // Array of user objects
const KEY_ITEMS = "gk_items";           // Object: { username: [item, item, ...] }
const KEY_SESSION = "gk_currentUser";   // Username of the logged-in user

// Read a value from localStorage and turn the JSON back into an Array/Object.
// If nothing is saved yet (or the data is broken), return the fallback value.
function loadData(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        return fallback;
    }
}

// Turn an Array/Object into JSON text and save it to localStorage.
// Returns true if it saved, false if the browser blocked storage
// (some embedded browsers, like the one inside VS Code, block it on file:// pages).
function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        return false;
    }
}

// Show a message inside a <p> (or any element) with a "ok" or "error" style.
function showMessage(elementId, text, type) {
    const box = document.getElementById(elementId);
    box.textContent = text;
    box.className = "message " + (type || "");
}