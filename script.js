const products = [
  { id: 1, name: "Samsung Phone", price: 150000, category: "Phones" },
  { id: 2, name: "HP Laptop", price: 400000, category: "Computers" },
  { id: 3, name: "Smart Watch", price: 40000, category: "Accessories" },
  { id: 4, name: "Headphones", price: 25000, category: "Accessories" },
  { id: 5, name: "Gaming Mouse", price: 15000, category: "Accessories" },
  { id: 6, name: "Tablet", price: 210000, category: "Computers" }
];

let cart = [];
try {
  cart = JSON.parse(localStorage.getItem("deeknox-cart")) || [];
} catch (error) {
  cart = [];
}

function money(amount) {
  return "₦" + Number(amount).toLocaleString("en-NG");
}

function saveCart() {
  localStorage.setItem("deeknox-cart", JSON.stringify(cart));
}

function renderProducts(list = products) {
  const container = document.getElementById("product-list");
  if (!container) return;
  if (list.length === 0) {
    container.textContent = "No matching products found.";
    return;
  }
  container.innerHTML = list.map(product => `
    <article class="product-card">
      <p class="eyebrow">${product.category}</p>
      <h3>${product.name}</h3>
      <p class="price">${money(product.price)}</p>
      <button class="button" onclick="addToCart(${product.id})">Add to cart</button>
    </article>
  `).join("");
}

function searchProducts() {
  const searchBox = document.getElementById("search");
  if (!searchBox) return;
  const query = searchBox.value.toLowerCase().trim();
  const matches = products.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  );
  renderProducts(matches);
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  saveCart();
  renderCart();
}

function changeQuantity(productId, amount) {
  const item = cart.find(product => product.id === productId);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(product => product.id !== productId);
  saveCart();
  renderCart();
}

function renderCart() {
  const itemsBox = document.getElementById("cart-items");
  const totalBox = document.getElementById("cart-total");
  const countBox = document.getElementById("cart-count");
  if (!itemsBox || !totalBox || !countBox) return;

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  countBox.textContent = count;
  totalBox.textContent = money(total);

  if (cart.length === 0) {
    itemsBox.innerHTML = '<p class="muted">Your cart is empty.</p>';
    return;
  }

  itemsBox.innerHTML = cart.map(item => `
    <div class="cart-row">
      <span>${item.name} × ${item.quantity}</span>
      <span>
        ${money(item.price * item.quantity)}
        <button onclick="changeQuantity(${item.id}, -1)" aria-label="Remove one">−</button>
        <button onclick="changeQuantity(${item.id}, 1)" aria-label="Add one">+</button>
      </span>
    </div>
  `).join("");
}

function demoCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty. Add a demo product first.");
    return;
  }
  alert("This is a demo checkout. No payment or real order has been made.");
}

function submitContact(event) {
  event.preventDefault();
  const result = document.getElementById("contact-result");
  if (result) result.textContent = "Your sample form passed browser validation. No message was sent.";
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
});
