import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import { IoIosArrowForward } from 'react-icons/io';
import { toast } from 'react-toastify';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Login() {
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, formData);
            console.log('Login successful:', response.data);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user-automobile', JSON.stringify(user));
            localStorage.setItem('user-role', JSON.stringify(user.role));

            toast.success('Login successful');
            window.location.reload();
            handleClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>

            <button onClick={handleClickOpen} className="hover:text-[#ff4d30] cursor-pointer transition-all duration-300 ease-linear">
                Sign In
            </button>

            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="register-dialog"
            >
                <div className='flex items-start pl-10 pt-8 flex-col justify-start'>

                    <h1 className=" text-left font-bold text-2xl">Signin</h1>
                    <p>
                        Login Your Account
                    </p>
                </div>
                <DialogContent>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <form onSubmit={handleSubmit} className="flex flex-col w-full sm:min-w-[400px] gap-4 p-4">

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded focus:outline-none ring-1 ring-[#ff4d30]"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded focus:outline-none mb-6 ring-1 ring-[#ff4d30]"
                            required
                        />
                        <div className="flex flex-col lg:flex-row justify-end text-white font-bold gap-6">
                            <button
                                onClick={handleClose}
                                type='button'
                                className="bg-[#ff4d30] flex cursor-pointer items-center gap-2 justify-center py-4 px-4 lg:px-8 shadow-orange-bottom hover:shadow-orange-bottom-hov transition-all duration-300 ease-linear rounded border-2 border-custom-orange"
                            >
                                <span>Close</span>

                            </button>
                            <button
                                disabled={loading}
                                type='submit'
                                className="bg-black cursor-pointer flex items-center gap-2 justify-center py-4 px-4 lg:px-8 transition-all duration-300 ease-linear hover:bg-transparent hover:text-black rounded border-2 border-black"
                            >
                                <span>                            {loading ? 'Processing...' : 'Login'}
                                </span>
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
