let role = "user";

let items = JSON.parse(localStorage.getItem("items")) || [
  { name: "Burger", price: 50, stock: 10 },
  { name: "Pizza", price: 120, stock: 5 }
];

let billHistory = JSON.parse(localStorage.getItem("history")) || [];

/* IMAGE FROM SAME FOLDER */
function getImage(name) {
  return `${name.toLowerCase().replace(/\s/g, "")}.jpg`;
}

/* TAB SWITCH */
function switchTab(tab) {
  role = tab;
  userTab.classList.remove("active");
  adminTab.classList.remove("active");
  document.getElementById(tab + "Tab").classList.add("active");
}

/* ENTER KEY LOGIN */
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && !loginSection.classList.contains("hidden")) login();
});

/* LOGIN */
function login() {
  if (role === "admin" && username.value === "admin" && password.value === "admin123") {
    loginSection.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    renderAdmin();
  } 
  else if (role === "user" && username.value === "user" && password.value === "user123") {
    loginSection.classList.add("hidden");
    userPanel.classList.remove("hidden");
    renderUser();
    renderHistory();
  } 
  else {
    loginError.innerText = "Invalid credentials";
  }
}

function logout() {
  location.reload();
}

/* ================= ADMIN ================= */

function renderAdmin() {
  adminItems.innerHTML = "";

  items.forEach((i, idx) => {
    adminItems.innerHTML += `
      <div class="card">
        <div style="display:flex; justify-content:flex-end;">
          <button onclick="deleteItem(${idx})" 
            style="background:#e74c3c; padding:4px 8px; font-size:12px;">
            ❌
          </button>
        </div>

        <img src="${getImage(i.name)}" onerror="this.src='food.png'">
        <h4>${i.name}</h4>
        <p>₹${i.price}</p>
        <p>Stock: ${i.stock}</p>

        <div class="stock-controls">
          <button onclick="updateStock(${idx},1)">+</button>
          <button onclick="updateStock(${idx},-1)">-</button>
        </div>
      </div>`;
  });
}

/* UPDATE STOCK */
function updateStock(index, value) {
  if (items[index].stock + value >= 0) {
    items[index].stock += value;
    save();
  }
}

/* DELETE ITEM */
function deleteItem(index) {
  if (confirm("Are you sure you want to delete this item?")) {
    items.splice(index, 1);
    save();
  }
}

/* ADD ITEM WITH VALIDATION */
function addItem() {
  const name = newName.value.trim();
  const price = Number(newPrice.value);
  const stock = Number(newStock.value);

  if (!name) {
    alert("Item name is required");
    return;
  }

  if (!price || price <= 0) {
    alert("Valid price is required");
    return;
  }

  if (stock < 0 || newStock.value === "") {
    alert("Valid initial stock is required");
    return;
  }

  // Prevent duplicate item names
  if (items.some(i => i.name.toLowerCase() === name.toLowerCase())) {
    alert("Item already exists");
    return;
  }

  items.push({ name, price, stock });

  newName.value = "";
  newPrice.value = "";
  newStock.value = "";

  save();
}

/* ================= USER ================= */

function renderUser() {
  userItems.innerHTML = "";

  items.forEach((i, idx) => {
    userItems.innerHTML += `
      <div class="card">
        <img src="${getImage(i.name)}" onerror="this.src='food.png'">
        <h4>${i.name}</h4>
        <p>₹${i.price}</p>
        <p>Stock: ${i.stock}</p>
        <input type="number" min="0" max="${i.stock}" id="q${idx}">
      </div>`;
  });
}

/* GENERATE BILL */
function generateBill() {
  let total = 0;
  let hasItem = false;

  let html = `<div class="bill-card">
    <h3 class="center">🧾 Bill</h3>`;

  items.forEach((i, idx) => {
    let q = Number(document.getElementById("q" + idx).value);

    if (q > 0) {
      if (q > i.stock) {
        alert(`Not enough stock for ${i.name}`);
        return;
      }

      hasItem = true;
      i.stock -= q;
      total += q * i.price;

      html += `
        <div class="bill-item">
          <span>${i.name} x${q}</span>
          <span>₹${q * i.price}</span>
        </div>`;
    }
  });

  if (!hasItem) {
    alert("Please select at least one item");
    return;
  }

  html += `<div class="bill-total">TOTAL: ₹${total}</div></div>`;
  bill.innerHTML = html;

  billHistory.push({
    date: new Date().toLocaleString(),
    total
  });

  save();
}

/* BILL HISTORY (LATEST FIRST) */
function renderHistory() {
  let html = `<div class="history-grid">`;

  [...billHistory].reverse().forEach(h => {
    html += `
      <div class="history-card">
        <b>₹${h.total}</b><br>
        <small>${h.date}</small>
      </div>`;
  });

  html += `</div>`;
  document.getElementById("history").innerHTML = html;
}

/* SAVE */
function save() {
  localStorage.setItem("items", JSON.stringify(items));
  localStorage.setItem("history", JSON.stringify(billHistory));

  renderAdmin();
  renderUser();
  renderHistory();
}
