let role = "user";

let items = JSON.parse(localStorage.getItem("items")) || [
  { name: "Burger", price: 50, stock: 10 },
  { name: "Pizza", price: 120, stock: 5 }
];

let billHistory = JSON.parse(localStorage.getItem("history")) || [];

/* IMAGE AUTO */
function getImage(name) {
  return `images/${name.toLowerCase().replace(/\s/g, "")}.jpg`;
}

/* TAB */
function switchTab(tab) {
  role = tab;
  userTab.classList.remove("active");
  adminTab.classList.remove("active");
  document.getElementById(tab + "Tab").classList.add("active");
}

/* ENTER LOGIN */
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

/* ADMIN */
function renderAdmin() {
  adminItems.innerHTML = "";
  items.forEach((i, idx) => {
    adminItems.innerHTML += `
      <div class="card">
        <img src="${getImage(i.name)}" onerror="this.src='images/food.png'">
        <h4>${i.name}</h4>
        <p>₹${i.price}</p>
        <p>Stock: ${i.stock}</p>
        <button onclick="updateStock(${idx},1)">+</button>
        <button onclick="updateStock(${idx},-1)">-</button>
      </div>`;
  });
}

function updateStock(i, v) {
  if (items[i].stock + v >= 0) {
    items[i].stock += v;
    save();
  }
}

function addItem() {
  items.push({
    name: newName.value,
    price: Number(newPrice.value),
    stock: Number(newStock.value)
  });
  save();
}

/* USER */
function renderUser() {
  userItems.innerHTML = "";
  items.forEach((i, idx) => {
    userItems.innerHTML += `
      <div class="card">
        <img src="${getImage(i.name)}" onerror="this.src='images/food.png'">
        <h4>${i.name}</h4>
        <p>₹${i.price}</p>
        <p>Stock: ${i.stock}</p>
        <input type="number" min="0" max="${i.stock}" id="q${idx}">
      </div>`;
  });
}

function generateBill() {
  let total = 0;
  let hasItem = false;
  let html = `<div class="bill-card"><h3 class="center">🧾 Bill</h3>`;

  items.forEach((i, idx) => {
    let q = Number(document.getElementById("q" + idx).value);
    if (q > 0) {
      if (q > i.stock) return alert("Out of stock");
      hasItem = true;
      i.stock -= q;
      total += q * i.price;
      html += `<div class="bill-item"><span>${i.name} x${q}</span><span>₹${q*i.price}</span></div>`;
    }
  });

  if (!hasItem) return alert("Select at least one item");

  html += `<div class="bill-total">TOTAL: ₹${total}</div></div>`;
  bill.innerHTML = html;

  billHistory.push({ date: new Date().toLocaleString(), total });
  save();
}

/* HISTORY */
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
