document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderSummaryBody = document.getElementById('orderSummaryBody');
    const checkoutSubtotalElement = document.getElementById('checkoutSubtotal');
    const checkoutTotalElement = document.getElementById('checkoutTotal');
    const placeOrderBtn = document.getElementById('placeOrderBtn');

    function renderOrderSummary() {
        orderSummaryBody.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            orderSummaryBody.innerHTML = '<tr><td colspan="2" class="text-center">Your cart is empty.</td></tr>';
            placeOrderBtn.disabled = true;
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name} <strong class="mx-2">x</strong> ${item.quantity}</td>
                    <td>Ksh${itemTotal.toFixed(2)}</td>
                `;
                orderSummaryBody.appendChild(row);
            });
            placeOrderBtn.disabled = false;
        }

        checkoutSubtotalElement.textContent = `Ksh${subtotal.toFixed(2)}`;
        checkoutTotalElement.textContent = `Ksh${subtotal.toFixed(2)}`; // Assuming total is same as subtotal for now
    }

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Here you would typically send the order to a backend server
            // For this example, we'll just clear the cart and redirect
            alert('Order Placed Successfully!');
            localStorage.removeItem('cart');
            window.location.href = 'thankyou.html';
        });
    }

    renderOrderSummary();
});