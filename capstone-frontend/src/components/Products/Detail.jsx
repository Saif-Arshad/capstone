import  { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BsBasket } from "react-icons/bs";
import { ChevronRight, Money } from "@mui/icons-material";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

function ProductMainDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const fetchProducts = async (id) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/garage/products/${id}`
            );
            if (!res.ok) {
                throw new Error("Failed to fetch products");
            }
            const { data } = await res.json();
            setProduct(data);
            if (data.images && data.images.length > 0) {
                setSelectedImage(data.images[0].url);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Error fetching product");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(id);
    }, [id]);

    // Calculate total price
    const totalPrice = product ? product.price * quantity : 0;

    // Handlers for quantity
    const handleIncrement = () => setQuantity((prev) => prev + 1);
    const handleDecrement = () =>
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
        }
    };

    // Add to cart logic
    const handleAddToCart = () => {
        const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        const existingItemIndex = existingCart.findIndex(
            (item) => item.productId === product.id
        );

        if (existingItemIndex !== -1) {
            existingCart[existingItemIndex].quantity += quantity;
            existingCart[existingItemIndex].totalPrice =
                existingCart[existingItemIndex].price *
                existingCart[existingItemIndex].quantity;
        } else {
            const cartItem = {
                productId: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                totalPrice,
                quantity,
                selectedColor,
                selectedSize,
            };
            existingCart.push(cartItem);
        }
        localStorage.setItem("cartItems", JSON.stringify(existingCart));
        toast.success("Product added to cart");
    };

    // Checkout logic
    const checkout = () => {
        const checkoutObj = {
            items: [
                {
                    productId: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    totalPrice,
                    quantity,
                    selectedColor,
                    selectedSize,
                },
            ],
            total: totalPrice,
        };
        localStorage.setItem("checkout", JSON.stringify(checkoutObj));
        navigate("/checkout");
    };

    // MUI Modal styling
    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(90%, 800px)",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 3,
        overflow: "auto",
        maxHeight: "80vh",
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-xl font-semibold text-gray-700">Loading...</div>
            </div>
        );
    }
    if (!product) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-xl font-semibold text-gray-700">No product found</div>
            </div>
        );
    }

    return (
        <div className="mx-auto pt-28 p-6">
            {/* Product Card */}
            <div className="bg-white rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Images */}
                    <div className="space-y-4">
                        <div className="aspect-square w-full">
                            <img
                                src={selectedImage || (product.images && product.images[0]?.url)}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                        {product.images && product.images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto py-2">
                                {product.images.map((image) => (
                                    <img
                                        key={image.id}
                                        src={image.url}
                                        alt={product.name}
                                        className={`w-20 h-20 object-cover rounded-md cursor-pointer transition border ${selectedImage === image.url
                                                ? "border-blue-500"
                                                : "border-transparent"
                                            }`}
                                        onClick={() => setSelectedImage(image.url)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Product Details */}
                    <div className="space-y-6">
                        <div className="mb-5">
                            <h1 className="text-3xl capitalize text-start font-bold text-gray-900">
                                {product.name}
                            </h1>
                            <div className="flex py-2 mb-4 gap-2">
                                <span className="bg-[#ff4d30] p-2 rounded-full text-xs px-4 text-white">
                                    {product.price} AED
                                </span>
                                <span className="bg-[#ff4d30] p-2 capitalize rounded-full text-xs px-4 text-white">
                                    {product.category}
                                </span>
                            </div>
                            <p className="text-gray-700 my-5 text-start">
                                {product.description}
                            </p>
                            <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-4 rounded-lg border border-orange-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-500">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                        <span className="font-medium text-orange-700">
                                            Only {product.quantity} pieces left!
                                        </span>
                                    </div>
                                    <span className="text-sm text-orange-800 animate-pulse">
                                        Order Now
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Colors Section */}
                        {product.availableColor && product.availableColor.length > 0 && (
                            <div className="flex flex-col items-start">
                                <label className="my-2 font-medium" htmlFor="color">
                                    Select Color
                                </label>
                                <div className="flex gap-2">
                                    {product.availableColor.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-4 capitalize cursor-pointer py-2 border rounded-md ${selectedColor === color
                                                    ? "bg-gradient-to-r from-orange-100 to-orange-50 text-black border-orange-500"
                                                    : "bg-gray-50 text-gray-700"
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes Section */}
                        {product.availableSizes && product.availableSizes.length > 0 && (
                            <div className="flex flex-col items-start mt-4">
                                <label className="my-2 font-medium" htmlFor="size">
                                    Select Size
                                </label>
                                <div className="flex gap-2">
                                    {product.availableSizes.map((size, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 cursor-pointer capitalize py-2 border rounded-md ${selectedSize === size
                                                    ? "bg-gradient-to-r from-orange-100 to-orange-50 text-black border-orange-500"
                                                    : "bg-gray-50 text-gray-700"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Price */}
                        <div className="space-y-4 pt-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between py-7">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleDecrement}
                                        className="bg-[#ff4d30] h-10 w-10 cursor-pointer flex items-center justify-center text-white text-2xl rounded-full shadow hover:bg-[#ff4c30d6] transition"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        min="1"
                                        className="w-16 text-center border border-dashed rounded-md py-2"
                                    />
                                    <button
                                        onClick={handleIncrement}
                                        className="bg-[#ff4d30] h-10 w-10 cursor-pointer flex items-center justify-center text-white text-2xl rounded-full shadow hover:bg-[#ff4c30d6] transition"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">
                                    Price: {totalPrice} AED
                                </p>
                            </div>

                            {/* 3D View Button (MUI Button) */}
                            {product.EmbedLink && (
                                <div className="flex items-center justify-end my-8">
                                    <button
                                        onClick={() => setIsModalOpen(true)}

                                        className="px-6 flex items-center justify-center gap-2 cursor-pointer py-3 bg-[#ff4d30] text-white font-semibold rounded-lg hover:bg-[#ff4c30d6] transition"
                                    >
                                
                                        View in 3D
                                        <ChevronRight size={22} />
                                    </button>
                                </div>
                            )}

                            {/* Add to Cart / Buy Now */}
                            <div className="grid grid-cols-2 gap-4 pt-8">
                                <button
                                    onClick={handleAddToCart}
                                    className="px-6 flex items-center justify-center gap-2 cursor-pointer py-3 bg-[#ff4d30] text-white font-semibold rounded-lg hover:bg-[#ff4c30d6] transition"
                                >
                                    <BsBasket size={22} /> Add to Cart
                                </button>
                                <button
                                    onClick={checkout}
                                    className="px-6 flex items-center justify-center gap-2 cursor-pointer py-3 bg-[#ff4d30] text-white font-semibold rounded-lg hover:bg-[#ff4c30d6] transition"
                                >
                                    <Money size={22} /> Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MUI Modal */}
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Button
                        variant="text"
                        onClick={() => setIsModalOpen(false)}
                        sx={{ position: "absolute", top: 10, right: 10 }}
                    >
                        &#x2715;
                    </Button>
                    <div dangerouslySetInnerHTML={{ __html: product.EmbedLink }} />
                </Box>
            </Modal>
        </div>
    );
}

export default ProductMainDetail;
