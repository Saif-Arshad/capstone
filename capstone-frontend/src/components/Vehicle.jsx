import { useState } from 'react';
import 'animate.css';
// import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const products = [
    {
        id: 1,
        name: "Nissan 3070z Fender",
        description: "High-quality fender designed for the Nissan 3070z, offering superior fitment and style.",
        price: 200,
        variants: {
            type: "colors",
            options: [
                { name: "Black", images: Array.from({ length: 12 }, (_, i) => `/nissan/fender/black/${i + 1}.png`) },
                { name: "Brown", images: Array.from({ length: 12 }, (_, i) => `/nissan/fender/brown/${i + 1}.png`) },
                { name: "White", images: Array.from({ length: 12 }, (_, i) => `/nissan/fender/white/${i + 1}.png`) },
            ],
        },
    },
    {
        id: 4,
        name: "Nissan 3070z TE3 Brown",
        description: "Stylish TE3 Brown wheel set for the Nissan 3070z, perfect for a custom look.",
        price: 200,
        variants: {
            type: "wheels",
            options: [
                { name: "Black", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/brown/black-wheel/${i + 1}.png`) },
                { name: "Bronze", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/brown/bronze-wheel/${i + 1}.png`) },
            ],
        },
    },
    {
        id: 2,
        name: "Nissan 3070z Nismo",
        description: "Performance-tuned Nismo fender for the Nissan 3070z, blending aesthetics and durability.",
        price: 200,
        variants: {
            type: "wheels",
            options: [
                { name: "Black", images: Array.from({ length: 12 }, (_, i) => `/nissan/nismo/black/${i + 1}.png`) },
                { name: "Brown", images: Array.from({ length: 12 }, (_, i) => `/nissan/nismo/brown/${i + 1}.png`) },
                { name: "White", images: Array.from({ length: 12 }, (_, i) => `/nissan/nismo/white/${i + 1}.png`) },
            ],
        },
    },
    {
        id: 6,
        name: "Subaru 3070z Blue",
        description: "Durable Blue wheel set for the Subaru 3070z, designed for a bold appearance.",
        price: 200,
        variants: {
            type: "wheels",
            options: [
                { name: "Black", images: Array.from({ length: 12 }, (_, i) => `/Subaru/blue/black-wheel/${i + 1}.png`) },
                { name: "Bronze", images: Array.from({ length: 9 }, (_, i) => `/Subaru/blue/broze-wheel/${i + 1}.png`) },
                { name: "Gray", images: Array.from({ length: 11 }, (_, i) => `/Subaru/blue/gray/${i + 1}.png`) },
            ],
        },
    },
    {
        id: 3,
        name: "Nissan 3070z TE3 Black",
        description: "Sleek TE3 Black wheel set for the Nissan 3070z, engineered for performance and elegance.",
        price: 200,
        variants: {
            type: "wheels",
            options: [
                { name: "Black", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/black/black-wheel/${i + 1}.png`) },
                { name: "Bronze", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/black/bronze-whel/${i + 1}.png`) },
                { name: "Gunmetal", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/black/gun-wheel/${i + 1}.png`) },
            ],
        },
    },

    {
        id: 5,
        name: "Nissan 3070z TE3 White",
        description: "Elegant TE3 White wheel set for the Nissan 3070z, combining form and function.",
        price: 200,
        variants: {
            type: "wheels",
            options: [
                { name: "Black", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/white/black-wheel/${i + 1}.png`) },
                { name: "Bronze", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/white/bronze-wheel/${i + 1}.png`) },
                { name: "Grau", images: Array.from({ length: 12 }, (_, i) => `/nissan/te3/white/gray-wheel/${i + 1}.png`) },
            ],
        },
    },

    {
        id: 7,
        name: "Subaru 3070z Wing",
        description: "Aerodynamic wing for the Subaru 3070z, enhancing both style and performance.",
        price: 200,
        variants: {
            type: "colors",
            options: [
                { name: "Blue", images: Array.from({ length: 12 }, (_, i) => `/Subaru/wing/blue/${i + 1}.png`) },
                { name: "Green", images: Array.from({ length: 12 }, (_, i) => `/Subaru/wing/green/${i + 1}.png`) },
            ],
        },
    },
];

export default function Vehicle() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setSelectedVariant(product.variants.options[0]);
    };


    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? selectedVariant.images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === selectedVariant.images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="pt-36 flex items-center justify-center flex-col px-4 sm:px-10 bg-white min-h-screen">
            {!selectedProduct ? (
                <>
                    <h2 className="text-3xl md:text-6xl font-extrabold mb-12 text-center text-gray-900 animate__animated animate__fadeIn">
                        Explore & Customize<br />Your Automobile Parts
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
                        {products.map((prod) => (
                            <div
                                key={prod.id}
                                onClick={() => handleSelectProduct(prod)}
                                className="relative overflow-hidden bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg hover:border-[#ff4d30] transition-all duration-300 cursor-pointer group animate__animated animate__zoomIn"
                            >
                                <div className="relative">
                                    <img
                                        src={prod.variants.options[0].images[0]}
                                        alt={prod.name}
                                        className="w-full h-64 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg"></div>
                                </div>
                                <div className="p-6 text-start">
                                    <h3 className="font-semibold text-xl text-gray-900 mb-2">{prod.name}</h3>
                                    <p className="text-gray-600 text-sm">{prod.description}</p>
                                    <p className="mt-4 text-lg font-medium text-[#ff4d30]">${prod.price}</p>
                                    <button className="mt-4 px-6 py-2 bg-[#ff4d30] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#ff4c30d6]">
                                        Explore Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="max-w-7xl mx-auto animate__animated animate__fadeIn">
                    <button
                        onClick={() => setSelectedProduct(null)}
                        className="mb-8 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center gap-2"
                    >
                        ← Back to Products
                    </button>
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="lg:w-1/2 bg-white rounded-lg border border-gray-200 shadow-md p-6 hover:shadow-lg transition-all duration-300">
                            <div className="w-full h-[26rem] flex items-center justify-center rounded-lg">
                                {/* <img
                                    src={selectedVariant.images[0]}
                                    alt={`${selectedProduct.name} - ${selectedVariant.name}`}
                                    className="object-contain max-w-full max-h-full rounded-lg cursor-pointer"
                                    onClick={openModal}
                                /> */}
                                <div className="relative flex justify-center items-center">
                                    <img
                                        src={selectedVariant.images[currentImageIndex]}
                                        alt={`${selectedProduct.name} - ${selectedVariant.name}`}
                                        className="max-w-full h-[300px] rounded-md object-cover"
                                    />
                                    <div className="absolute top-1/2 transform -translate-y-1/2 w-full px-4 flex justify-between">
                                        <button
                                            onClick={prevImage}
                                            className="text-white cursor-pointer bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="15 18 9 12 15 6"></polyline>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="text-white cursor-pointer bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center space-x-4 mt-8">
                                {selectedProduct.variants.options.map((option) => (
                                    <button
                                        key={option.name}
                                        onClick={() => setSelectedVariant(option)}
                                        className={`px-6 py-3 rounded-lg border-2 font-medium transition-all duration-300 hover:scale-105 ${selectedVariant.name === option.name
                                            ? 'bg-[#ff4d30] text-white border-[#ff4d30] shadow-md'
                                            : 'bg-white text-gray-900 border-gray-300 hover:border-[#ff4d30]'
                                            }`}
                                    >
                                        {option.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-1/2 pt-6 text-start">
                            <h2 className="text-4xl font-semibold text-gray-900 mb-4">{selectedProduct.name}</h2>
                            <p className="text-gray-600 mb-6 text-lg">{selectedProduct.description}</p>
                            {/* <p className="text-2xl font-medium text-[#ff4d30] mb-8">${selectedProduct.price}</p> */}

                            <div className="mt-10 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">

                                <ul className="grid grid-cols-1 gap-4 text-gray-600">
                                    <li className="flex items-center gap-3 p-3 hover:bg-white rounded-lg transition-all duration-300">
                                        <span className="h-3 w-3 rounded-full bg-[#ff4d30] animate-pulse"></span>
                                        <span className="font-medium">High-quality material</span>
                                    </li>
                                    <li className="flex items-center gap-3 p-3 hover:bg-white rounded-lg transition-all duration-300">
                                        <span className="h-3 w-3 rounded-full bg-[#ff4d30] animate-pulse"></span>
                                        <span className="font-medium">Precision-engineered</span>
                                    </li>
                                    <li className="flex items-center gap-3 p-3 hover:bg-white rounded-lg transition-all duration-300">
                                        <span className="h-3 w-3 rounded-full bg-[#ff4d30] animate-pulse"></span>
                                        <span className="font-medium">Multiple {selectedProduct.variants.type} available</span>
                                    </li>
                                    <li className="flex items-center gap-3 p-3 hover:bg-white rounded-lg transition-all duration-300">
                                        <span className="h-3 w-3 rounded-full bg-[#ff4d30] animate-pulse"></span>
                                        <span className="font-medium">Easy installation</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}