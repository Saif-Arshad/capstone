import { useEffect, useState } from 'react';
import Layout from '../shared/Layout';
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
    TextField,
    CircularProgress,
    Button
} from '@mui/material';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import uploadToCloudinary from './upload';
import { toast } from 'react-toastify';

function Brands() {
    // ------------------ STATES ------------------
    const [brands, setBrands] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [searchText, setSearchText] = useState('');

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // ----- CREATE/EDIT MODAL -----
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);

    // Brand form data: name, slug and image (URL)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        image: ''
    });

    // For file upload (only one image for a brand)
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // ----- DETAIL MODAL -----
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [detailBrand, setDetailBrand] = useState(null);

    // ------------------ FETCH BRANDS ------------------
    useEffect(() => {
        fetchBrands();
    }, []);

    useEffect(() => {
        if (!searchText.trim()) {
            setFilteredBrands(brands);
        } else {
            const lowerSearch = searchText.toLowerCase();
            const filtered = brands.filter(
                (b) =>
                    b.name.toLowerCase().includes(lowerSearch) ||
                    b.slug.toLowerCase().includes(lowerSearch)
            );
            setFilteredBrands(filtered);
            setPage(0);
        }
    }, [searchText, brands]);

    const fetchBrands = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/brand`);
            if (!res.ok) {
                throw new Error('Failed to fetch brands');
            }
            const { data } = await res.json();
            setBrands(data);
            setFilteredBrands(data);
        } catch (error) {
            console.error('Error fetching brands:', error);
            toast.error('Error fetching brands');
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

    // ------------------ OPEN/CLOSE MODAL ------------------
    const handleOpenModal = (brand = null, edit = false) => {
        setSelectedBrand(brand);
        setIsEdit(edit);
        setSelectedFile(null);
        setUploadingImage(false);

        if (edit && brand) {
            // Edit mode: pre-fill form data
            setFormData({
                name: brand.name,
                slug: brand.slug,
                image: brand.image
            });
        } else {
            // Create mode: reset form
            setFormData({
                name: '',
                slug: '',
                image: ''
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsEdit(false);
        setSelectedBrand(null);
        setSelectedFile(null);
        setUploadingImage(false);
        setFormData({
            name: '',
            slug: '',
            image: ''
        });
    };

    // ------------------ DETAIL MODAL ------------------
    const handleOpenDetailModal = (brand) => {
        setDetailBrand(brand);
        setOpenDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setDetailBrand(null);
        setOpenDetailModal(false);
    };

    // ------------------ FORM HANDLER ------------------
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        // When name changes, auto-generate slug:
        if (name === 'name') {
            const slug = value.trim().toLowerCase().replace(/\s+/g, '-');
            setFormData((prev) => ({ ...prev, name: value, slug }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // ------------------ IMAGE INPUT HANDLER ------------------
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // ------------------ SUBMIT BRAND ------------------
    const handleSubmit = async () => {
        // If a new file was selected, upload it first.
        const newBrandNameLower = formData.name.trim().toLowerCase();
        const duplicate = brands.find(b => b.name.trim().toLowerCase() === newBrandNameLower);
        // In edit mode, allow if it's the same brand being edited.
        if (duplicate && (!isEdit || (isEdit && duplicate.id !== selectedBrand.id))) {
            toast.error('Brand already exists');
            return;
        }

        let imageURL = formData.image;
        if (selectedFile) {
            try {
                setUploadingImage(true);
                const result = await uploadToCloudinary(selectedFile);
                if (result?.URL) {
                    imageURL = result.URL;
                } else {
                    throw new Error('Image upload failed');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Failed to upload image');
                setUploadingImage(false);
                return;
            } finally {
                setUploadingImage(false);
            }
        }
        if (!imageURL) {
            toast.error('Please select an image');
            return;
        }

        const brandData = {
            name: formData.name,
            slug: formData.slug,
            image: imageURL,
        };

        if (isEdit && selectedBrand) {
            // ---- UPDATE BRAND ----
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/brand/${selectedBrand.id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(brandData),
                    }
                );
                if (!res.ok) {
                    throw new Error('Failed to update brand');
                }
                await fetchBrands();
                toast.success('Brand updated successfully');
                handleCloseModal();
            } catch (error) {
                console.error('Error updating brand:', error);
                toast.error('Error updating brand');
            }
        } else {
            // ---- CREATE BRAND ----
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/brand`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(brandData),
                });
                if (!res.ok) {
                    throw new Error('Failed to create brand');
                }
                await fetchBrands();
                toast.success('Brand created successfully');
                handleCloseModal();
            } catch (error) {
                console.error('Error creating brand:', error);
                toast.error('Error creating brand');
            }
        }
    };

    // ------------------ DELETE BRAND ------------------
    const handleDeleteBrand = async (brandId) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/brand/${brandId}`,
                    {
                        method: 'DELETE',
                    }
                );
                if (!res.ok) {
                    throw new Error('Failed to delete brand');
                }
                await fetchBrands();
                toast.success('Brand deleted successfully');
            } catch (error) {
                console.error('Error deleting brand:', error);
                toast.error('Error deleting brand');
            }
        }
    };

    // ------------------ RENDER ------------------
    return (
        <Layout>
            <div className="p-6">
                {/* SEARCH + CREATE BUTTON */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-lg shadow-sm">
                        <input
                            type="text"
                            placeholder="Search brands..."
                            className="p-2 border rounded-xl min-w-[300px]"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <button
                            onClick={() => handleOpenModal(null, false)}

                            className=" cursor-pointer bg-[#ff4d30] hover:bg-[#ff4c30d7] text-white px-4 py-2 rounded-full ml-auto"
                        >
                            Add New Brand
                        </button>

                    </div>
                </div>

                <Paper className="rounded-lg shadow-md overflow-hidden">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-50">
                                    <TableCell className="font-semibold">Name</TableCell>
                                    <TableCell className="font-semibold">Slug</TableCell>
                                    <TableCell className="font-semibold">Image</TableCell>
                                    <TableCell align="center" className="font-semibold">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredBrands
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((brand) => (
                                        <TableRow key={brand.id} className="hover:bg-gray-50 transition-colors">
                                            <TableCell className="font-medium">{brand.name}</TableCell>
                                            <TableCell className="font-medium">{brand.slug}</TableCell>
                                            <TableCell>
                                                {brand.image ? (
                                                    <img src={brand.image} alt={brand.name} className="w-10 h-10 object-cover rounded" />
                                                ) : (
                                                    <span className="text-gray-400">No image</span>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <div className="flex gap-2 justify-center">
                                                    {/* Detail Button */}
                                                    <button
                                                        onClick={() => handleOpenDetailModal(brand)}
                                                        className="px-3 py-2 cursor-pointer text-sm bg-gray-500 text-white hover:text-black rounded-full hover:bg-gray-200 flex items-center gap-1"
                                                    >
                                                        <FaEye /> Detail
                                                    </button>
                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={() => handleOpenModal(brand, true)}
                                                        className="px-3 py-2 cursor-pointer text-sm bg-blue-500 text-white hover:text-black rounded-full hover:bg-blue-200 flex items-center gap-1"
                                                    >
                                                        <FaEdit /> Edit
                                                    </button>
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDeleteBrand(brand.id)}
                                                        className="px-3 py-1 text-sm bg-red-500 text-white hover:text-black cursor-pointer rounded-full hover:bg-red-300 flex items-center gap-1"
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
                        count={filteredBrands.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 20, 50]}
                    />
                </Paper>

                {/* CREATE/EDIT MODAL */}
                <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
                    <DialogTitle className="bg-gray-50">
                        <h2 className="text-xl font-semibold">{isEdit ? 'Edit Brand' : 'Create Brand'}</h2>
                    </DialogTitle>
                    <DialogContent className="pt-4 flex flex-col gap-y-4">
                        <TextField
                            label="Brand Name"
                            name="name"
                            fullWidth
                            variant="outlined"
                            value={formData.name}
                            onChange={handleFormChange}
                        />
                        <TextField
                            label="Slug"
                            name="slug"
                            fullWidth
                            variant="outlined"
                            value={formData.slug}
                            disabled
                        />
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Image
                            </label>
                            <input
                                type="file"
                                onChange={handleFileSelect}
                                className="border p-2 rounded w-full"
                            />

                            {formData.image && (
                                <div className="mt-2 flex items-center gap-2">
                                    <img src={formData.image} alt="brand" className="w-16 h-16 object-cover border rounded" />
                                    <span className="text-sm">Image uploaded</span>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                    <DialogActions className="p-4">
                        <Button onClick={handleCloseModal} variant="outlined">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {uploadingImage ? (
                                <div className="mt-2">
                                    <CircularProgress
                                    sx={{ color: 'white' }}
                                    size={24} />
                                </div>
                            )
                                :
                                isEdit ? 'Update Brand' : 'Create Brand'
                            }
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* DETAIL MODAL */}
                <Dialog open={openDetailModal} onClose={handleCloseDetailModal} fullWidth maxWidth="sm">
                    <DialogTitle className="bg-gray-50">
                        <h2 className="text-xl font-semibold">Brand Detail</h2>
                    </DialogTitle>
                    <DialogContent className="mt-4 space-y-4">
                        {detailBrand && (
                            <>
                                <p>
                                    <strong>ID:</strong> {detailBrand.id}
                                </p>
                                <p>
                                    <strong>Name:</strong> {detailBrand.name}
                                </p>
                                <p>
                                    <strong>Slug:</strong> {detailBrand.slug}
                                </p>
                                <div>
                                    <strong>Image:</strong>
                                    {detailBrand.image ? (
                                        <div className="flex gap-2 mt-2">
                                            <img
                                                src={detailBrand.image}
                                                alt={detailBrand.name}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">No image</p>
                                    )}
                                </div>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions className="p-4">
                        <Button onClick={handleCloseDetailModal} variant="outlined">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Layout>
    );
}

export default Brands;
