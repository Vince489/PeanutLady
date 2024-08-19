const flavorPrice = 5;
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let flavorIndex = 1;
let editIndex = -1;
document.getElementById('order-form').addEventListener('submit', addOrder);
function addFlavor() {
    const flavorsDiv = document.getElementById('flavors');
    const newFlavorDiv = document.createElement('div');
    newFlavorDiv.classList.add('flavor-entry');
    newFlavorDiv.innerHTML = `
        <label for="flavor-${flavorIndex}">Flavor:</label>
        <select id="flavor-${flavorIndex}" class="flavor" required>
            <option value="regular">Regular</option>
            <option value="garlic">Garlic</option>
            <option value="jalapeno">Jalapeno</option>
            <option value="jalapenoGarlic">Jalapeno Garlic</option>
            <option value="spicy">Spicy</option>
            <option value="spicyGarlic">Spicy Garlic</option>
            <option value="spicyJalapeno">Spicy Jalapeno</option>
            <option value="spicyGarlicJalapeno">Spicy Garlic Jalapeno</option>
        </select>
        <label for="quantity-${flavorIndex}">Quantity:</label>
        <input type="number" id="quantity-${flavorIndex}" class="quantity" min="1" required>
        <button type="button" class="delete-button" onclick="removeFlavor(this)">Remove</button>
    `;
    flavorsDiv.appendChild(newFlavorDiv);
    flavorIndex++;
}
function removeFlavor(button) {
    button.parentElement.remove();
}
function addOrder(event) {
    event.preventDefault();
    const customerName = document.getElementById('customer-name').value;
    const flavorEntries = document.querySelectorAll('.flavor-entry');
    let order = {
        customerName,
        flavors: [],
        timestamp: new Date().toLocaleString(),
        total: 0
    };
    flavorEntries.forEach(entry => {
        const flavor = entry.querySelector('.flavor').value;
        const quantity = parseInt(entry.querySelector('.quantity').value);
        order.flavors.push({ flavor, quantity });
        order.total += quantity * flavorPrice;
    });
    if (editIndex === -1) {
        orders.push(order);
    } else {
        orders[editIndex] = order;
        editIndex = -1;
    }
    localStorage.setItem('orders', JSON.stringify(orders));
    displayOrders();
    displaySummary();
    document.getElementById('order-form').reset();
    document.getElementById('flavors').innerHTML = `
        <div class="flavor-entry">
            <label for="flavor-0">Flavor:</label>
            <select id="flavor-0" class="flavor" required>
                <option value="regular">Regular</option>
                <option value="garlic">Garlic</option>
                <option value="jalapeno">Jalapeno</option>
                <option value="jalapenoGarlic">Jalapeno Garlic</option>
                <option value="spicy">Spicy</option>
                <option value="spicyGarlic">Spicy Garlic</option>
                <option value="spicyJalapeno">Spicy Jalapeno</option>
                <option value="spicyGarlicJalapeno">Spicy Garlic Jalapeno</option>
            </select>
            <label for="quantity-0">Quantity:</label>
            <input type="number" id="quantity-0" class="quantity" min="1" required>
            <button type="button" class="delete-button" onclick="removeFlavor(this)">Remove</button>
        </div>
    `;
    flavorIndex = 1;
}
function displayOrders() {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';
    orders.forEach((order, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<div><strong>${order.customerName}</strong><br>`;
        order.flavors.forEach(flavor => {
            li.innerHTML += `${flavor.quantity} ${flavor.flavor}<br>`;
        });
        li.innerHTML += `Total: $${order.total}<br>Timestamp: ${order.timestamp}</div>
                         <div><button onclick="editOrder(${index})">Edit</button> 
                         <button class="delete-button" onclick="deleteOrder(${index})">Delete</button></div>`;
        orderList.appendChild(li);
    });
}
// Function to load orders from a file
function loadOrders() {
  const fileInput = document.getElementById('fileInput');
  if (fileInput.files.length === 0) {
      alert('Please select a file.');
      return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
      orders = JSON.parse(event.target.result);
      localStorage.setItem('orders', JSON.stringify(orders)); // Save orders to local storage
      displayOrders();
      displaySummary();
  };
  reader.readAsText(file);
}

function deleteOrder(index) {
    orders.splice(index, 1);
    localStorage.setItem('orders', JSON.stringify(orders));
    displayOrders();
    displaySummary();
}
function editOrder(index) {
    const order = orders[index];
    document.getElementById('customer-name').value = order.customerName;
    const flavorsDiv = document.getElementById('flavors');
    flavorsDiv.innerHTML = '';
    order.flavors.forEach((flavor, i) => {
        const newFlavorDiv = document.createElement('div');
        newFlavorDiv.classList.add('flavor-entry');
        newFlavorDiv.innerHTML = `
            <label for="flavor-${i}">Flavor:</label>
            <select id="flavor-${i}" class="flavor" required>
                <option value="regular" ${flavor.flavor === 'regular' ? 'selected' : ''}>Regular</option>
                <option value="garlic" ${flavor.flavor === 'garlic' ? 'selected' : ''}>Garlic</option>
                <option value="jalapeno" ${flavor.flavor === 'jalapeno' ? 'selected' : ''}>Jalapeno</option>
                <option value="jalapenoGarlic" ${flavor.flavor === 'jalapenoGarlic' ? 'selected' : ''}>Jalapeno Garlic</option>
                <option value="spicy" ${flavor.flavor === 'spicy' ? 'selected' : ''}>Spicy</option>
                <option value="spicyGarlic" ${flavor.flavor === 'spicyGarlic' ? 'selected' : ''}>Spicy Garlic</option>
                <option value="spicyJalapeno" ${flavor.flavor === 'spicyJalapeno' ? 'selected' : ''}>Spicy Jalapeno</option>
                <option value="spicyGarlicJalapeno" ${flavor.flavor === 'spicyGarlicJalapeno' ? 'selected' : ''}>Spicy Garlic Jalapeno</option>
            </select>
            <label for="quantity-${i}">Quantity:</label>
            <input type="number" id="quantity-${i}" class="quantity" min="1" value="${flavor.quantity}" required>
            <button type="button" class="delete-button" onclick="removeFlavor(this)">Remove</button>
        `;
        flavorsDiv.appendChild(newFlavorDiv);
    });
    flavorIndex = order.flavors.length;
    editIndex = index;
    document.querySelector('button[type="submit"]').textContent = 'Update Order';
}

// Function to delete all orders
function deleteAllOrders() {
orders = [];
localStorage.setItem('orders', JSON.stringify(orders));
displayOrders();
displaySummary();
}

// Function to save orders to a JSON file
function saveOrdersToJson() {
const orders = JSON.parse(localStorage.getItem('orders')) || [];
const dataStr = JSON.stringify(orders, null, 2);

const date = new Date();
const dateStr = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD

const a = document.createElement('a');
a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
a.download = `orders_${dateStr}.json`; // Include the current date in the filename
a.click();
}

function displaySummary() {
    const orderSummary = document.getElementById('order-summary');
    orderSummary.innerHTML = '';
    let summary = {};
    let total = 0;
    orders.forEach(order => {
        order.flavors.forEach(flavor => {
            if (!summary[flavor.flavor]) {
                summary[flavor.flavor] = 0;
            }
            summary[flavor.flavor] += flavor.quantity;
            total += flavor.quantity * flavorPrice;
        });
    });
    for (const [flavor, quantity] of Object.entries(summary)) {
        const li = document.createElement('li');
        li.textContent = `${quantity} ${flavor} peanuts`;
        orderSummary.appendChild(li);
    }
    const totalLi = document.createElement('li');
    totalLi.textContent = `Total: $${total}`;
    orderSummary.appendChild(totalLi);
}
displayOrders();
displaySummary();
