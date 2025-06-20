// cart.js

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  // Check if product already exists in cart
  const existingProductIndex = cart.findIndex(item => item.id === product.id);

  if (existingProductIndex > -1) {
    // If product exists, increment quantity
    cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
  } else {
    // If product is new, add with quantity 1
    product.quantity = 1;
    cart.push(product);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  console.log('Product added to cart:', product);
}


document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('cart.html')) {
    renderCart();
    setupCartEventListeners();
  }
});

function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsBody = document.getElementById('cartItemsBody');
  const cartSubtotalElement = document.getElementById('cartSubtotal');
  const cartTotalElement = document.getElementById('cartTotal');

  if (!cartItemsBody) return; // Exit if not on the cart page

  cartItemsBody.innerHTML = ''; // Clear existing items
  let subtotal = 0;

  if (cart.length === 0) {
    cartItemsBody.innerHTML = '<tr><td colspan="6" class="text-center">Your cart is empty.</td></tr>';
  } else {
    cart.forEach(item => {
      const row = document.createElement('tr');
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      row.innerHTML = `
        <td class="product-thumbnail">
          <img src="${item.imageUrl}" alt="Image" class="img-fluid">
        </td>
        <td class="product-name">
          <h2 class="h5 text-black">${item.name}</h2>
        </td>
        <td>Ksh${item.price.toFixed(2)}</td>
        <td>
          <div class="input-group mb-3 d-flex align-items-center quantity-container" style="max-width: 120px;">
            <div class="input-group-prepend">
              <button class="btn btn-outline-black decrease" type="button" data-id="${item.id}">&mdash;</button>
            </div>
            <input type="text" class="form-control text-center quantity-amount" value="${item.quantity}" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1" data-id="${item.id}">
            <div class="input-group-append">
              <button class="btn btn-outline-black increase" type="button" data-id="${item.id}">&plus;</button>
            </div>
          </div>
        </td>
        <td>Ksh${itemTotal.toFixed(2)}</td>
        <td><a href="#" class="btn btn-black btn-sm remove-item" data-id="${item.id}">X</a></td>
      `;
      cartItemsBody.appendChild(row);
    });
  }

  if (cartSubtotalElement) cartSubtotalElement.textContent = `Ksh${subtotal.toFixed(2)}`;
  if (cartTotalElement) cartTotalElement.textContent = `Ksh${subtotal.toFixed(2)}`; // Assuming no tax/shipping for now
}

function setupCartEventListeners() {
  document.getElementById('cartItemsBody').addEventListener('click', (event) => {
    const target = event.target;
    const productId = target.dataset.id;

    if (target.classList.contains('remove-item')) {
      event.preventDefault();
      removeFromCart(productId);
    } else if (target.classList.contains('increase')) {
      updateQuantity(productId, 1);
    } else if (target.classList.contains('decrease')) {
      updateQuantity(productId, -1);
    }
  });

  document.getElementById('cartItemsBody').addEventListener('change', (event) => {
    const target = event.target;
    if (target.classList.contains('quantity-amount')) {
      const productId = target.dataset.id;
      const newQuantity = parseInt(target.value, 10);
      if (!isNaN(newQuantity) && newQuantity >= 0) {
        updateQuantity(productId, newQuantity - getProductQuantity(productId));
      } else {
        // Revert to previous valid quantity if input is invalid
        target.value = getProductQuantity(productId);
      }
    }
  });
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function updateQuantity(productId, change) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const productIndex = cart.findIndex(item => item.id === productId);

  if (productIndex > -1) {
    cart[productIndex].quantity = (cart[productIndex].quantity || 1) + change;
    if (cart[productIndex].quantity <= 0) {
      removeFromCart(productId);
    } else {
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }
  }
}

function getProductQuantity(productId) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const product = cart.find(item => item.id === productId);
  return product ? product.quantity : 0;
}