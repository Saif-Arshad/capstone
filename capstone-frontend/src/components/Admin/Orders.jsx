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
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Orders() {
  // ------------------ STATES ------------------
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState('');
  const role = localStorage.getItem("user-role");

  const userRole = role.replace(/"/g, "");

  const isSupplier = userRole =="SUPPLIER"
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal for order details and updating status
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Modal for displaying order items
  const [openItemsModal, setOpenItemsModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  console.log("🚀 ~ Orders ~ selectedItems:", selectedItems)

  // Order status options matching your Prisma enum OrderStatus
  const orderStatusOptions = [
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ];

  // ------------------ FETCH ORDERS ------------------
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredOrders(orders);
    } else {
      const lowerSearch = searchText.toLowerCase();
      const filtered = orders.filter((order) =>
        order.id.toLowerCase().includes(lowerSearch) ||
        order.userId.toLowerCase().includes(lowerSearch) ||
        order.status.toLowerCase().includes(lowerSearch)
      );
      setFilteredOrders(filtered);
      setPage(0);
    }
  }, [searchText, orders]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      const { data } = await res.json();
      setOrders(data);
      console.log("🚀 ~ fetchOrders ~ data:", data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders');
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

  // ------------------ MODAL HANDLERS FOR ORDER DETAIL ------------------
  const handleOpenDetailModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status); // Pre-fill with current status
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedOrder(null);
    setOpenDetailModal(false);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/update/${selectedOrder.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId: selectedOrder.id, status: newStatus }),
        }
      );
      if (!res.ok) {
        throw new Error('Failed to update order status');
      }
      const { data } = await res.json();
      toast.success('Order status updated successfully');

      // Update the order in the state arrays
      setOrders(orders.map((order) => (order.id === data.id ? data : order)));
      setFilteredOrders(filteredOrders.map((order) => (order.id === data.id ? data : order)));
      handleCloseDetailModal();
    } catch (error) {
      console.error('Update order status error:', error);
      toast.error('Update order status error');
    }
  };

  // ------------------ MODAL HANDLERS FOR ORDER ITEMS ------------------
  const handleOpenItemsModal = (items) => {
    setSelectedItems(items);
    setOpenItemsModal(true);
  };

  const handleCloseItemsModal = () => {
    setSelectedItems([]);
    setOpenItemsModal(false);
  };

  // ------------------ RENDER ------------------
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-lg shadow-sm">
            <input
              type="text"
              placeholder="Search orders..."
              className="p-2 border rounded-xl min-w-[300px]"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        <Paper className="rounded-lg shadow-md overflow-hidden">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-50">
                  <TableCell className="font-semibold">Order ID</TableCell>
                  <TableCell className="font-semibold">Total Price</TableCell>
                  <TableCell className="font-semibold">Status</TableCell>
                  <TableCell className="font-semibold">City</TableCell>
                  <TableCell className="font-semibold">Country</TableCell>
                  <TableCell align="center" className="font-semibold">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.totalPrice} AED</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>{order.city}</TableCell>
                      <TableCell>{order.country}</TableCell>
                      <TableCell align="center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleOpenDetailModal(order)}
                            className="px-3 py-2 cursor-pointer text-sm bg-gray-500 text-white hover:text-black rounded-full hover:bg-gray-200 flex items-center gap-1"
                          >
                            <FaEye /> Detail
                          </button>
                          <button
                            onClick={() => handleOpenItemsModal(order.items)}
                            className="px-3 py-2 cursor-pointer text-sm bg-green-500 text-white hover:text-black rounded-full hover:bg-green-200 flex items-center gap-1"
                          >
                            Items
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
            count={filteredOrders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 20, 50]}
          />
        </Paper>

        {/* Detail and Update Status Modal */}
        <Dialog open={openDetailModal} onClose={handleCloseDetailModal} fullWidth maxWidth="sm">
          <DialogTitle className="bg-gray-50">
            <h2 className="text-xl font-semibold">Order Detail & Update Status</h2>
          </DialogTitle>
          <DialogContent className="mt-4 space-y-4">
            {selectedOrder && (
              <>
                <p>
                  <strong>Order ID:</strong> {selectedOrder.id}
                </p>
                <p>
                  <strong>User ID:</strong> {selectedOrder.userId}
                </p>
                <p>
                  <strong>Total Price:</strong> {selectedOrder.totalPrice} AED
                </p>
                <p>
                  <strong>Status:</strong> {selectedOrder.status}
                </p>
                <p>
                  <strong>City:</strong> {selectedOrder.city}
                </p>
                <p>
                  <strong>Country:</strong> {selectedOrder.country}
                </p>
                <p>
                  <strong>Address:</strong> {selectedOrder.address}
                </p>
                {
                  isSupplier &&
                <FormControl fullWidth>
                  <InputLabel id="order-status-label">Update Status</InputLabel>
                  <Select
                    labelId="order-status-label"
                    id="order-status"
                    value={newStatus}
                    label="Update Status"
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {orderStatusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                }
              </>
            )}
          </DialogContent>
          <DialogActions className="p-4">
            <Button onClick={handleCloseDetailModal} color="secondary" variant="outlined">
              Close
            </Button>
            {
              isSupplier &&
            <Button onClick={handleUpdateStatus} color="primary" variant="contained">
              Update Status
            </Button>
            }
          </DialogActions>
        </Dialog>

        {/* Order Items Modal */}
        <Dialog open={openItemsModal} onClose={handleCloseItemsModal} fullWidth maxWidth="md">
          <DialogTitle className="bg-gray-50">
            <h2 className="text-xl font-semibold">Order Items</h2>
          </DialogTitle>
          <DialogContent>
            {selectedItems && selectedItems.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Color </TableCell>
                      <TableCell>Size </TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Category</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productId}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.price} AED</TableCell>
                        <TableCell>
                          {
                            item.selectedColor ?
                              item.selectedColor : "Not Selected"
                          }
                        </TableCell>
                        <TableCell>
                          {
                            item.selectedSize ?
                              item.selectedSize : "Not Selected"
                          }
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.category}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <p>No items available.</p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseItemsModal} color="primary" variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
}

export default Orders;
