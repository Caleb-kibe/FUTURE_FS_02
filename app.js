/* script.js */
// Sample product data
const products = [
    {
        id: 1,
        name: "Modern Gray Porcelain",
        price: 49.99,
        image: "/api/placeholder/400/400",
        material: "porcelain",
        size: "large",
        color: "gray"
    },
    {
        id: 2,
        name: "Classic Beige Ceramic",
        price: 39.99,
        image: "/api/placeholder/400/400",
        material: "ceramic",
        size: "medium",
        color: "beige"
    },
    {
        id: 3,
        name: "Natural Stone Brown",
        price: 69.99,
        image: "/api/placeholder/400/400",
        material: "natural-stone",
        size: "small",
        color: "brown"
    }
];

let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    setupEventListeners();
    handleResponsiveLayout();
    initializeAnimations();
});

// Display products
function displayProducts(productsToDisplay) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        grid.appendChild(productCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Filter event listeners
    document.getElementById('material-filter').addEventListener('change', applyFilters);
    document.getElementById('size-filter').addEventListener('change', applyFilters);
    document.getElementById('color-filter').addEventListener('change', applyFilters);

    // Cart modal
    const modal = document.getElementById('cart-modal');
    const cartIcon = document.querySelector('.cart-icon');
    const closeModal = document.querySelector('.close-modal');

    cartIcon.addEventListener('click', () => {
        updateCartModal();
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {modal.style.display = 'none';
        }
    });

    // Add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
    });

    // Checkout button
    document.getElementById('checkout-button').addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Proceeding to checkout...');
            // Add checkout logic here
        } else {
            alert('Your cart is empty!');
        }
    });

    // Mobile menu setup
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu-button';
    mobileMenu.innerHTML = '☰';
    mobileMenu.style.display = 'none';
    document.querySelector('.header-content').appendChild(mobileMenu);

    mobileMenu.addEventListener('click', () => {
        const nav = document.querySelector('.nav-menu');
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });

    // Window resize listener
    window.addEventListener('resize', handleResponsiveLayout);
}

// Filter products
function applyFilters() {
    const materialFilter = document.getElementById('material-filter').value;
    const sizeFilter = document.getElementById('size-filter').value;
    const colorFilter = document.getElementById('color-filter').value;

    let filteredProducts = products.filter(product => {
        const matchesMaterial = !materialFilter || product.material === materialFilter;
        const matchesSize = !sizeFilter || product.size === sizeFilter;
        const matchesColor = !colorFilter || product.color === colorFilter;
        return matchesMaterial && matchesSize && matchesColor;
    });

    displayProducts(filteredProducts);
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1,
            price: product.price,
            name: product.name
        });
    }

    updateCartCount();
    showAddedToCartNotification(product.name);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.innerHTML = '';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>Total: $${itemTotal.toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateItemQuantity(${item.productId}, ${item.quantity + 1})">+</button>
                <button onclick="updateItemQuantity(${item.productId}, ${item.quantity - 1})">-</button>
                <button onclick="removeFromCart(${item.productId})">Remove</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });

    cartTotal.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
}

function updateItemQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartCount();
        updateCartModal();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCartCount();
    updateCartModal();
}

function showAddedToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `${productName} added to cart`;
    
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--accent-color)';
    notification.style.color = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '5px';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Responsive layout handler
function handleResponsiveLayout() {
    const nav = document.querySelector('.nav-menu');
    const mobileButton = document.querySelector('.mobile-menu-button');
    
    if (window.innerWidth <= 768) {
        nav.style.display = 'none';
        mobileButton.style.display = 'block';
    } else {
        nav.style.display = 'flex';
        mobileButton.style.display = 'none';
    }
}

// Initialize animations
function initializeAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        card.style.transitionDelay = `${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
}