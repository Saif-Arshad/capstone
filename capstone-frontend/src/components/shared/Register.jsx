import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import { IoIosArrowForward, IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { toast } from 'react-toastify';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Register() {
    // States for handling modals and password visibility
    const [openRegister, setOpenRegister] = React.useState(false);
    const [openPrivacy, setOpenPrivacy] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    // Update form state: separate first and last names
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userType: "CUSTOMER"
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    // Open Privacy Agreement Dialog when user clicks Register
    const handleOpenPrivacy = () => {
        setOpenPrivacy(true);
    };

    const handleClosePrivacy = () => {
        setOpenPrivacy(false);
    };

    // If user agrees, close Privacy modal and open Registration modal
    const handleAgreePrivacy = () => {
        setOpenPrivacy(false);
        setOpenRegister(true);
    };

    const handleCloseRegister = () => {
        setOpenRegister(false);
        setError(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate that name fields contain only letters
    const validateNames = (name) => {
        const regex = /^[A-Za-z]+$/;
        return regex.test(name);
    };

    // Validate password according to required criteria
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validate first and last names
        if (!validateNames(formData.firstName)) {
            setError("First name must contain only letters.");
            return;
        }
        if (!validateNames(formData.lastName)) {
            setError("Last name must contain only letters.");
            return;
        }

        // Validate password
        if (!validatePassword(formData.password)) {
            setError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
            return;
        }

        setLoading(true);
        try {
            // Combine first and last name to create fullName for backend
            const payload = {
                ...formData,
                fullName: `${formData.firstName} ${formData.lastName}`
            };
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, payload);
            console.log('Registration successful:', response.data);
            toast.success('Registration successful. Login now.');
            handleCloseRegister();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            {/* The initial Register button opens the Privacy Agreement */}
            <button
                onClick={handleOpenPrivacy}
                className="bg-[#ff4d30] py-3 px-7 text-white cursor-pointer shadow-[0_10px_15px_0_rgba(255,83,48,.35)] hover:shadow-[0_10px_15px_0_rgba(255,83,48,.6)] transition-all duration-300 ease-linear rounded"
            >
                Register
            </button>

            {/* Privacy Agreement Dialog */}
            <Dialog
                open={openPrivacy}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClosePrivacy}
                aria-describedby="privacy-dialog"
            >
                <DialogContent>
                    <div className="flex flex-col p-4">
                        <h1 className="text-2xl font-bold mb-4">Privacy Agreement</h1>
                        <p className="mb-4">
                            Please review our Privacy Policy and Terms of Service. By clicking "I Agree", you accept these terms and conditions.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleClosePrivacy}
                                className="bg-gray-500 text-white py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAgreePrivacy}
                                className="bg-[#ff4d30] text-white py-2 px-4 rounded"
                            >
                                I Agree
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Registration Dialog */}
            <Dialog
                open={openRegister}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseRegister}
                aria-describedby="register-dialog"
            >
                <div className='flex items-start pl-10 pt-8 flex-col justify-start'>
                    <h1 className="text-left font-bold text-2xl">Signup</h1>
                    <p>Register Your Account</p>
                </div>
                <DialogContent>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <form onSubmit={handleSubmit} className="flex flex-col w-full sm:min-w-[400px] gap-4 p-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded focus:outline-none ring-1 ring-[#ff4d30]"
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded focus:outline-none ring-1 ring-[#ff4d30]"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded focus:outline-none ring-1 ring-[#ff4d30]"
                            required
                        />
                        {/* Password field with toggleable eye icon */}
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded focus:outline-none ring-1 ring-[#ff4d30] w-full"
                                required
                            />
                            <div
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <IoIosEyeOff size={20} /> : <IoIosEye size={20} />}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-10">
                            <div
                                onClick={() => setFormData({ ...formData, userType: "CUSTOMER" })}
                                className={`border cursor-pointer ${formData.userType === "CUSTOMER" ? "bg-orange-100" : "hover:bg-orange-100"} border-orange-600 rounded-lg flex items-center justify-center p-4`}
                            >
                                Join as Customer
                            </div>
                            <div
                                onClick={() => setFormData({ ...formData, userType: "GARAGE" })}
                                className={`border cursor-pointer ${formData.userType === "GARAGE" ? "bg-orange-100" : "hover:bg-orange-100"} border-orange-600 rounded-lg flex items-center justify-center p-4`}
                            >
                                Join as Garage
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row justify-end text-white font-bold gap-6">
                            <button
                                onClick={handleCloseRegister}
                                type="button"
                                className="bg-[#ff4d30] flex cursor-pointer items-center gap-2 justify-center py-4 px-4 lg:px-8 shadow-orange-bottom hover:shadow-orange-bottom-hov transition-all duration-300 ease-linear rounded border-2 border-custom-orange"
                            >
                                <span>Close</span>
                            </button>
                            <button
                                disabled={loading}
                                type="submit"
                                className="bg-black cursor-pointer flex items-center gap-2 justify-center py-4 px-4 lg:px-8 transition-all duration-300 ease-linear hover:bg-transparent hover:text-black rounded border-2 border-black"
                            >
                                <span>{loading ? 'Registering...' : 'Register'}</span>
                                <span className="text-xl">
                                    <IoIosArrowForward />
                                </span>
                            </button>
                        </div>
                    </form>
                </DialogContent>
                <button className="text-gray-600 hover:text-gray-900 transition"></button>
            </Dialog>
        </React.Fragment>
    );
}
