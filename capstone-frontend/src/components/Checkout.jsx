import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import valid from 'card-validator'; // For strict card validation

function CheckoutForm() {
    const role = localStorage.getItem("user-role");
    const token = localStorage.getItem("token");
    const [customers, setCustomers] = useState([]);
    const userRole = role ? role.replace(/"/g, "") : "";

    // Form field states
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');

    // Error states
    const [errors, setErrors] = useState({});

    // Submitting state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch customers if user is a GARAGE
    const fetchUsers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/garage/user/get`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            const { data } = await res.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error fetching users');
        }
    };

    useEffect(() => {
        if (userRole === "GARAGE") fetchUsers();
    }, [userRole]);

    // Retrieve checkout data from localStorage
    const checkoutData = JSON.parse(localStorage.getItem('checkout')) || {};
    const items = checkoutData.cart || checkoutData.items || {};
    const total = Number(checkoutData.total) || 0;

    // Validation functions
    const validateCountry = (value) => !value ? 'Country is required' : '';
    const validateCity = (value) => !value ? 'City is required' : '';
    const validateAddress = (value) => !value ? 'Address is required' : '';
    const validateCustomerId = (value) => userRole === 'GARAGE' && !value ? 'Customer Order is required' : '';

    // Strict card validation using card-validator
    const validateCardNumber = (value) => {
        if (paymentMethod !== 'card') return '';
        const validation = valid.number(value.replace(/\s/g, ''));
        return validation.isValid ? '' : 'Invalid card number';
    };

    const validateExpiryDate = (value) => {
        if (paymentMethod !== 'card') return '';
        const [month, year] = value.split('/').map(s => s.trim());
        const validation = valid.expirationDate({ month, year });
        return validation.isValid ? '' : 'Invalid expiry date (use MM/YY)';
    };

    const validateCvc = (value, cardNumber) => {
        if (paymentMethod !== 'card') return '';
        const cardValidation = valid.number(cardNumber.replace(/\s/g, ''));
        const cvcLength = cardValidation.card ? cardValidation.card.code.size : 3;
        const validation = valid.cvv(value, cvcLength);
        return validation.isValid ? '' : `Invalid CVC (${cvcLength} digits required)`;
    };

    // Format card number (spaces after every 4 digits)
    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(.{4})/g, '$1 ').trim();
    };

    // Format expiry date (MM/YY with /)
    const formatExpiryDate = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 4);
        if (digits.length > 2) {
            return digits.slice(0, 2) + '/' + digits.slice(2);
        }
        return digits;
    };

    // Handle input changes with formatting and validation
    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setCardNumber(formatted);
        setErrors((prev) => ({ ...prev, cardNumber: validateCardNumber(formatted) }));
    };

    const handleExpiryDateChange = (e) => {
        const formatted = formatExpiryDate(e.target.value);
        setExpiryDate(formatted);
        setErrors((prev) => ({ ...prev, expiryDate: validateExpiryDate(formatted) }));
    };

    const handleCvcChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4); // Allow up to 4 digits for Amex
        setCvc(value);
        setErrors((prev) => ({ ...prev, cvc: validateCvc(value, cardNumber) }));
    };

    // Blur handlers for other fields
    const handleCountryBlur = () => setErrors((prev) => ({ ...prev, country: validateCountry(country) }));
    const handleCityBlur = () => setErrors((prev) => ({ ...prev, city: validateCity(city) }));
    const handleAddressBlur = () => setErrors((prev) => ({ ...prev, address: validateAddress(address) }));
    const handleCustomerIdBlur = () => setErrors((prev) => ({ ...prev, customerId: validateCustomerId(customerId) }));

    // Form validation before submission
    const validateForm = () => {
        const errors = {};
        const countryError = validateCountry(country);
        if (countryError) errors.country = countryError;
        const cityError = validateCity(city);
        if (cityError) errors.city = cityError;
        const addressError = validateAddress(address);
        if (addressError) errors.address = addressError;
        const customerIdError = validateCustomerId(customerId);
        if (customerIdError) errors.customerId = customerIdError;
        if (paymentMethod === 'card') {
            const cardNumberError = validateCardNumber(cardNumber);
            if (cardNumberError) errors.cardNumber = cardNumberError;
            const expiryDateError = validateExpiryDate(expiryDate);
            if (expiryDateError) errors.expiryDate = expiryDateError;
            const cvcError = validateCvc(cvc, cardNumber);
            if (cvcError) errors.cvc = cvcError;
        }
        return errors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        if (!token) {
            toast.error('Please login to continue');
            setIsSubmitting(false);
            return;
        }

        if (!Object.keys(items).length) {
            toast.error('No Items found');
            window.location.href = '/';
            setIsSubmitting(false);
            return;
        }

        const payload = {
            items,
            totalPrice: total,
            country,
            city,
            address,
            paymentMethod,
            customerId: userRole === 'GARAGE' ? customerId : '',
            ...(paymentMethod === 'card' && {
                cardNumber: cardNumber.replace(/\s/g, ''), // Remove spaces for API
                expiryDate,
                cvc,
            }),
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Order creation failed');
            await response.json();
            toast.success('Order created successfully');
            localStorage.removeItem('cart');
            localStorage.removeItem('checkout');
            window.location.href = '/';
        } catch (error) {
            console.error('Order error:', error);
            toast.error('Order creation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 pt-32">
            <form onSubmit={handleSubmit} className="mx-auto grid gap-10 grid-cols-1 xl:grid-cols-3 max-w-screen-xl px-4 2xl:px-0">
                <div className="xl:row-span-2 xl:col-span-2 space-y-4">
                    <div className="pb-5">
                        <h2 className="text-xl font-semibold text-start text-gray-900 dark:text-white">Order Details</h2>
                        <p className="text-sm text-start font-normal text-gray-500 dark:text-gray-400">
                            Note: We offer Cash on Delivery by default. You can select Card Payment if preferred.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className='text-start'>

                            <label htmlFor="country" className="block text-sm font-medium text-gray-900 dark:text-white">Country*</label>
                            <input
                                type="text"
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                onBlur={handleCountryBlur}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                            />
                            {errors.country && <div className="text-red-500 text-sm mt-1">{errors.country}</div>}
                        </div>
                        <div className='text-start'>

                            <label htmlFor="city" className="block text-sm font-medium text-gray-900 dark:text-white">City*</label>
                            <input
                                type="text"
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                onBlur={handleCityBlur}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                            />
                            {errors.city && <div className="text-red-500 text-sm mt-1">{errors.city}</div>}
                        </div>
                        <div className="sm:col-span-2 text-start">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-900 dark:text-white">Full Address*</label>
                            <input
                                type="text"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                onBlur={handleAddressBlur}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                            />
                            {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
                        </div>
                        {userRole === "GARAGE" && (
                            <div className="sm:col-span-2 text-start">
                                <label htmlFor="customerId" className="block text-sm font-medium text-gray-900 dark:text-white">Customer Order*</label>
                                <select
                                    id="customerId"
                                    value={customerId}
                                    onChange={(e) => setCustomerId(e.target.value)}
                                    onBlur={handleCustomerIdBlur}
                                    className="block w-full rounded-lg capitalize border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                >
                                    <option value="">Select a Customer</option>
                                    {customers.map((item) => (
                                        <option value={item.id} key={item.id}>{item.fullName}</option>
                                    ))}
                                </select>
                                {errors.customerId && <div className="text-red-500 text-sm mt-1">{errors.customerId}</div>}
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="mt-6">
                        <label className="block text-lg text-start font-semibold text-gray-900 dark:text-white my-4">Select Payment Method</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div
                                className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex items-center ${paymentMethod === 'cod' ? 'border-[#ff4d30] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                                onClick={() => setPaymentMethod('cod')}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                    className="w-4 h-4 accent-[#ff4d30]"
                                />
                                <div className="pl-4 text-start">
                                    <span className="font-medium text-gray-900 dark:text-white">Cash on Delivery</span>
                                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                                </div>
                            </div>
                            <div
                                className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex items-center ${paymentMethod === 'card' ? 'border-[#ff4d30] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                                onClick={() => setPaymentMethod('card')}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={() => setPaymentMethod('card')}
                                    className="w-4 h-4 accent-[#ff4d30]"
                                />
                                <div className="pl-4 text-start">
                                    <span className="font-medium text-gray-900 dark:text-white">Card Payment</span>
                                    <p className="text-sm text-gray-500">Pay securely with your card</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Details */}
                    {paymentMethod === 'card' && (
                        <div className="pt-4">
                            <label className="block text-start text-sm font-medium text-gray-900 dark:text-white mb-2">Card Details</label>
                            <div className="grid grid-cols-1 gap-4">
                                <div className='text-start'>

                                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-900 dark:text-white">Card Number*</label>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        placeholder="1234 5678 9012 3456"
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                    />
                                    {errors.cardNumber && <div className="text-red-500 text-sm mt-1">{errors.cardNumber}</div>}
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className='text-start'>

                                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-900 dark:text-white">Expiry Date (MM/YY)*</label>
                                        <input
                                            type="text"
                                            id="expiryDate"
                                            value={expiryDate}
                                            onChange={handleExpiryDateChange}
                                            placeholder="MM/YY"
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                        />
                                        {errors.expiryDate && <div className="text-red-500 text-sm mt-1">{errors.expiryDate}</div>}
                                    </div>
                                    <div className='text-start'>
                                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-900 dark:text-white">CVC*</label>
                                        <input
                                            type="text"
                                            id="cvc"
                                            value={cvc}
                                            onChange={handleCvcChange}
                                            placeholder="CVC"
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                        />
                                        {errors.cvc && <div className="text-red-500 text-sm mt-1">{errors.cvc}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-6 w-full cursor-pointer lg:w-[50%] px-6 py-3 bg-[#ff4d30] text-white font-semibold rounded-lg hover:bg-[#ff4c30d6] transition"
                        >
                            {isSubmitting ? 'Processing...' : 'Order Now'}
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
                </div>
            </form>
        </section>
    );
}

export default CheckoutForm;