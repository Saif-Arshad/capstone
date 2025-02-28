import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { FaChevronRight, FaEdit, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Layout from '../shared/Layout';
import { Link } from 'react-router-dom';

function Customers() {
    // State for users and filters
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState('');


    const token = localStorage.getItem('token');

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Modal (Create/Edit) states
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // For toggling password visibility (create user mode)
    const [showPassword, setShowPassword] = useState(false);

    // Form data (used for Create and Edit)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: '',
    });

    // Fetch all users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Update filtered users when search or filter changes
    useEffect(() => {
        let filtered = [...users];

        if (searchText) {
            filtered = filtered.filter(
                (u) =>
                    u.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
        setPage(0);
    }, [searchText, users]);

    // ------------------ FETCH USERS ------------------
    const fetchUsers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/garage/user/get`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                throw new Error('Failed to fetch users');
            }
            const { data } = await res.json();
            console.log("🚀 ~ fetchUsers ~ data:", data)
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error fetching users');
        }
    };

    // ------------------ PAGINATION HANDLERS ------------------
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // ------------------ OPEN/ CLOSE MODALS ------------------
    const handleOpenModal = (user = null, edit = false) => {
        setSelectedUser(user);
        setIsEdit(edit);

        if (user && edit) {
            // Edit mode
            setFormData({
                fullName: user.fullName,
                email: user.email,
                password: '', // We usually don't show the current password
                role: user.role,
            });
            setShowPassword(false);
        } else {
            // Create mode: Clear form
            setFormData({
                fullName: '',
                email: '',
                password: '',
                role: '',
            });
            setShowPassword(false);
        }

        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsEdit(false);
        setSelectedUser(null);
        setShowPassword(false);
        setFormData({
            fullName: '',
            email: '',
            password: '',
            role: '',
        });
    };

    // ------------------ FORM CHANGE HANDLER ------------------
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ------------------ CREATE OR UPDATE USER ------------------
    const handleSubmit = async () => {
        if (isEdit && selectedUser) {
            // ---- EDIT USER ----
            // Typically, you'd only update certain fields (e.g., fullName, email, role, maybe password)
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${selectedUser.id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            fullName: formData.fullName,
                            email: formData.email,
                            role: formData.role,
                            // If password is not empty, we'll update it. Otherwise, skip it.
                            password: formData.password || undefined,
                        }),
                    }
                );
                if (!res.ok) {
                    throw new Error('Failed to update user');
                }
                await fetchUsers();
                toast.success('User updated successfully');
                handleCloseModal();
            } catch (error) {
                console.error('Error updating user:', error);
                toast.error('Error updating user');
            }
        } else {
            // ---- CREATE USER ----
            // We always need a password for creating a new user
            if (!formData.password) {
                toast.error('Password is required for creating a new user');
                return;
            }
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/garage/user/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,

                    },
                    body: JSON.stringify({
                        fullName: formData.fullName,
                        email: formData.email,
                        password: formData.password,
                        role: formData.role,
                    }),
                });
                if (!res.ok) {
                    throw new Error('Failed to create user');
                }
                await fetchUsers();
                toast.success('User created successfully');
                handleCloseModal();
            } catch (error) {
                console.error('Error creating user:', error);
                toast.error('Error creating user');
            }
        }
    };

    // ------------------ DELETE USER ------------------
    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`, {
                    method: 'DELETE',
                });
                if (!res.ok) {
                    throw new Error('Failed to delete user');
                }
                await fetchUsers();
                toast.success('User deleted successfully');
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Error deleting user');
            }
        }
    };

    return (
        <Layout>
            <div className="p-6">
                {/* Search & Filter */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-lg shadow-sm">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchText}
                            className="p-2 border rounded-xl cursor-pointer min-w-[300px]"
                            onChange={(e) => setSearchText(e.target.value)}
                        />

                        <button
                            onClick={() => handleOpenModal(null, false)}

                            className=" cursor-pointer bg-[#ff4d30] hover:bg-[#ff4c30d7] text-white px-4 py-2 rounded-full ml-auto"
                        >
                            + Add New Customer
                        </button>
                    </div>
                </div>

                {/* Users Table */}
                <Paper className="rounded-lg shadow-md overflow-hidden">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-50">
                                    <TableCell className="font-semibold">Customer ID</TableCell>
                                    <TableCell className="font-semibold">Full Name</TableCell>
                                    <TableCell className="font-semibold">Email</TableCell>
                                    <TableCell className="font-semibold">Role</TableCell>
                                    <TableCell align="center" className="font-semibold">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((user) => (
                                        <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell className="font-medium">{user.fullName}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm 
                          ${user.role === 'ADMIN'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : user.role === 'SUPPLIER'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : user.role === 'GARAGE'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    CUSTOMER
                                                </span>
                                            </TableCell>
                                            <TableCell align="center">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleOpenModal(user, true)}
                                                        className="px-3 py-2 cursor-pointer text-sm bg-[#ff4d30] text-white hover:text-black rounded-full hover:bg-blue-300 flex items-center gap-1"
                                                    >
                                                        <FaEdit /> Edit
                                                    </button>
                                                    <Link to={`/dashboard/my-orders?user=${user.id}`}>
                                                    <button
                                                        className="px-3 py-2 cursor-pointer text-sm bg-[#ff4d30] text-white hover:text-black rounded-full hover:bg-blue-300 flex items-center gap-1"
                                                        >
                                                        Orders
                                                        <FaChevronRight />
                                                    </button>
                                                        </Link>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="px-3 py-2 rounded-full text-sm bg-red-500 text-white hover:text-black cursor-pointer  hover:bg-red-300 flex items-center gap-1"
                                                    >
                                                        <FaTrash /> Delete
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={filteredUsers.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 20, 50]}
                    />
                </Paper>

                <Dialog
                    open={openModal}
                    onClose={handleCloseModal}
                    fullWidth
                    maxWidth="sm"
                    className="rounded-lg"
                >
                    <DialogTitle className="bg-gray-50">
                        <h2 className="text-xl font-semibold">
                            {isEdit ? 'Edit Customer' : 'Create New Customer'}
                        </h2>
                    </DialogTitle>

                    <DialogContent className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    className=" px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.fullName}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                />
                            </div>
                        </div>

                        {!isEdit && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                                        value={formData.password}
                                        onChange={handleFormChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                        )}

                  
                    </DialogContent>

                    <DialogActions className="p-4">
                        <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="px-6 cursor-pointer py-2 bg-[#ff4d30] hover:bg-[#ff4c30d7] text-white rounded-full"
                        >
                            {isEdit ? 'Update Customer' : 'Create Customer'}
                        </button>
                    
                    </DialogActions>
                </Dialog>
            </div>
        </Layout>
    );
}

export default Customers;
