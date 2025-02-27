import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Products() {
    const [products, setProducts] = useState([]);
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

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="pt-36 px-4 sm:px-10">
            <h2 className="text-2xl md:text-4xl text-start font-bold mb-6">
                Explore, Customize and Purchase <br /> the automobile parts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-3 3xl:grid-cols-4">
                {products.map((product) => (
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
        </div>
    );
}

export default Products;
