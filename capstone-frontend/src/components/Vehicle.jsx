import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'animate.css';

const products = [
    {
        id: 1,
        name: "Nissan 3070z Fender",
        description: "Premium fender crafted for the Nissan 3070z, ensuring perfect fit and durability.",
        price: 200,
        colors: [
            {
                name: "Black",
                images: [
                    "/nissan/fender/black/1.png",
                    "/nissan/fender/black/2.png",
                    "/nissan/fender/black/3.png",
                    "/nissan/fender/black/4.png",
                    "/nissan/fender/black/5.png",
                    "/nissan/fender/black/6.png",
                    "/nissan/fender/black/7.png",
                    "/nissan/fender/black/8.png",
                    "/nissan/fender/black/9.png",
                    "/nissan/fender/black/10.png",
                    "/nissan/fender/black/11.png",
                    "/nissan/fender/black/12.png",
                ],
            },
            {
                name: "Brown",
                images: [
                    "/nissan/fender/brown/1.png",
                    "/nissan/fender/brown/2.png",
                    "/nissan/fender/brown/3.png",
                    "/nissan/fender/brown/4.png",
                    "/nissan/fender/brown/5.png",
                    "/nissan/fender/brown/6.png",
                    "/nissan/fender/brown/7.png",
                    "/nissan/fender/brown/8.png",
                    "/nissan/fender/brown/9.png",
                    "/nissan/fender/brown/10.png",
                    "/nissan/fender/brown/11.png",
                    "/nissan/fender/brown/12.png",
                ],
            },
            {
                name: "White",
                images: [
                    "/nissan/fender/white/1.png",
                    "/nissan/fender/white/2.png",
                    "/nissan/fender/white/3.png",
                    "/nissan/fender/white/4.png",
                    "/nissan/fender/white/5.png",
                    "/nissan/fender/white/6.png",
                    "/nissan/fender/white/7.png",
                    "/nissan/fender/white/8.png",
                    "/nissan/fender/white/9.png",
                    "/nissan/fender/white/10.png",
                    "/nissan/fender/white/11.png",
                    "/nissan/fender/white/12.png",
                ],
            },
        ],
    },
    {
        id: 2,
        name: "Nissan 3070z Nismo",
        description: "Premium fender crafted for the Nissan 3070z, ensuring perfect fit and durability.",
        price: 200,
        wheels: [
            {
                name: "Black",
                images: [
                    "/nissan/nismo/black/1.png",
                    "/nissan/nismo/black/2.png",
                    "/nissan/nismo/black/3.png",
                    "/nissan/nismo/black/4.png",
                    "/nissan/nismo/black/5.png",
                    "/nissan/nismo/black/6.png",
                    "/nissan/nismo/black/7.png",
                    "/nissan/nismo/black/8.png",
                    "/nissan/nismo/black/9.png",
                    "/nissan/nismo/black/10.png",
                    "/nissan/nismo/black/11.png",
                    "/nissan/nismo/black/12.png",
                ],
            },
            {
                name: "Brown",
                images: [
                    "/nissan/nismo/brown/1.png",
                    "/nissan/nismo/brown/2.png",
                    "/nissan/nismo/brown/3.png",
                    "/nissan/nismo/brown/4.png",
                    "/nissan/nismo/brown/5.png",
                    "/nissan/nismo/brown/6.png",
                    "/nissan/nismo/brown/7.png",
                    "/nissan/nismo/brown/8.png",
                    "/nissan/nismo/brown/9.png",
                    "/nissan/nismo/brown/10.png",
                    "/nissan/nismo/brown/11.png",
                    "/nissan/nismo/brown/12.png",
                ],
            },
            {
                name: "White",
                images: [
                    "/nissan/nismo/white/1.png",
                    "/nissan/nismo/white/2.png",
                    "/nissan/nismo/white/3.png",
                    "/nissan/nismo/white/4.png",
                    "/nissan/nismo/white/5.png",
                    "/nissan/nismo/white/6.png",
                    "/nissan/nismo/white/7.png",
                    "/nissan/nismo/white/8.png",
                    "/nissan/nismo/white/9.png",
                    "/nissan/nismo/white/10.png",
                    "/nissan/nismo/white/11.png",
                    "/nissan/nismo/white/12.png",
                ],
            },
        ],
    },
    {
        id: 2,
        name: "Nissan 3070z te3 Black",
        description: "Premium fender crafted for the Nissan 3070z, ensuring perfect fit and durability.",
        price: 200,
        wheels: [
            {
                name: "Black",
                images: [
                    "/nissan/te3/black/black-wheel/1.png",
                    "/nissan/te3/black/black-wheel/2.png",
                    "/nissan/te3/black/black-wheel/3.png",
                    "/nissan/te3/black/black-wheel/4.png",
                    "/nissan/te3/black/black-wheel/5.png",
                    "/nissan/te3/black/black-wheel/6.png",
                    "/nissan/te3/black/black-wheel/7.png",
                    "/nissan/te3/black/black-wheel/8.png",
                    "/nissan/te3/black/black-wheel/9.png",
                    "/nissan/te3/black/black-wheel/10.png",
                    "/nissan/te3/black/black-wheel/11.png",
                    "/nissan/te3/black/black-wheel/12.png",

                ],
            },
            {
                name: "Bronze",
                images: [
                    "/nissan/te3/black/bronze-whel/1.png",
                    "/nissan/te3/black/bronze-whel/2.png",
                    "/nissan/te3/black/bronze-whel/3.png",
                    "/nissan/te3/black/bronze-whel/4.png",
                    "/nissan/te3/black/bronze-whel/5.png",
                    "/nissan/te3/black/bronze-whel/6.png",
                    "/nissan/te3/black/bronze-whel/7.png",
                    "/nissan/te3/black/bronze-whel/8.png",
                    "/nissan/te3/black/bronze-whel/9.png",
                    "/nissan/te3/black/bronze-whel/10.png",
                    "/nissan/te3/black/bronze-whel/11.png",
                    "/nissan/te3/black/bronze-whel/12.png",
                ],
            },
            {
                name: "Gunmetal",
                images: [
                    "/nissan/te3/black/gun-wheel/1.png",
                    "/nissan/te3/black/gun-wheel/2.png",
                    "/nissan/te3/black/gun-wheel/3.png",
                    "/nissan/te3/black/gun-wheel/4.png",
                    "/nissan/te3/black/gun-wheel/5.png",
                    "/nissan/te3/black/gun-wheel/6.png",
                    "/nissan/te3/black/gun-wheel/7.png",
                    "/nissan/te3/black/gun-wheel/8.png",
                    "/nissan/te3/black/gun-wheel/9.png",
                    "/nissan/te3/black/gun-wheel/10.png",
                    "/nissan/te3/black/gun-wheel/11.png",
                    "/nissan/te3/black/gun-wheel/12.png",
                ],
            },
        ],
    },
    {
        id: 2,
        name: "Nissan 3070z te3 Brown",
        description: "Premium fender crafted for the Nissan 3070z, ensuring perfect fit and durability.",
        price: 200,
        wheels: [
            {
                name: "Black",
                images: [
                    "/nissan/te3/brown/black-wheel/1.png",
                    "/nissan/te3/brown/black-wheel/2.png",
                    "/nissan/te3/brown/black-wheel/3.png",
                    "/nissan/te3/brown/black-wheel/4.png",
                    "/nissan/te3/brown/black-wheel/5.png",
                    "/nissan/te3/brown/black-wheel/6.png",
                    "/nissan/te3/brown/black-wheel/7.png",
                    "/nissan/te3/brown/black-wheel/8.png",
                    "/nissan/te3/brown/black-wheel/9.png",
                    "/nissan/te3/brown/black-wheel/10.png",
                    "/nissan/te3/brown/black-wheel/11.png",
                    "/nissan/te3/brown/black-wheel/12.png",

                ],
            },
            {
                name: "Bronze",
                images: [
                    "/nissan/te3/brown/bronze-wheel/1.png",
                    "/nissan/te3/brown/bronze-wheel/2.png",
                    "/nissan/te3/brown/bronze-wheel/3.png",
                    "/nissan/te3/brown/bronze-wheel/4.png",
                    "/nissan/te3/brown/bronze-wheel/5.png",
                    "/nissan/te3/brown/bronze-wheel/6.png",
                    "/nissan/te3/brown/bronze-wheel/7.png",
                    "/nissan/te3/brown/bronze-wheel/8.png",
                    "/nissan/te3/brown/bronze-wheel/9.png",
                    "/nissan/te3/brown/bronze-wheel/10.png",
                    "/nissan/te3/brown/bronze-wheel/11.png",
                    "/nissan/te3/brown/bronze-wheel/12.png",
                ],
            }
        ],
    },
    {
        id: 2,
        name: "Nissan 3070z te3 White",
        description: "Premium fender crafted for the Nissan 3070z, ensuring perfect fit and durability.",
        price: 200,
        wheels: [
            {
                name: "Black",
                images: [
                    "/nissan/te3/white/black-wheel/1.png",
                    "/nissan/te3/white/black-wheel/2.png",
                    "/nissan/te3/white/black-wheel/3.png",
                    "/nissan/te3/white/black-wheel/4.png",
                    "/nissan/te3/white/black-wheel/5.png",
                    "/nissan/te3/white/black-wheel/6.png",
                    "/nissan/te3/white/black-wheel/7.png",
                    "/nissan/te3/white/black-wheel/8.png",
                    "/nissan/te3/white/black-wheel/9.png",
                    "/nissan/te3/white/black-wheel/10.png",
                    "/nissan/te3/white/black-wheel/11.png",
                    "/nissan/te3/white/black-wheel/12.png",

                ],
            },
            {
                name: "Bronze",
                images: [
                    "/nissan/te3/white/bronze-wheel/1.png",
                    "/nissan/te3/white/bronze-wheel/2.png",
                    "/nissan/te3/white/bronze-wheel/3.png",
                    "/nissan/te3/white/bronze-wheel/4.png",
                    "/nissan/te3/white/bronze-wheel/5.png",
                    "/nissan/te3/white/bronze-wheel/6.png",
                    "/nissan/te3/white/bronze-wheel/7.png",
                    "/nissan/te3/white/bronze-wheel/8.png",
                    "/nissan/te3/white/bronze-wheel/9.png",
                    "/nissan/te3/white/bronze-wheel/10.png",
                    "/nissan/te3/white/bronze-wheel/11.png",
                    "/nissan/te3/white/bronze-wheel/12.png",
                ],
            },
            {
                name: "Grau",
                images: [
                    "/nissan/te3/white/gray-wheel/1.png",
                    "/nissan/te3/white/gray-wheel/2.png",
                    "/nissan/te3/white/gray-wheel/3.png",
                    "/nissan/te3/white/gray-wheel/4.png",
                    "/nissan/te3/white/gray-wheel/5.png",
                    "/nissan/te3/white/gray-wheel/6.png",
                    "/nissan/te3/white/gray-wheel/7.png",
                    "/nissan/te3/white/gray-wheel/8.png",
                    "/nissan/te3/white/gray-wheel/9.png",
                    "/nissan/te3/white/gray-wheel/10.png",
                    "/nissan/te3/white/gray-wheel/11.png",
                    "/nissan/te3/white/gray-wheel/12.png",
                ],
            }
        ],
    },
    {
        id: 2,
        name: "Subaru 3070z Blue",
        description: "Premium fender crafted for the Nissan 3070z, ensuring perfect fit and durability.",
        price: 200,
        wheels: [
            {
                name: "black",
                images: [
                    "/Subaru/blue/black-wheel/1.png",
                    "/Subaru/blue/black-wheel/2.png",
                    "/Subaru/blue/black-wheel/3.png",
                    "/Subaru/blue/black-wheel/4.png",
                    "/Subaru/blue/black-wheel/5.png",
                    "/Subaru/blue/black-wheel/6.png",
                    "/Subaru/blue/black-wheel/7.png",
                    "/Subaru/blue/black-wheel/8.png",
                    "/Subaru/blue/black-wheel/9.png",
                    "/Subaru/blue/black-wheel/10.png",
                    "/Subaru/blue/black-wheel/11.png",
                    "/Subaru/blue/black-wheel/12.png",

                ],
            },
            {
                name: "Bronze",
                images: [
                    "/Subaru/blue/broze-wheel/1.png",
                    "/Subaru/blue/broze-wheel/2.png",
                    "/Subaru/blue/broze-wheel/3.png",
                    "/Subaru/blue/broze-wheel/4.png",
                    "/Subaru/blue/broze-wheel/5.png",
                    "/Subaru/blue/broze-wheel/6.png",
                    "/Subaru/blue/broze-wheel/7.png",
                    "/Subaru/blue/broze-wheel/8.png",
                    "/Subaru/blue/broze-wheel/9.png",
                ],
            },
            {
                name: "gray",
                images: [
                    "/Subaru/blue/gray/1.png",
                    "/Subaru/blue/gray/2.png",
                    "/Subaru/blue/gray/3.png",
                    "/Subaru/blue/gray/4.png",
                    "/Subaru/blue/gray/5.png",
                    "/Subaru/blue/gray/6.png",
                    "/Subaru/blue/gray/7.png",
                    "/Subaru/blue/gray/8.png",
                    "/Subaru/blue/gray/9.png",
                    "/Subaru/blue/gray/10.png",
                    "/Subaru/blue/gray/11.png",
                ],
            }
        ],
    },
    {
        id: 2,
        name: "Subaru 3070z Wing",
        description: "Premium fender crafted for the Nissan 3070z, ensuring perfect fit and durability.",
        price: 200,
        colors: [
            {
                name: "Blue",
                images: [
                    "/Subaru/wing/blue/1.png",
                    "/Subaru/wing/blue/2.png",
                    "/Subaru/wing/blue/3.png",
                    "/Subaru/wing/blue/4.png",
                    "/Subaru/wing/blue/5.png",
                    "/Subaru/wing/blue/6.png",
                    "/Subaru/wing/blue/7.png",
                    "/Subaru/wing/blue/8.png",
                    "/Subaru/wing/blue/9.png",
                    "/Subaru/wing/blue/10.png",
                    "/Subaru/wing/blue/11.png",
                    "/Subaru/wing/blue/12.png",

                ],
            },
            {
                name: "Green",
                images: [
                    "/Subaru/wing/green/1.png",
                    "/Subaru/wing/green/2.png",
                    "/Subaru/wing/green/3.png",
                    "/Subaru/wing/green/4.png",
                    "/Subaru/wing/green/5.png",
                    "/Subaru/wing/green/6.png",
                    "/Subaru/wing/green/7.png",
                    "/Subaru/wing/green/8.png",
                    "/Subaru/wing/green/9.png",
                    "/Subaru/wing/green/10.png",
                    "/Subaru/wing/green/11.png",
                    "/Subaru/wing/green/12.png",
                ],
            },

        ],
    },

];

export default function Vehicle() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setSelectedColor(product.colors[0]);
    };

    return (
        <div className="pt-36 px-4 sm:px-10 bg-gradient-to-b from-gray-100 via-white to-gray-50 min-h-screen">
            {!selectedProduct ? (
                <>
                    <h2 className="text-3xl md:text-6xl font-extrabold mb-12 text-center text-gray-800 animate__animated animate__fadeIn">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                            Explore & Customize
                        </span>
                        <br />
                        Your Automobile Parts
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
                        {products.map((prod) => (
                            <div
                                key={prod.id}
                                onClick={() => handleSelectProduct(prod)}
                                className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer group animate__animated animate__zoomIn hover:shadow-blue-200"
                            >
                                <div className="relative">
                                    <img
                                        src={prod.colors[0].images[0]}
                                        alt={prod.name}
                                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-8">
                                    <h3 className="font-bold text-2xl text-gray-800 mb-3">{prod.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{prod.description}</p>
                                    <p className="mt-4 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">${prod.price}</p>
                                    <button className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200">
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
                        className="mb-8 px-6 py-3 bg-white text-gray-800 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        ← Back to Products
                    </button>
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-1/2 bg-white rounded-3xl shadow-2xl p-8 hover:shadow-blue-200 transition-all duration-300">
                            <Swiper
                                modules={[EffectCoverflow, Navigation, Autoplay]}
                                effect="coverflow"
                                grabCursor={true}
                                slidesPerView="auto"
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                coverflowEffect={{
                                    rotate: 50,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 1,
                                    slideShadows: true,
                                }}
                                className="w-full h-[32rem]"
                            >
                                {selectedColor.images.map((src, idx) => (
                                    <SwiperSlide
                                        key={idx}
                                        className="w-96 h-96 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg"
                                    >
                                        <img
                                            src={src}
                                            alt={`${selectedProduct.name} - ${selectedColor.name}`}
                                            className="object-contain w-full h-full transform transition-all duration-500 hover:scale-110"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <div className="flex justify-center space-x-4 mt-8">
                                {selectedProduct.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 transform hover:scale-105 ${selectedColor.name === color.name
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                                            }`}
                                    >
                                        {color.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-1/2 pt-6">
                            <h2 className="text-5xl font-extrabold  mb-6">
                                {selectedProduct.name}
                            </h2>
                            <p className="text-gray-600 mb-8 text-lg leading-relaxed">{selectedProduct.description}</p>
                            <p className="text-3xl font-semibold text-blue-600 mb-8">${selectedProduct.price}</p>

                            <div className="mt-12">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Product Details</h3>
                                <ul className="grid grid-cols-2 gap-4">
                                    {['High-quality material for durability', 'Precision-engineered for perfect fit', 'Available in multiple colors', 'Easy to install'].map((item, index) => (
                                        <li key={index} className="flex items-center gap-2 text-gray-600">
                                            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}