import  { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

// Initialize Stripe with your public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
    // Retrieve checkout data from localStorage
    const checkoutData = JSON.parse(localStorage.getItem('checkout')) || {};
    const items = checkoutData.cart || checkoutData.item || {};
    const total = Number(checkoutData.total) || 0;

    // Local state for address fields and loading indicator
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    // Always call the Stripe hooks; because the entire form is wrapped in <Elements>,
    // these calls will succeed—even if we don’t use them for COD.
    const stripe = useStripe();
    const elements = useElements();

    const handleOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('Please login to continue');
            setLoading(false);
            return;
        }

        if (!checkoutData || (!checkoutData.cart && !checkoutData.item)) {
            toast.error('No Items found');
            window.location.href = '/';
            return;
        }

        const payload = {
            items,
            totalPrice: total,
            country,
            city,
            address,
            paymentMethod,
        };

        // If card payment is selected, perform Stripe payment confirmation without redirection
        if (paymentMethod === 'card') {
            if (!stripe || !elements) {
                toast.error('Stripe has not loaded yet.');
                setLoading(false);
                return;
            }
            try {
                // Remove return_url and add redirect option to avoid automatic redirection.
                const { error } = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        payment_method_data: {
                            billing_details: { name: 'Customer Name' },
                        },
                    },
                    redirect: 'if_required', // Only redirect if absolutely necessary
                });
                if (error) {
                    toast.error(error.message);
                    setLoading(false);
                    return;
                }
                // Payment confirmation succeeded without redirect.
            } catch (error) {
                console.error('Payment error:', error);
                toast.error('Payment processing failed');
                setLoading(false);
                return;
            }
        }

        // Create order (runs for both card and Cash on Delivery)
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/order/create`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                setLoading(false);
                throw new Error('Order creation failed');
            }

            await response.json();
            toast.success('Order created successfully');
            setLoading(false);
            // Clear local storage and redirect as needed
            window.location.href = '/';
            if (checkoutData.cart) {
                localStorage.removeItem('cart');
            }
            localStorage.removeItem('checkout');
        } catch (error) {
            console.error('Order error:', error);
            toast.error('Order creation failed');
            setLoading(false);
        }
    };


    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 pt-32">
            <form onSubmit={handleOrder} className="mx-auto grid gap-10 grid-cols-1 xl:grid-cols-3 max-w-screen-xl px-4 2xl:px-0">
                <div className=" xl:row-span-2 xl:col-span-2 space-y-4">
                    {/* Order Details */}
                    <div className="pb-5">
                        <h2 className="text-xl font-semibold text-start text-gray-900 dark:text-white">
                            Order Details
                        </h2>
                        <p className="text-sm text-start font-normal text-gray-500 dark:text-gray-400">
                            Note: We offer Cash on Delivery by default. You can select Card Payment if preferred.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <label htmlFor="country" className="block text-sm font-medium text-gray-900 dark:text-white">
                                    Country*
                                </label>
                            </div>
                            <input
                                type="text"
                                required
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900
                       focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                       dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <label htmlFor="city" className="block text-sm font-medium text-gray-900 dark:text-white">
                                    City*
                                </label>
                            </div>
                            <input
                                type="text"
                                required
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900
                       focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                       dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                            />
                        </div>
                        <div className="row-span-2 col-span-2">
                            <div className="flex items-center gap-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-900 dark:text-white">
                                    Full Address*
                                </label>
                            </div>
                            <input
                                type="text"
                                required
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900
                       focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                       dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="mt-6">
                        <label className="block text-lg text-start font-semibold text-gray-900 dark:text-white my-4">
                            Select Payment Method
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Cash on Delivery */}
                            <div
                                className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex items-center ${paymentMethod === 'cod' ? 'border-[#ff4d30] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => setPaymentMethod('cod')}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-4 h-4 accent-[#ff4d30]"
                                />
                                <div className="pl-4 text-start">
                                    <span className="font-medium text-gray-900 dark:text-white">Cash on Delivery</span>
                                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                                </div>
                            </div>
                            {/* Card Payment */}
                            <div
                                className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex items-center ${paymentMethod === 'card' ? 'border-[#ff4d30] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => setPaymentMethod('card')}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-4 h-4 accent-[#ff4d30]"
                                />
                                <div className="pl-4 text-start">
                                    <span className="font-medium text-gray-900 dark:text-white">Card Payment</span>
                                    <p className="text-sm text-gray-500">Pay securely with your card</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Always mount PaymentElement and hide it via CSS when not in use */}
                    <div className={`mt-4 ${paymentMethod !== 'card' ? 'hidden' : ''}`}>
                        <label className="block mt-4 text-start text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Card Details
                        </label>
                        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                            <PaymentElement />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full cursor-pointer lg:w-[50%] px-6 py-3 bg-[#ff4d30] text-white font-semibold rounded-lg hover:bg-[#ff4c30d6] transition"
                        >
                            {loading ? 'Processing...' : 'Order Now'}
                        </button>
                    </div>
                </div>

                {/* Order Summary */}
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
                            <a
                                href="/"
                                title
                                className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                            >
                                Sign in or create an account now.
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </form>
        </section>
    );
}

export default function Checkout() {
    const [clientSecret, setClientSecret] = useState('');

    const checkoutData = JSON.parse(localStorage.getItem('checkout')) || {};
    const total = Number(checkoutData.total) || 0;

    useEffect(() => {
        if (total > 0 && !clientSecret) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/create-payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Math.round(total * 100), currency: 'aed' }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        toast.error(data.error);
                    } else {
                        console.log(data);
                        setClientSecret(data.clientSecret);
                    }
                })
                .catch(() => {
                    toast.error('Payment intent creation failed');
                });
        }
    }, [total, clientSecret]);

    if (!clientSecret) {
        return <div>Loading...</div>;
    }

    const options = { clientSecret };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
        </Elements>
    );
}
