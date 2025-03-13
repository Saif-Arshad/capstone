import { AiFillCheckCircle } from "react-icons/ai"
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io"
import { Link } from "react-router-dom"
import backgroundImage from "../../assets/home-hero-bg.png";
import carImage from "../../assets/hero-big-car.png";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Index() {
    const chooseUs = [
        {
            id: 1,
            img: "/cross-country.png",
            title: "3D Customization",
            content:
                "Visualize and personalize your vehicle parts with our advanced 3D customization tool before making a purchase.",
        },
        {
            id: 2,
            img: "/all-inclusive.png",
            title: "Premium Quality Parts",
            content:
                "We offer high-quality, durable automobile parts from trusted manufacturers to ensure performance and longevity.",
        },
        {
            id: 3,
            img: "/no-hidden.png",
            title: "Transparent Pricing",
            content:
                "No hidden charges! Get the best value with clear and competitive pricing on all our products.",
        },
    ];
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    console.log("🚀 ~ Index ~ brands:", brands)
    console.log("🚀 ~ Products ~ products:", products);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`);
            if (!res.ok) {
                throw new Error('Failed to fetch products');
            }
            const { data } = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error fetching products');
        }
    };
    const fetchBrands = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/brand`);
            if (!res.ok) {
                throw new Error('Failed to fetch brands');
            }
            const { data } = await res.json();
            setBrands(data);
        } catch (error) {
            console.error('Error fetching brands:', error);
            toast.error('Error fetching brands');
        }
    };
    useEffect(() => {
        fetchProducts();
        fetchBrands();
    }, []);

    return (
        <>
            <section className="px-8 flex-col lg:px-28  py-20 min-h-screen flex relative" id="hero">
                <div className="grid grid-cols-1 pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                    {
                        brands?.map((item, index) => (
                            <div key={index} className="  w-full flex flex-col p-4 rounded-2xl ">
                                <Link to={`/products/${item.slug}`} >
                                    <div className="w-full h-52 cursor-pointer relative mb-4">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                </Link>
                            </div>
                        ))
                    }

                </div>
             
            </section>

          


            <section id="choose">
                <div className="py-8 px-8 lg:px-28 my-8 bg-chooseus-bg bg-no-repeat bg-cover text-center lg:text-left space-y-8">
                    <div>
                        <img
                            src="/chooseus-threecars.png"
                            alt="choose us"
                            width={1000}
                            height={1000}
                            className="m-auto w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-12 lg:flex-row lg:gap-32 lg:items-center">
                        <div className="space-y-8 lg:basis-1/2">
                            <div className=" space-y-2">
                                <h3 className="text-2xl font-bold md:text-4xl lg:text-5xl">Why Choose Us</h3>
                                <h1 className="text-2.5rem font-semibold leading-tight">
                                    Best valued deals you will ever find
                                </h1>
                            </div>
                            <div>
                                <p className="text-custom-grey mt-5">
                                    Upgrade your vehicle with the best deals on high-quality auto parts.
                                    Our unbeatable offers ensure you get the perfect parts at the most competitive
                                    prices. Experience hassle-free shopping with our 3D customization tool and
                                    transparent pricing—because your vehicle deserves the best!
                                </p>
                            </div>
                            <div className="flex justify-center lg:justify-start">
                                <a
                                    href="#booking"
                                    className="bg-custom-orange flex items-center gap-2 justify-center p-4 shadow-orange-bottom hover:shadow-orange-bottom-hov transition-all duration-300 ease-linear rounded font-bold text-white"
                                >
                                    <span>Find Details</span>
                                    <span className="text-xl">
                                        <IoIosArrowForward />
                                    </span>
                                </a>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 lg:gap-8 lg:basis-1/2">
                            {chooseUs.map((data) => (
                                <div
                                    key={data.id}
                                    className="flex flex-col gap-4 lg:flex-row text-center lg:text-left"
                                >
                                    <div>
                                        <img
                                            src={data.img}
                                            alt={data.title}
                                            width={500}
                                            height={500}
                                            className="m-auto w-28 lg:w-48"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <h1 className="font-bold text-2xl">{data.title}</h1>
                                        <p className="text-custom-grey">{data.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className="px-8 lg:px-28 py-12 lg:py-0 mt-20 lg:mt-0 h-screen flex items-center relative" id="hero">
                <img
                    src={backgroundImage}
                    alt="hero"
                    width={680}
                    height={870}
                    className="absolute inset-y-0 right-0 -z-10 hidden lg:inline-block"
                />
                <img
                    src={carImage}
                    alt="hero"
                    width={800}
                    height={450}
                    className="absolute right-0 hidden lg:inline-block"
                />
                <div className="space-y-8 text-center lg:text-left lg:max-w-lg">
                    <div className="font-bold space-y-2">
                        <h3 className="lg:text-xl text-lg">Customize Your Automobile</h3>
                        <h1 className="text-4xl sm:text-[3.2rem] leading-tight">
                            Customize Your <span className="text-[#ff4d30]">Ride</span>, Your Way!
                        </h1>
                    </div>
                    <div>
                        <p className="text-custom-grey mb-10">
                            Experience the future of automobile customization with our 3D visualization platform. Browse, personalize, and order auto parts effortlessly
                        </p>
                    </div>
                    <div className="flex flex-col lg:flex-row mt-8 text-white font-bold gap-6">
                        <Link
                            to="/custom"
                            className="bg-[#ff4d30] flex items-center gap-2 justify-center py-4 px-4 lg:px-8 shadow-orange-bottom hover:shadow-orange-bottom-hov transition-all duration-300 ease-linear rounded border-2 border-custom-orange"
                        >
                            <span>Explore Customizations</span>
                            <span className="text-xl">
                                <AiFillCheckCircle />
                            </span>
                        </Link>
                        <Link
                            to="/products"
                            className="bg-black flex items-center gap-2 justify-center py-4 px-4 lg:px-8 transition-all duration-300 ease-linear hover:bg-transparent hover:text-black rounded border-2 border-black"
                        >
                            <span>Shop Now</span>
                            <span className="text-xl">
                                <IoIosArrowForward />
                            </span>
                        </Link>
                    </div>
                </div>
                <span
                    className="absolute bottom-16 inset-x-1/2 text-3xl animate-bounce"
                    aria-label="View Models"
                >
                    <IoIosArrowDown />
                </span>

            </section>
            <section className="px-8 flex-col lg:px-28 py-12 lg:py-0 my-20 lg:mt-0 min-h-screen flex relative" id="hero">

                <h2 className="text-2xl md:text-4xl text-start font-bold mb-6">
                    Explore, Customize and Purchase <br /> the automobile parts
                </h2>
                <div className="grid grid-cols-1 pt-20 md:grid-cols-2 gap-5 lg:grid-cols-3 ">
                    {products.length > 0 && products.slice(0, 3).map((product) => (
                        <div key={product.id} className="w-full group bg-white shadow-lg rounded-xl overflow-hidden transform transition-transform duration-300 ">
                            <div className="relative ">
                                {product.images && product.images.length > 0 && (
                                    <>
                                        <img
                                            src={product.images[0].url}
                                            alt={product.name}
                                            className="w-full h-72 object-cover group-hover:opacity-0 transition-opacity duration-300"
                                        />
                                        {product.images.length > 1 && (
                                            <img
                                                src={product.images[1].url}
                                                alt={`${product.name} - alternate`}
                                                className="w-full h-72 object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="p-6 text-start">
                                <h2 className="text-lg text-start capitalize xl:text-2xl font-bold mb-3">{product.name}</h2>
                                {/* <p className="text-gray-600 mb-3 text-sm">{product.description.length > 150 ? `${product.description.slice(0, 100)}...` : product.description}</p> */}
                                <p className="text-[#ff4d30] font-bold text-xl mb-4">{product.price} AED</p>

                                <Link
                                    to={`/${product.id}`}
                                    className="text-black flex mt-10 items-center gap-2 justify-center py-2.5 px-6 transition-all duration-300 ease-linear hover:text-white rounded-full border-2 border-[#ff4d30] hover:bg-[#ff4d30] hover:shadow-md"
                                >
                                    <span className="font-medium">View Details</span>
                                    <span className="text-xl">
                                        <IoIosArrowForward />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </>

    )
}

export default Index