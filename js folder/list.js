/* =====================================================
   list.js  -  Grocery list
   Every item is an OBJECT { name, qty, bought } and each
   user has their own ARRAY of items, stored like this:
       { "kimverly": [ {name:"Rice", qty:2, bought:false}, ... ] }
   ===================================================== */

// Who is logged in? (saved by log.js)
const currentUser = loadData(KEY_SESSION, null);

// Protect the page: if nobody is logged in, go back to the login page
if (!currentUser) {
    window.location.href = "login.html";
}

// Get this user's items array from the big items object
function getItems() {
    const allItems = loadData(KEY_ITEMS, {});
    return allItems[currentUser] || [];
}

// Save this user's items array back into the big items object
function saveItems(items) {
    const allItems = loadData(KEY_ITEMS, {});
    allItems[currentUser] = items;
    saveData(KEY_ITEMS, allItems);
}

// Add a new item (or increase the quantity if it already exists)
function addItem() {
    const nameInput = document.getElementById("item_uname");
    const qtyInput  = document.getElementById("item_qty");

    const name = nameInput.value.trim();
    const qty  = parseInt(qtyInput.value, 10);

    // Validation: name required, quantity must be a whole number of at least 1
    if (!name) {
        showMessage("listMessage", "Type the item name first.", "error");
        return;
    }
    if (isNaN(qty) || qty < 1) {
        showMessage("listMessage", "Quantity must be at least 1.", "error");
        return;
    }

    const items = getItems();

    // Same item already on the list? Just add to its quantity.
    const existing = items.find(function (item) {
        return item.name.toLowerCase() === name.toLowerCase();
    });

    if (existing) {
        existing.qty += qty;
        showMessage("listMessage", name + " already on the list. Quantity updated.", "ok");
    } else {
        items.push({ name: name, qty: qty, bought: false });
        showMessage("listMessage", name + " added.", "ok");
    }

    saveItems(items);
    renderList();

    // Reset the form so the next item can be typed right away
    nameInput.value = "";
    qtyInput.value = 1;
    nameInput.focus();
}

// Mark an item as bought / not bought (index = position in the array)
function toggleItem(index) {
    const items = getItems();
    items[index].bought = !items[index].bought;
    saveItems(items);
    renderList();
}

// Remove one item from the array
function removeItem(index) {
    const items = getItems();
    items.splice(index, 1);   // splice(position, how many to remove)
    saveItems(items);
    renderList();
}

// Remove every item (asks first so it is not deleted by accident)
function clearList() {
    if (getItems().length === 0) {
        showMessage("listMessage", "The list is already empty.", "error");
        return;
    }
    if (confirm("Remove all items from your list?")) {
        saveItems([]);
        renderList();
        showMessage("listMessage", "List cleared.", "ok");
    }
}

// Draw the list on the page from the items array
function renderList() {
    const listElement = document.getElementById("groceryList");
    const items = getItems();

    listElement.innerHTML = "";   // clear the old list first

    // Empty state: tell the user what to do next
    if (items.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = "Nothing here yet. Add your first item above.";
        listElement.appendChild(empty);
    }

    // Build one <li> for each item object
    items.forEach(function (item, index) {
        const li = document.createElement("li");
        if (item.bought) li.classList.add("bought");

        // Text part: "Rice" and "x2"
        const label = document.createElement("span");
        label.className = "item-text";
        label.textContent = item.name;

        const qty = document.createElement("span");
        qty.className = "item-qty";
        qty.textContent = "x" + item.qty;

        // Buttons part: mark as bought + delete
        const doneBtn = document.createElement("button");
        doneBtn.type = "button";
        doneBtn.className = "btn-small";
        doneBtn.textContent = item.bought ? "Undo" : "Bought";
        doneBtn.addEventListener("click", function () { toggleItem(index); });

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn-small btn-danger";
        delBtn.textContent = "Remove";
        delBtn.addEventListener("click", function () { removeItem(index); });

        li.append(label, qty, doneBtn, delBtn);
        listElement.appendChild(li);
    });

    // Counter: how many items are still left to buy
    const left = items.filter(function (item) { return !item.bought; }).length;
    document.getElementById("itemCount").textContent =
        items.length + " item(s), " + left + " left to buy";
}

// Log out: remove the saved session and go back to login
function logoutUser() {
    localStorage.removeItem(KEY_SESSION);
    window.location.href = "login.html";
}

// Run when the page opens (only if logged in)
if (currentUser) {
    document.getElementById("welcomeText").textContent = "Hi, " + currentUser;
    renderList();
}