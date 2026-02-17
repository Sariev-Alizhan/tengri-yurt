// Cart state
let cart = [];

// DOM Elements
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const floatingCart = document.getElementById('floatingCart');
const cartBody = document.getElementById('cartBody');
const cartBadge = document.getElementById('cartBadge');
const cartTotal = document.getElementById('cartTotal');
const cartSubmit = document.getElementById('cartSubmit');
const cartClear = document.getElementById('cartClear');

// Toggle cart
cartToggle?.addEventListener('click', () => {
    floatingCart.classList.add('active');
    document.body.style.overflow = 'hidden';
});

cartClose?.addEventListener('click', () => {
    floatingCart.classList.remove('active');
    document.body.style.overflow = '';
});

// Close cart on overlay click
floatingCart?.addEventListener('click', (e) => {
    if (e.target === floatingCart) {
        floatingCart.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Add to cart
document.querySelectorAll('.yurt-add-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const item = {
            id: this.dataset.id,
            name: this.dataset.name,
            diameter: this.dataset.diameter,
            capacity: this.dataset.capacity,
            image: this.dataset.image,
            uniqueId: Date.now()
        };
        
        cart.push(item);
        updateCart();
        
        // Visual feedback
        const originalText = this.textContent;
        this.textContent = 'Added!';
        this.classList.add('added');
        
        setTimeout(() => {
            this.textContent = originalText;
            this.classList.remove('added');
        }, 1000);
        
        // Auto-open cart
        floatingCart.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Update cart display
function updateCart() {
    cartBadge.textContent = cart.length;
    cartTotal.textContent = cart.length;
    
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <p class="cart-empty-text">No items yet</p>
                <p class="cart-empty-hint">Add yurts to get started</p>
            </div>
        `;
        return;
    }
    
    cartBody.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="Images/picture/${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-specs">Ø ${item.diameter} • ${item.capacity} people</p>
            </div>
            <button class="cart-item-remove" onclick="removeItem(${item.uniqueId})">&times;</button>
        </div>
    `).join('');
}

// Remove item
function removeItem(uniqueId) {
    cart = cart.filter(item => item.uniqueId !== uniqueId);
    updateCart();
}

// Clear cart
cartClear?.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    if (confirm('Remove all items from your selection?')) {
        cart = [];
        updateCart();
    }
});

// Submit inquiry
cartSubmit?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Please add at least one yurt to your selection');
        return;
    }
    
    const itemsList = cart.map(item => 
        `• ${item.name} (Ø ${item.diameter}) - ${item.capacity} people`
    ).join('\n');
    
    alert(`Thank you for your interest!\n\nYour selection:\n${itemsList}\n\nWe will contact you shortly to discuss:\n• Customization options\n• Premium materials\n• Global delivery & installation\n• Pricing & timeline`);
    
    // Clear cart after submission
    cart = [];
    updateCart();
    floatingCart.classList.remove('active');
    document.body.style.overflow = '';
});

// Close cart on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && floatingCart.classList.contains('active')) {
        floatingCart.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Initialize
updateCart();
