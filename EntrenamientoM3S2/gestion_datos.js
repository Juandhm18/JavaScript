// 1) INITIAL PRODUCT OBJECT & VALIDATION
const productsObj = {
  1: { id: 1, name: "Cien años de soledad", price: 12 },
  2: { id: 2, name: "Caraval", price: 25 },
  3: { id: 3, name: "Hush Hush", price: 45 }
};

function validateProduct(p) {
  const validId   = typeof p.id === 'number' && p.id > 0;
  const validName = typeof p.name === 'string' && p.name.trim() !== '';
  const validPrice= typeof p.price === 'number' && p.price >= 0;

  if (!validId)    console.warn('Invalid ID:', p);
  if (!validName)  console.warn('Invalid name:', p);
  if (!validPrice) console.warn('Invalid price:', p);

  return validId && validName && validPrice;
}

// Filter out any bad entries
for (const key in productsObj) {
  if (!validateProduct(productsObj[key])) {
    delete productsObj[key];
  }
}

// 2) SET OF UNIQUE NAMES & MAP OF CATEGORIES
let uniqueNames = new Set(
  Object.values(productsObj).map(p => p.name)
);

let categoryMap = new Map([
  ["Novel", ["Cien años de soledad", "Hush Hush"]],
  ["Poetry", ["Caraval"]]
]);

// 3) SHOPPING CART ARRAY
const cart = [];

// 4) RENDER & LOG FUNCTIONS
const productsList = document.getElementById('products-list');
const cartList     = document.getElementById('cart-list');
const cartTotalEl  = document.getElementById('cart-total');

function logStructures() {
  console.group('📋 PRODUCTS OBJECT');
  for (const id in productsObj) {
    console.log(`ID ${id}:`, productsObj[id]);
  }
  console.groupEnd();

  console.group('🆔 UNIQUE NAMES (Set)');
  for (const name of uniqueNames) {
    console.log(name);
  }
  console.groupEnd();

  console.group('🏷️ CATEGORY MAP');
  categoryMap.forEach((names, category) => {
    console.log(`${category}: [${names.join(', ')}]`);
  });
  console.groupEnd();
}

function renderProducts() {
  productsList.innerHTML = '';
  Object.values(productsObj).forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <h4>${p.name}</h4>
      <p>$ ${p.price.toFixed(2)}</p>
      <button data-id="${p.id}">+ Cart</button>
    `;
    productsList.appendChild(card);
  });

  // Attach "add to cart" listeners
  productsList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => addToCart(+btn.dataset.id));
  });
}

function renderCart() {
  cartList.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name} (x${item.quantity})</span>
      <span>$ ${(item.price * item.quantity).toFixed(2)}</span>
      <button data-id="${item.id}">&times;</button>
    `;
    cartList.appendChild(li);
  });

  // Remove-item listeners
  cartList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(+btn.dataset.id));
  });

  // Update total
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  cartTotalEl.textContent = total.toFixed(2);
}

// 5) CART OPERATIONS
function addToCart(id) {
  const prod = productsObj[id];
  if (!prod) return;
  const existing = cart.find(x => x.id === id);
  if (existing) existing.quantity++;
  else cart.push({ ...prod, quantity: 1 });
  renderCart();
}

function removeFromCart(id) {
  const idx = cart.findIndex(x => x.id === id);
  if (idx > -1) cart.splice(idx, 1);
  renderCart();
}

document.getElementById('clear-cart')
  .addEventListener('click', () => {
    cart.length = 0;
    renderCart();
  });

// 6) ADD-PRODUCT FORM HANDLER
document.getElementById('add-form')
  .addEventListener('submit', e => {
    e.preventDefault();
    const id       = +document.getElementById('new-id').value;
    const name     = document.getElementById('new-name').value.trim();
    const price    = +document.getElementById('new-price').value;
    const category = document.getElementById('new-category').value.trim();

    const newProd = { id, name, price };
    if (!validateProduct(newProd)) return alert('Invalid data');
    if (productsObj[id]) return alert('ID already exists');

    // Update structures
    productsObj[id] = newProd;
    uniqueNames.add(name);

    if (categoryMap.has(category)) {
      categoryMap.get(category).push(name);
    } else {
      categoryMap.set(category, [name]);
    }

    // Reset form & rerender
    e.target.reset();
    renderProducts();
    logStructures();
  });

// 7) INITIAL RENDER & LOG
renderProducts();
renderCart();
logStructures();
