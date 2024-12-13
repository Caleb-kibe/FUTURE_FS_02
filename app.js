// JavaScript for cart and checkout functionality

const cart = [];

// Function to update cart count
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = cart.length;
}

// Function to add an item to the cart
function addToCart(item) {
    cart.push(item);
    updateCartCount();
    // alert(`${item.name} added to the cart!`);
}

// Function to display cart items in the modal
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <div>${item.name}</div>
            <div>$${item.price}</div>
            <button class="remove-item" data-index="${index}">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
        total += item.price;
    });

    cartTotalContainer.textContent = `Total: $${total}`;
}

// Function to handle removing items from the cart
function removeItemFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    displayCart();
}

// Event listeners for adding items to cart
const productCards = document.querySelectorAll('.img-card');
productCards.forEach(card => {
    card.querySelector('.cart-icon').addEventListener('click', () => {
        const name = card.querySelector('h1').textContent.trim();
        const price = parseFloat(card.querySelector('h1').textContent.trim().slice(1));
        const item = { name, price };
        addToCart(item);
    });
});

// Modal functionality
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.querySelector('.cart-icon');
const closeModal = document.querySelector('.close-modal');

cartIcon.addEventListener('click', () => {
    displayCart();
    cartModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', event => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Remove item from cart
cartModal.addEventListener('click', event => {
    if (event.target.classList.contains('remove-item')) {
        const index = event.target.getAttribute('data-index');
        removeItemFromCart(index);
    }
});

// Handle checkout button
const checkoutButton = document.getElementById('checkout-button');
const paymentSection = document.querySelector('.payment'); // Select payment section
const closePayment = document.querySelector('.payment .close'); // Close button for payment section

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    // alert(`Proceeding to payment. Total: $${total}`);

    // Show payment section
    paymentSection.style.display = 'flex';
    cartModal.style.display = 'none';
});

// Close payment section
closePayment.addEventListener('click', () => {
    paymentSection.style.display = 'none';
});

window.addEventListener('click', event => {
    if (event.target === paymentSection) {
        paymentSection.style.display = 'none';
    }
});

// Footer summary and links improvements
const ourStoryContent = `
    LuxeTile is your ultimate destination for premium floor tiles. With a focus on quality and design,
    we aim to transform your spaces into timeless masterpieces. Explore our diverse collections and 
    find the perfect fit for your home or office.`;

document.querySelector('footer #our-story').textContent = ourStoryContent;

// Footer navigation enhancements
const footerLinks = {
    'Installation Guide': '#installation-guide',
    FAQs: '#faqs',
    Support: '#support',
    'Contact Us': '#contact'
};

const footerNav = document.querySelector('footer .footer-nav');
Object.entries(footerLinks).forEach(([name, href]) => {
    const linkElement = document.createElement('a');
    linkElement.href = href;
    linkElement.textContent = name;
    footerNav.appendChild(linkElement);
});
