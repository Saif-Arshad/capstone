import { useState } from 'react';
import 'animate.css';

const products = [
    {
        id: 1,
        name: "Nissan 370z",
        description: "Customize your Nissan 370z with various color and wheel combinations.",
        price: 200,
        variants: {
            colors: [
                {
                    name: "Black",
                    wheels: [
                        { name: "Black", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/black/black-wheel/${i + 1}.png`) },
                        { name: "Bronze", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/black/bronze-whel/${i + 1}.png`) },
                        { name: "Gunmetal", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/black/gun-wheel/${i + 1}.png`) },
                    ],
                },
                {
                    name: "Brown",
                    wheels: [
                        { name: "Black", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/brown/black-wheel/${i + 1}.png`) },
                        { name: "Bronze", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/brown/bronze-wheel/${i + 1}.png`) },
                    ],
                },
                {
                    name: "White",
                    wheels: [
                        { name: "Black", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/white/black-wheel/${i + 1}.png`) },
                        { name: "Bronze", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/white/bronze-wheel/${i + 1}.png`) },
                        { name: "Gray", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/white/gray-wheel/${i + 1}.png`) },
                    ],
                },
            ],
        },
    },
    {
        id: 2,
        name: "Subaru 370z",
        description: "Customize your Subaru 370z with various color and wheel combinations.",
        price: 200,
        variants: {
            colors: [
                {
                    name: "Blue",
                    wheels: [
                        { name: "Black", images: Array.from({ length: 12 }, (_, i) => `/Subaru/blue/black-wheel/${i + 1}.png`) },
                        { name: "Bronze", images: Array.from({ length: 9 }, (_, i) => `/Subaru/blue/broze-wheel/${i + 1}.png`) },
                        { name: "Gray", images: Array.from({ length: 11 }, (_, i) => `/Subaru/blue/gray/${i + 1}.png`) },
                    ],
                },
                // {
                //     name: "Green",
                //     wheels: [
                //         { name: "Black", images: Array.from({ length: 12 }, (_, i) => `/subaru/wing/green/${i + 1}.png`) },
                //         { name: "Gray", images: Array.from({ length: 12 }, (_, i) => `/Subaru/wing/green/gray-wheel/${i + 1}.png`) },
                //     ],
                // },
            ],
        },
    },
];

export default function Vehicle() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedWheel, setSelectedWheel] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleSelectProduct = (product) => {
        const firstColor = product.variants.colors[0];
        setSelectedProduct(product);
        setSelectedColor(firstColor);
        setSelectedWheel(firstColor.wheels[0]);
        setCurrentImageIndex(0);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? selectedWheel.images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === selectedWheel.images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="pt-36 flex items-center justify-center flex-col px-4 sm:px-10 bg-white min-h-screen">
            {!selectedProduct ? (
                <div className="max-w-7xl mx-auto w-full">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        {products.map((prod) => (
                            <div
                                key={prod.id}
                                onClick={() => handleSelectProduct(prod)}
                                className="relative overflow-hidden bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg hover:border-[#ff4d30] transition-all duration-300 cursor-pointer group animate__animated animate__zoomIn"
                            >
                                <div className="relative">
                                    <img
                                        src={prod.variants.colors[0].wheels[0].images[0]}
                                        alt={prod.name}
                                        className="w-full h-80 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg"></div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto animate__animated animate__fadeIn">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-md p-6 hover:shadow-lg transition-all duration-300">
                            <div className="relative flex justify-center items-center">
                                <img
                                    src={selectedWheel.images[currentImageIndex]}
                                    alt={`${selectedProduct.name} - ${selectedColor.name} - ${selectedWheel.name}`}
                                    className="max-w-full h-[400px] w-[800px] rounded-md object-cover cursor-pointer"
                                />
                                <div className="absolute top-1/2 transform -translate-y-1/2 w-full px-4 flex justify-between">
                                    <button
                                        onClick={prevImage}
                                        className="text-white cursor-pointer bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M15 18l-6-6 6-6" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="text-white cursor-pointer bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <h2 className="text-4xl text-start mt-4 font-semibold text-gray-900 mb-4">{selectedProduct.name}</h2>
                            <p className="text-gray-600 text-start mb-6 text-lg">{selectedProduct.description}</p>
                            <h3 className="text-lg text-start font-medium mt-6 mb-4 ">Select Color</h3>
                            <div className="flex justify-start space-x-4 mb-6">
                                {selectedProduct.variants.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => {
                                            setSelectedColor(color);
                                            setSelectedWheel(color.wheels[0]);
                                            setCurrentImageIndex(0);
                                        }}
                                        className={`px-6 py-3 rounded-lg border-2 font-medium transition-all duration-300 hover:scale-105 ${selectedColor.name === color.name ? 'bg-[#ff4d30] text-white border-[#ff4d30] shadow-md' : 'bg-white text-gray-900 border-gray-300 hover:border-[#ff4d30]'}`}
                                    >
                                        {color.name}
                                    </button>
                                ))}
                            </div>
                            <h3 className="text-lg font-medium my-4 text-start">Select Wheel Type</h3>
                            <div className="flex justify-start space-x-4">
                                {selectedColor.wheels.map((wheel) => (
                                    <button
                                        key={wheel.name}
                                        onClick={() => {
                                            setSelectedWheel(wheel);
                                            setCurrentImageIndex(0);
                                        }}
                                        className={`px-6 py-3 rounded-lg border-2 font-medium transition-all duration-300 hover:scale-105 ${selectedWheel.name === wheel.name ? 'bg-[#ff4d30] text-white border-[#ff4d30] shadow-md' : 'bg-white text-gray-900 border-gray-300 hover:border-[#ff4d30]'}`}
                                    >
                                        Wheel: {wheel.name}
                                    </button>
                                ))}
                            </div>
                        </div>


                    </div>
                </div>
            )}
        </div>
    );
}