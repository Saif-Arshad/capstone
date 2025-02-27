import { useState } from 'react';
import { toast } from 'react-toastify';

function Checkout() {
    const checkoutData = JSON.parse(localStorage.getItem('checkout')) || {};
   
    console.log("🚀 ~ Checkout ~ checkoutData:", checkoutData)
    const items = checkoutData.cart || checkoutData.item || {};
    const total = checkoutData.total || 0;

    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [loading,setLoading] = useState(false)

    const order = async (e) => {
        e.preventDefault();
        setLoading(true)
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to continue");
        }
        if (!checkoutData || (!checkoutData.cart && !checkoutData.item)) {
            toast.error("No Items found");
            window.location.href = "/";
            return null;
        }

        const payload = {
            items,
            totalPrice: total,
            country,
            city,
            address,
        };

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/order/create`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                setLoading(false)
                throw new Error('Order creation failed');

            }

            const data = await response.json();
            console.log("Order created:", data);

            toast.success("Order created successfully ")

            setLoading(false)
            window.location.href = "/";

            if (checkoutData.cart) {
                localStorage.removeItem("cart");
            }
            localStorage.removeItem("checkout");

        } catch (error) {
            console.error("Order error:", error);
            setLoading(false)
            toast.error("Order creation failed ")
        }
    };

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 pt-32">
            <form onSubmit={order} className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
                    <div className="min-w-0 flex-1 space-y-8">
                        <div className="space-y-4">
                            <div className='pb-5'>
                                <h2 className="text-xl font-semibold text-start text-gray-900 dark:text-white">Order Details</h2>
                                <p className="text-sm text-start font-normal text-gray-500 dark:text-gray-400">
                                    Note We only offer cash on delivery
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <div className="mb-2 flex items-center gap-2">
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-900 dark:text-white">Country*</label>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        id="country"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 flex items-center gap-2">
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-900 dark:text-white">City*</label>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                    />
                                </div>
                                <div className="row-span-2 col-span-2">
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-900 dark:text-white">Full Address*</label>
                                    </div>
                                    <input
                                        type="text"
                                        id="address"
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    className="mt-6 w-full lg:w-[50%] px-6 py-3 bg-[#ff4d30] text-white font-semibold rounded-lg hover:bg-[#ff4c30d6] cursor-pointer transition"
                                >
                                    {
                                        loading ? "Processing..." : " Order Now"
                                    }
                                   
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
                        <div className="flow-root">
                            <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
                                <dl className="flex items-center justify-between gap-4 py-3">
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Subtotal</dt>
                                    <dd className="text-base font-medium text-gray-900 dark:text-white">{total} AED</dd>
                                </dl>
                                <dl className="flex items-center justify-between gap-4 py-3">
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Savings</dt>
                                    <dd className="text-base font-medium text-green-500">0</dd>
                                </dl>

                                <dl className="flex items-center justify-between gap-4 py-3">
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Tax</dt>
                                    <dd className="text-base font-medium text-gray-900 dark:text-white">0</dd>
                                </dl>
                                <dl className="flex items-center justify-between gap-4 py-3">
                                    <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                                    <dd className="text-base font-bold text-gray-900 dark:text-white">{total} AED</dd>
                                </dl>
                            </div>
                        </div>
                        <div className="space-y-3">

                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                One or more items in your cart require an account.{' '}
                                <a href="/" title className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">
                                    Sign in or create an account now.
                                </a>.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
}

export default Checkout;
