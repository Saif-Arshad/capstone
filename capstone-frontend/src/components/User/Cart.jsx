import { useEffect, useState } from "react";
import Layout from "../shared/Layout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Inline helper functions

const getCartItems = () => {
    const items = localStorage.getItem("cartItems");
    return items ? JSON.parse(items) : [];
};

const updateCartItemQuantity = (productId, newQuantity) => {
    const cartItems = getCartItems();
    const updatedCart = cartItems.map((item) => {
        if (item.productId === productId) {
            return {
                ...item,
                quantity: newQuantity,
                totalPrice: item.price * newQuantity
            };
        }
        return item;
    });
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
};

const removeFromCart = (productId) => {
    const cartItems = getCartItems();
    const updatedCart = cartItems.filter((item) => item.productId !== productId);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
};

function Cart() {
    // Cart is now an array of cart item objects
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    // Load cart items from localStorage on mount
    useEffect(() => {
        const items = getCartItems();
        setCart(items);
    }, []);

    // Handler for increasing the quantity of a cart item
    const handleIncrease = (productId) => {
        const updatedCart = cart.map((item) => {
            if (item.productId === productId) {
                const newQuantity = item.quantity + 1;
                updateCartItemQuantity(productId, newQuantity);
                return { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity };
            }
            return item;
        });
        setCart(updatedCart);
    };

    // Handler for decreasing the quantity of a cart item
    const handleDecrease = (productId) => {
        const updatedCart = cart
            .map((item) => {
                if (item.productId === productId) {
                    if (item.quantity > 1) {
                        const newQuantity = item.quantity - 1;
                        updateCartItemQuantity(productId, newQuantity);
                        return { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity };
                    }
                    // If quantity would drop below 1, remove the item
                    return null;
                }
                return item;
            })
            .filter(Boolean);
        setCart(updatedCart);
    };

    // Handler for removing an item from the cart
    const handleRemove = (productId) => {
        removeFromCart(productId);
        const updatedCart = cart.filter((item) => item.productId !== productId);
        setCart(updatedCart);
        toast.success("Item removed from cart");
    };

    // Calculate the overall total price
    const overallTotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    // Proceed to checkout - store the checkout data and navigate to checkout page
    const checkout = () => {
        localStorage.setItem("checkout", JSON.stringify({ cart, total: overallTotal }));
        navigate("/checkout");
    };

    // If the cart is empty, display an empty cart message
    if (cart.length === 0) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center p-8 bg-white rounded-lg shadow-md">
                        <svg
                            className="w-20 h-20 mx-auto text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            Your Cart is Empty
                        </h2>
                        <p className="text-gray-600">Add items to start shopping</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
                        Shopping Cart
                    </h1>
                    <div className="grid gap-6">
                        {cart.map((item) => (
                            <div
                                key={item.productId}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                    <div className="flex gap-6">
                                      
                                        <div className="space-y-2 text-start">
                                            <h2 className="text-2xl font-bold text-gray-800">
                                                {item.name}
                                            </h2>
                                            <p className="text-gray-500 font-medium">
                                                Unit Price:{" "}
                                                <span className="text-[#ff4d30] ml-2">${item.price}</span>
                                            </p>
                                            {item.selectedColor && (
                                                <p className="text-gray-500 font-medium">
                                                    Color:{" "}
                                                    <span className="text-[#ff4d30] ml-2">{item.selectedColor}</span>
                                                </p>
                                            )}
                                            {item.selectedSize && (
                                                <p className="text-gray-500 font-medium">
                                                    Size:{" "}
                                                    <span className="text-[#ff4d30] ml-2">{item.selectedSize}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="flex items-center bg-gray-50 rounded-lg p-2">
                                            <button
                                                onClick={() => handleDecrease(item.productId)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#ff4d30] transition-colors"
                                            >
                                                <span className="text-2xl">−</span>
                                            </button>
                                            <span className="w-12 text-center font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleIncrease(item.productId)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#ff4d30] transition-colors"
                                            >
                                                <span className="text-2xl">+</span>
                                            </button>
                                        </div>
                                        <p className="text-xl font-bold text-gray-800">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => handleRemove(item.productId)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Total: ${overallTotal.toFixed(2)}
                        </h2>
                        <button
                            onClick={checkout}
                            className="mt-6 cursor-pointer md:mt-0 px-6 py-3 bg-[#ff4d30] text-white font-semibold rounded-lg hover:bg-[#ff4c30d6] transition"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Cart;
