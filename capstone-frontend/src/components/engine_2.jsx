import { useEffect, useRef, useState } from "react";
import "@google/model-viewer";
import { carsData } from "./shared/ProductData";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function Detail({ id }) {
    const modelRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    // Pick which car you want to show.
    // You can later make this dynamic via props or user selection.
    const currentCar = carsData.filter((item) => item.id == id)[0];


    // De-structure your data for convenience
    const { title, modelSrc, basePrice, description, parts } = currentCar;

    // Calculate the total price
    const totalPrice = (quantity * basePrice).toFixed(1);

    // Model setup: color controls, scene-graph, etc.
    const navigate = useNavigate();
    useEffect(() => {
        const modelViewer = modelRef.current;
        const colorControls = document.getElementById("color-controls");

        if (!modelViewer || !colorControls) return;

        function handleModelLoad() {
            setLoading(false);
            // Optionally set a default color (black) for all materials
            const defaultColor = [0, 0, 0, 1];
            modelViewer.model.materials.forEach((material) => {
                if (material.pbrMetallicRoughness) {
                    material.pbrMetallicRoughness.setBaseColorFactor(defaultColor);
                }
            });
        }

        function handleColorClick(event) {
            const colorString = event.target.dataset.color;
            if (!colorString) return;

            const newColor = hexToRgba(colorString);
            modelViewer.model.materials.forEach((material) => {
                if (material.pbrMetallicRoughness) {
                    material.pbrMetallicRoughness.setBaseColorFactor(newColor);
                }
            });
        }

        // Convert hex color to RGBA
        function hexToRgba(hex) {
            const bigint = parseInt(hex.replace("#", ""), 16);
            return [
                ((bigint >> 16) & 255) / 255,
                ((bigint >> 8) & 255) / 255,
                (bigint & 255) / 255,
                1.0,
            ];
        }

        modelViewer.addEventListener("scene-graph-ready", handleModelLoad);
        colorControls.addEventListener("click", handleColorClick);

        return () => {
            modelViewer.removeEventListener("scene-graph-ready", handleModelLoad);
            colorControls.removeEventListener("click", handleColorClick);
        };
    }, []);

    // Handlers for quantity
    const handleDecrement = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            setQuantity(newQuantity);
        }
    };
    const checkout = () => {
        const checkoutObj = {
            items: [
                {
                    productId: id,
                    name: title,
                    category: "Car",
                    price: basePrice,
                    totalPrice: totalPrice,
                    quantity: quantity,
                },
            ],
            total: totalPrice,
        };
        localStorage.setItem("checkout", JSON.stringify(checkoutObj));
        navigate("/checkout");
    };

    return (
        <div className="mb-20 p-6 pt-36 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side: 3D Model Viewer */}
            <div className="w-full flex justify-start relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 text-gray-800">
                        Loading 3D Model...
                    </div>
                )}

                <model-viewer
                    ref={modelRef}
                    id="suspensionViewer"
                    src={modelSrc} // dynamically use the modelSrc
                    camera-controls
                    touch-action="pan-y"
                    auto-rotate
                    interaction-prompt="none"
                    ar
                    alt="3D Model"
                    style={{ width: "100%", height: "100%" }}
                />
            </div>

            {/* Right Side: Product Info */}
            <div className="w-full flex flex-col">
                {/* Title */}
                <h1 className="text-3xl lg:text-5xl text-start font-bold text-gray-800 mb-3">
                    {title}
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-10 text-start">
                    {description}
                </p>

                {/* Parts List */}
                <div className="mb-6 flex flex-col text-start">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Key Parts:</h2>
                    <ul className="list-disc ml-6 space-y-1 text-gray-600">
                        {parts.map((part, idx) => (
                            <li key={idx}>{part}</li>
                        ))}
                    </ul>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between py-7">
                    <p className="text-lg font-semibold text-gray-800">Quantity:</p>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleDecrement}
                            className="px-3 bg-[#ff4d30] text-white flex items-center justify-center text-2xl cursor-pointer rounded-md shadow hover:bg-[#ff4c30d6] transition"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            className="w-16 text-center border border-dashed rounded-md"
                        />
                        <button
                            onClick={handleIncrement}
                            className="px-3 bg-[#ff4d30] text-white flex items-center justify-center text-2xl cursor-pointer rounded-md shadow hover:bg-[#ff4c30d6] transition"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Price Display */}
                <p className="text-2xl text-end font-bold text-gray-800 mt-6">
                    Price: {totalPrice} AED
                </p>
                <div className="grid grid-cols-2 gap-4 ">

                    <button 
                        onClick={checkout}
                    
                    className="mt-10 px-6 py-3 bg-[#ff4d30] text-white font-semibold rounded-lg hover:bg-[#ff4c30d6] cursor-pointer transition">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}
