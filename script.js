// Global state
let cart = [];
let userCredits = 250;
let totalOrders = 0;
let orderHistory = [];

// All food items for search
const allFoodItems = [
    {name: 'Margherita Pizza', price: 299, type: 'veg'},
    {name: 'Veggie Burger', price: 149, type: 'veg'},
    {name: 'Veg Tacos', price: 199, type: 'veg'},
    {name: 'French Fries', price: 99, type: 'veg'},
    {name: 'Garden Salad', price: 179, type: 'veg'},
    {name: 'Paneer Sandwich', price: 129, type: 'veg'},
    {name: 'Fried Chicken', price: 249, type: 'non-veg'},
    {name: 'Chicken Burger', price: 189, type: 'non-veg'},
    {name: 'Pepperoni Pizza', price: 349, type: 'non-veg'},
    {name: 'Hot Dog', price: 119, type: 'non-veg'},
    {name: 'Chicken Tacos', price: 229, type: 'non-veg'},
    {name: 'BBQ Wings', price: 269, type: 'non-veg'},
    {name: 'Coca Cola', price: 49, type: 'drinks'},
    {name: 'Fresh Orange Juice', price: 79, type: 'drinks'},
    {name: 'Iced Coffee', price: 89, type: 'drinks'},
    {name: 'Mango Lassi', price: 69, type: 'drinks'},
    {name: 'Chocolate Cake', price: 129, type: 'desserts'},
    {name: 'Vanilla Ice Cream', price: 99, type: 'desserts'},
    {name: 'Glazed Donut', price: 59, type: 'desserts'},
    {name: 'Red Velvet Cupcake', price: 79, type: 'desserts'},
    {name: 'Choco Chip Cookies', price: 89, type: 'desserts'},
    {name: 'Caramel Pudding', price: 69, type: 'desserts'}
];

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show target page
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
    });
});

// Filter categories
function filterCategory(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide menu sections
    const sections = document.querySelectorAll('.menu-section');
    sections.forEach(section => {
        if (category === 'all') {
            section.classList.remove('hidden');
        } else {
            const sectionCategory = section.getAttribute('data-category');
            if (sectionCategory === category) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        }
    });
}

// Cart functions
function addToCart(name, price, type) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            type: type,
            quantity: 1
        });
    }
    
    updateCart();
    updateCartCount();
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="decreaseQuantity('${item.name}')">-</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="qty-btn" onclick="increaseQuantity('${item.name}')">+</button>
                </div>
            </div>
        `).join('');
    }
    
    updateCartTotal();
}

function increaseQuantity(name) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += 1;
        updateCart();
        updateCartCount();
    }
}

function decreaseQuantity(name) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity -= 1;
        if (item.quantity === 0) {
            cart = cart.filter(i => i.name !== name);
        }
        updateCart();
        updateCartCount();
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const creditsUsed = parseInt(document.getElementById('credits-use').value) || 0;
    const discount = Math.floor(creditsUsed / 10);
    const total = Math.max(0, subtotal - discount);
    
    document.getElementById('cart-subtotal').textContent = `₹${subtotal}`;
    document.getElementById('cart-discount').textContent = `-₹${discount}`;
    document.getElementById('cart-total').textContent = `₹${total}`;
}

function updateDiscount() {
    const creditsInput = document.getElementById('credits-use');
    const creditsUsed = parseInt(creditsInput.value) || 0;
    
    // Limit to available credits
    if (creditsUsed > userCredits) {
        creditsInput.value = userCredits;
    }
    
    updateCartTotal();
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
}

function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const creditsUsed = parseInt(document.getElementById('credits-use').value) || 0;
    const discount = Math.floor(creditsUsed / 10);
    const total = Math.max(0, subtotal - discount);
    
    // Create order
    const order = {
        id: `ORD${Date.now()}`,
        items: [...cart],
        subtotal: subtotal,
        discount: discount,
        total: total,
        creditsUsed: creditsUsed,
        date: new Date().toLocaleString()
    };
    
    // Add to order history
    orderHistory.unshift(order);
    
    // Update user credits
    userCredits -= creditsUsed;
    document.querySelector('.credits-value').textContent = userCredits;
    document.querySelector('.stat-value').textContent = userCredits;
    
    // Update total orders
    totalOrders += 1;
    document.querySelectorAll('.stat-value')[1].textContent = totalOrders;
    
    // Clear cart
    cart = [];
    updateCart();
    updateCartCount();
    document.getElementById('credits-use').value = 0;
    
    // Close cart
    toggleCart();
    
    // Update order history display
    updateOrderHistory();
    
    // Show success message
    alert(`Order placed successfully! 
Order ID: ${order.id}
Total: ₹${total}
Credits Used: ${creditsUsed}
Remaining Credits: ${userCredits}`);
}

function updateOrderHistory() {
    const orderHistoryContainer = document.getElementById('order-history');
    
    if (orderHistory.length === 0) {
        orderHistoryContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <p>No orders yet</p>
                <p class="empty-subtitle">Start ordering your favorite food!</p>
            </div>
        `;
    } else {
        orderHistoryContainer.innerHTML = orderHistory.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <span class="order-id">${order.id}</span>
                    <span class="order-date">${order.date}</span>
                </div>
                <div class="order-items-list">
                    ${order.items.map(item => `
                        <div class="order-list-item">
                            <span>${item.name} x ${item.quantity}</span>
                            <span>₹${item.price * item.quantity}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-total">Total: ₹${order.total}</div>
                    <div class="order-status">Delivered</div>
                </div>
            </div>
        `).join('');
    }
}

// Search functionality
function searchFood() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const searchResults = document.getElementById('search-results');
    
    if (searchTerm === '') {
        searchResults.innerHTML = '<p class="search-prompt">Type to search for your favorite food</p>';
        return;
    }
    
    const results = allFoodItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
    );
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <p>No results found for "${searchTerm}"</p>
            </div>
        `;
    } else {
        searchResults.innerHTML = `
            <div class="menu-grid">
                ${results.map(item => `
                    <div class="menu-item" data-type="${item.type}">
                        <div class="item-image">${getEmoji(item.name)}</div>
                        <h3 class="item-name">${item.name}</h3>
                        <p class="item-desc">${getDescription(item.name)}</p>
                        <div class="item-footer">
                            <span class="item-price">₹${item.price}</span>
                            <button class="add-btn" onclick="addToCart('${item.name}', ${item.price}, '${item.type}')">Add +</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function getEmoji(name) {
    const emojiMap = {
        'Margherita Pizza': '🍕',
        'Veggie Burger': '🍔',
        'Veg Tacos': '🌮',
        'French Fries': '🍟',
        'Garden Salad': '🥗',
        'Paneer Sandwich': '🥪',
        'Fried Chicken': '🍗',
        'Chicken Burger': '🍔',
        'Pepperoni Pizza': '🍕',
        'Hot Dog': '🌭',
        'Chicken Tacos': '🌮',
        'BBQ Wings': '🍖',
        'Coca Cola': '🥤',
        'Fresh Orange Juice': '🧃',
        'Iced Coffee': '☕',
        'Mango Lassi': '🥛',
        'Chocolate Cake': '🍰',
        'Vanilla Ice Cream': '🍦',
        'Glazed Donut': '🍩',
        'Red Velvet Cupcake': '🧁',
        'Choco Chip Cookies': '🍪',
        'Caramel Pudding': '🍮'
    };
    return emojiMap[name] || '🍽️';
}

function getDescription(name) {
    const descMap = {
        'Margherita Pizza': 'Classic tomato, mozzarella & basil',
        'Veggie Burger': 'Loaded with fresh vegetables',
        'Veg Tacos': '3 crispy tacos with beans & salsa',
        'French Fries': 'Crispy golden fries',
        'Garden Salad': 'Fresh greens with vinaigrette',
        'Paneer Sandwich': 'Grilled with mint chutney',
        'Fried Chicken': 'Crispy & juicy chicken pieces',
        'Chicken Burger': 'Grilled chicken patty deluxe',
        'Pepperoni Pizza': 'Loaded with pepperoni & cheese',
        'Hot Dog': 'Classic with mustard & ketchup',
        'Chicken Tacos': '3 tacos with spicy chicken',
        'BBQ Wings': '6 pieces with BBQ sauce',
        'Coca Cola': 'Chilled 500ml bottle',
        'Fresh Orange Juice': 'Freshly squeezed',
        'Iced Coffee': 'Cold brew perfection',
        'Mango Lassi': 'Creamy & sweet',
        'Chocolate Cake': 'Rich & moist slice',
        'Vanilla Ice Cream': '2 scoops premium',
        'Glazed Donut': 'Freshly made & glazed',
        'Red Velvet Cupcake': 'With cream cheese frosting',
        'Choco Chip Cookies': 'Pack of 4 cookies',
        'Caramel Pudding': 'Smooth & creamy'
    };
    return descMap[name] || 'Delicious food item';
}

// Login/Signup modal functions
function showLogin() {
    document.getElementById('login-modal').classList.add('active');
}

function closeLogin() {
    document.getElementById('login-modal').classList.remove('active');
}

function showSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Close modal when clicking outside
document.getElementById('login-modal').addEventListener('click', (e) => {
    if (e.target.id === 'login-modal') {
        closeLogin();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
    updateCartCount();
    updateOrderHistory();
});
