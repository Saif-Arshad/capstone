export const addToCart = (productId, quantity = 1) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    
    if (cart[productId]) {
        cart[productId] += quantity;
    } else {
        cart[productId] = quantity;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Function to get all cart items
export const getCartItems = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    return cart;
};

// Function to update item quantity in cart
export const updateCartItemQuantity = (productId, quantity) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    
    if (quantity > 0) {
        cart[productId] = quantity;
    } else {
        delete cart[productId];
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const removeFromCart = (productId) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    delete cart[productId];
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const clearCart = () => {
    localStorage.removeItem('cart');
};

// Function to get total number of items in cart
export const getCartItemsCount = () => {
    const cart = getCartItems();
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
};