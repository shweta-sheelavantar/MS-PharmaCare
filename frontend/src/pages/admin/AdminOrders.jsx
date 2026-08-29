import React, { useEffect, useState } from 'react';
import { adminAuthApi } from '../../api/adminAuthApi';
import { toast } from 'react-toastify';
import { Search, ChevronDown, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await adminAuthApi.getOrders();
      setOrders(response.data?.data || response.data || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminAuthApi.updateOrderStatus(id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const getBadgeClass = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING': return 'b-pending';
      case 'CONFIRMED': return 'b-confirmed';
      case 'PACKED': return 'b-packed';
      case 'SHIPPED': return 'b-shipped';
      case 'DELIVERED': return 'b-delivered';
      case 'CANCELLED': return 'b-cancelled';
      default: return 'b-pending';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="admin-orders-wrapper">

    
      <section className="d1">
        <div className="page-title">Order Management</div>
        <div className="page-sub">Track and update customer orders.</div>
      </section>
    
      <section className="toolbar d1">
        <div className="search-box">
          <Search />
          <input type="text" placeholder="Search order ID or customer…" />
        </div>
        <div className="filter-chip">Status: All <ChevronDown /></div>
        <div className="filter-chip">Date range <ChevronDown /></div>
        <div className="results-count">Showing <b>{orders.length}</b> orders</div>
      </section>
    
      <section className="d2">
        <div className="table-card">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const avatarInitial = order.userName ? order.userName.charAt(0).toUpperCase() : 'U';
                  
                  return (
                    <tr key={order.orderId}>
                      <td className="id-cell">#{order.orderId?.slice(0, 8)}</td>
                      <td>
                        <div className="cust-cell">
                          <span className="cust-avatar">{avatarInitial}</span>
                          {order.userName || 'Unknown'}
                        </div>
                      </td>
                      <td className="date-cell">
                        {order.orderDate ? (
                          new Date(order.orderDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        ) : (
                          <span className="date-missing"><AlertTriangle /> Date unavailable</span>
                        )}
                      </td>
                      <td className="amt-cell">${Number(order.totalAmount || 0).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${getBadgeClass(order.orderStatus)}`}>
                          <span className="badge-dot"></span>
                          {order.orderStatus ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1).toLowerCase() : ''}
                        </span>
                      </td>
                      <td>
                        <div className="status-select-wrap">
                          <select 
                            className="status-select"
                            value={order.orderStatus?.toUpperCase() || 'PENDING'}
                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PACKED">Packed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                          <ChevronDown />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-foot">
            <div className="foot-info">Showing {orders.length > 0 ? 1 : 0}–{orders.length} of {orders.length} orders</div>
            <div className="pagination">
              <div className="page-btn"><ChevronLeft size={16} /></div>
              <div className="page-btn active">1</div>
              <div className="page-btn"><ChevronRight size={16} /></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminOrders;
