import { useEffect, useState, useRef } from 'react';
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
    MenuItem,
    Button,
    Autocomplete
} from '@mui/material';
import { FaEdit, FaTrash, FaEye, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import uploadToCloudinary from '../Admin/upload';

function MyProducts() {
    // ------------------ BRANDS ------------------
    const [brands, setBrands] = useState([]);

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
            // toast.error('Error fetching brands');
        }
    };

    // ------------------ PRODUCTS ------------------
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchText, setSearchText] = useState('');

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // ----- CREATE/EDIT MODAL -----
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    // Two-step form: step 1 for details, step 2 for images
    const [step, setStep] = useState(1);

    // Product form data – note colors and sizes are now arrays
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        images: [],
        colors: [],
        sizes: [],
        embedLink: ''
    });

    // For file uploads (multiple images)
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);

    // Reference for the hidden file input
    const fileInputRef = useRef(null);

    // ----- DETAIL MODAL -----
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [detailProduct, setDetailProduct] = useState(null);

    // ------------------ FETCH DATA ------------------
    const fetchProducts = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`);
            if (!res.ok) {
                throw new Error('Failed to fetch products');
            }
            const { data } = await res.json();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error fetching products');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchBrands();
    }, []);

    useEffect(() => {
        if (!searchText.trim()) {
            setFilteredProducts(products);
        } else {
            const lowerSearch = searchText.toLowerCase();
            const filtered = products.filter(
                (p) =>
                    p.name.toLowerCase().includes(lowerSearch) ||
                    p.description.toLowerCase().includes(lowerSearch)
            );
            setFilteredProducts(filtered);
            setPage(0);
        }
    }, [searchText, products]);

    // ------------------ PAGINATION HANDLERS ------------------
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // ------------------ OPEN/CLOSE MODAL ------------------
    const handleOpenModal = (product = null, edit = false) => {
        setSelectedProduct(product);
        setIsEdit(edit);
        setSelectedFiles([]);
        setUploadingImages(false);
        setStep(1); // Always start at step 1

        if (edit && product) {
            // Edit mode: pre-fill form data
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                category: product.category,
                images: product.images?.map((img) => img.url) || [],
                colors: Array.isArray(product.availableColor) ? product.availableColor : [],
                sizes: Array.isArray(product.availableSizes) ? product.availableSizes : [],
                embedLink: product.EmbedLink || ''
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                quantity: '',
                category: '',
                images: [],
                colors: [],
                sizes: [],
                embedLink: ''
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsEdit(false);
        setSelectedProduct(null);
        setSelectedFiles([]);
        setUploadingImages(false);
        setStep(1);
        setFormData({
            name: '',
            description: '',
            price: '',
            quantity: '',
            category: '',
            images: [],
            colors: [],
            sizes: [],
            embedLink: ''
        });
    };

    // ------------------ DETAIL MODAL ------------------
    const handleOpenDetailModal = (product) => {
        setDetailProduct(product);
        setOpenDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setDetailProduct(null);
        setOpenDetailModal(false);
    };

    // ------------------ FORM HANDLER ------------------
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ------------------ STEP HANDLERS ------------------
    const handleNextStep = () => {
        // Basic validation for step 1 fields
        if (
            !formData.name ||
            !formData.description ||
            !formData.price ||
            !formData.quantity ||
            !formData.category
        ) {
            toast.error('Please fill all required fields before proceeding.');
            return;
        }

        // Validate price (must be > 0)
        const parsedPrice = parseFloat(formData.price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            toast.error('Price must be greater than 0.');
            return;
        }

        // Validate quantity (must be 0 or more)
        const parsedQuantity = parseInt(formData.quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity < 0) {
            toast.error('Quantity cannot be negative.');
            return;
        }

        setStep(2);
    };

    const handleBackStep = () => {
        setStep(1);
    };

    // ------------------ IMAGE UPLOAD (STEP 2) ------------------
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleUploadImages = async () => {
        if (selectedFiles.length === 0) {
            toast.error('No files selected');
            return;
        }
        try {
            setUploadingImages(true);
            const uploadedUrls = [];
            for (const file of selectedFiles) {
                const result = await uploadToCloudinary(file);
                if (result?.URL) {
                    uploadedUrls.push(result.URL);
                }
            }
            // Merge new uploaded images with any previously uploaded ones
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls]
            }));
            setSelectedFiles([]);
            toast.success('Images uploaded successfully');
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error('Failed to upload images');
        } finally {
            setUploadingImages(false);
        }
    };

    // ------------------ DELETE AN UPLOADED IMAGE ------------------
    const handleDeleteImage = (index) => {
        setFormData((prev) => {
            const updated = [...prev.images];
            updated.splice(index, 1);
            return { ...prev, images: updated };
        });
    };

    // ------------------ SUBMIT PRODUCT ------------------
    const handleSubmit = async () => {
        // Ensure at least one image is uploaded
        if (formData.images.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }
        // Convert price and quantity to numeric values
        const parsedPrice = parseFloat(formData.price);
        const parsedQuantity = parseInt(formData.quantity, 10);

        const productData = {
            name: formData.name,
            description: formData.description,
            price: isNaN(parsedPrice) ? 0 : parsedPrice,
            quantity: isNaN(parsedQuantity) ? 0 : parsedQuantity,
            category: formData.category,
            images: formData.images, // array of image URLs
            colors: formData.colors, // already an array
            sizes: formData.sizes,   // already an array
            embedLink: formData.embedLink.trim() || null
        };

        if (isEdit && selectedProduct) {
            // ---- UPDATE PRODUCT ----
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${selectedProduct.id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(productData)
                    }
                );
                if (!res.ok) {
                    throw new Error('Failed to update product');
                }
                await fetchProducts();
                toast.success('Product updated successfully');
                handleCloseModal();
            } catch (error) {
                console.error('Error updating product:', error);
                toast.error('Error updating product');
            }
        } else {
            // ---- CREATE PRODUCT ----
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                if (!res.ok) {
                    throw new Error('Failed to create product');
                }
                await fetchProducts();
                toast.success('Product created successfully');
                handleCloseModal();
            } catch (error) {
                console.error('Error creating product:', error);
                toast.error('Error creating product');
            }
        }
    };

    // ------------------ DELETE PRODUCT ------------------
    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${productId}`,
                    { method: 'DELETE' }
                );
                if (!res.ok) {
                    throw new Error('Failed to delete product');
                }
                await fetchProducts();
                toast.success('Product deleted successfully');
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Error deleting product');
            }
        }
    };

    // ------------------ PREMADE COLORS ------------------
    const availableColors = ['Carbon fibre', 'Forged carbon fibre ','Metallic black ','Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple'];

    // ------------------ RENDER ------------------
    return (
        <Layout>
            <div className="p-6">
                {/* SEARCH + CREATE BUTTON */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-lg shadow-sm">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="p-2 border rounded-xl min-w-[300px]"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <button
                            onClick={() => handleOpenModal(null, false)}
                            className="cursor-pointer bg-[#ff4d30] hover:bg-[#ff4c30d7] text-white px-4 py-2 rounded-full ml-auto"
                        >
                            Add New Product
                        </button>
                    </div>
                </div>

                <Paper className="rounded-lg shadow-md overflow-hidden">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-50">
                                    <TableCell className="font-semibold">Name</TableCell>
                                    <TableCell className="font-semibold">Brand</TableCell>
                                    <TableCell className="font-semibold">Price</TableCell>
                                    <TableCell className="font-semibold">Quantity</TableCell>
                                    <TableCell className="font-semibold">Images</TableCell>
                                    <TableCell align="center" className="font-semibold">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProducts.length > 0 &&
                                    filteredProducts
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((product) => (
                                            <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell className="font-medium capitalize">{product.category}</TableCell>
                                                <TableCell>{product.price} AED</TableCell>
                                                <TableCell>{product.quantity}</TableCell>
                                                <TableCell>
                                                    {product.images && product.images.length > 0 ? (
                                                        <div className="flex gap-2">
                                                            {product.images.slice(0, 2).map((img) => (
                                                                <img
                                                                    key={img.id}
                                                                    src={img.url}
                                                                    alt="product"
                                                                    className="w-10 h-10 object-cover rounded"
                                                                />
                                                            ))}
                                                            {product.images.length > 2 && (
                                                                <span className="text-sm">
                                                                    +{product.images.length - 2} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">No images</span>
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <div className="flex gap-2 justify-center">
                                                        {/* Detail Button */}
                                                        <button
                                                            onClick={() => handleOpenDetailModal(product)}
                                                            className="px-3 py-2 cursor-pointer text-sm bg-gray-500 text-white hover:text-black rounded-full hover:bg-gray-200 flex items-center gap-1"
                                                        >
                                                            <FaEye /> Detail
                                                        </button>
                                                        {/* Edit Button */}
                                                        <button
                                                            onClick={() => handleOpenModal(product, true)}
                                                            className="px-3 py-2 cursor-pointer text-sm bg-blue-500 text-white hover:text-black rounded-full hover:bg-blue-200 flex items-center gap-1"
                                                        >
                                                            <FaEdit /> Edit
                                                        </button>
                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id)}
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
                        count={filteredProducts.length}
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
                        <h2 className="text-xl font-semibold">
                            {isEdit ? 'Edit Product' : 'Create Product'}
                        </h2>
                    </DialogTitle>
                    <DialogContent className="pt-4 flex flex-col gap-y-4">
                        {step === 1 && (
                            <>
                                <TextField
                                    label="Product Name"
                                    name="name"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                />
                                <TextField
                                    label="Description"
                                    name="description"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                />
                                <TextField
                                    select
                                    label="Select Brand"
                                    name="category"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.category}
                                    onChange={handleFormChange}
                                >
                                    {brands.map((brand) => (
                                        <MenuItem key={brand.id} value={brand.slug}>
                                            {brand.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <TextField
                                        label="Price"
                                        name="price"
                                        type="number"
                                        variant="outlined"
                                        value={formData.price}
                                        onChange={handleFormChange}
                                    />
                                    <TextField
                                        label="Quantity"
                                        name="quantity"
                                        type="number"
                                        variant="outlined"
                                        value={formData.quantity}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <Autocomplete
                                    multiple
                                    options={availableColors}
                                    value={formData.colors}
                                    onChange={(event, newValue) =>
                                        setFormData((prev) => ({ ...prev, colors: newValue }))
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} label="Available Colors" variant="outlined" />
                                    )}
                                />
                                <Autocomplete
                                    multiple
                                    freeSolo
                                    options={[]}
                                    value={formData.sizes}
                                    onChange={(event, newValue) =>
                                        setFormData((prev) => ({ ...prev, sizes: newValue }))
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} label="Available Sizes" variant="outlined" />
                                    )}
                                />
                            </>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Images
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                            className="inline-flex items-center cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Choose File
                                        </button>
                                        {selectedFiles.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={handleUploadImages}
                                                disabled={uploadingImages}
                                                className="inline-flex items-center cursor-pointer"
                                            >
                                                {uploadingImages ? (
                                                    <CircularProgress size={16} style={{ marginRight: 8 }} />
                                                ) : (
                                                    <FaCheck size={20} />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                                <div className="flex pb-4 gap-2 flex-wrap">
                                    {formData.images.map((url, idx) => (
                                        <div key={idx} className="relative">
                                            <img
                                                src={url}
                                                alt="product-img"
                                                className="w-16 h-16 object-cover border rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteImage(idx)}
                                                className="absolute cursor-pointer flex items-center justify-center top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1"
                                            >
                                                x
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <TextField
                                    label="Embed Link (optional)"
                                    name="embedLink"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    value={formData.embedLink}
                                    onChange={handleFormChange}
                                />
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions className="p-4">
                        {step === 1 && (
                            <>
                                <Button onClick={handleCloseModal} variant="outlined">
                                    Cancel
                                </Button>
                                <Button onClick={handleNextStep} variant="contained" color="primary">
                                    Next
                                </Button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <Button onClick={handleBackStep} variant="outlined">
                                    Back
                                </Button>
                                <Button onClick={handleSubmit} variant="contained" color="primary">
                                    {isEdit ? 'Update Product' : 'Create Product'}
                                </Button>
                            </>
                        )}
                    </DialogActions>
                </Dialog>

                {/* DETAIL MODAL */}
                <Dialog open={openDetailModal} onClose={handleCloseDetailModal} fullWidth maxWidth="sm">
                    <DialogTitle className="bg-gray-50">
                        <h2 className="text-xl font-semibold">Product Detail</h2>
                    </DialogTitle>
                    <DialogContent className="mt-4 space-y-4">
                        {detailProduct && (
                            <>
                                <p>
                                    <strong>ID:</strong> {detailProduct.id}
                                </p>
                                <p>
                                    <strong>Name:</strong> {detailProduct.name}
                                </p>
                                <p>
                                    <strong>Description:</strong> {detailProduct.description}
                                </p>
                                <p>
                                    <strong>Price:</strong> {detailProduct.price} AED
                                </p>
                                <p>
                                    <strong>Quantity:</strong> {detailProduct.quantity}
                                </p>
                                <div>
                                    <strong>Images:</strong>
                                    {detailProduct.images && detailProduct.images.length > 0 ? (
                                        <div className="flex gap-2 mt-2 flex-wrap">
                                            {detailProduct.images.map((img) => (
                                                <img
                                                    key={img.id}
                                                    src={img.url}
                                                    alt="product"
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">No images</p>
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

export default MyProducts;
