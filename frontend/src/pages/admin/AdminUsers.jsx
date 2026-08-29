import React, { useEffect, useState } from 'react';
import { adminAuthApi } from '../../api/adminAuthApi';
import { toast } from 'react-toastify';
import { Users, Shield, User, Search, ChevronDown, Info } from 'lucide-react';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await adminAuthApi.getUsers();
      setUsers(response.data?.data || response.data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      await adminAuthApi.updateUserRole(id, newRole);
      toast.success('Role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'ADMIN').length;
  const customerUsers = users.filter(u => u.role === 'CUSTOMER').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="admin-users-wrapper">


      <section className="d1">
        <div className="page-title">User Management</div>
        <div className="page-sub">Manage administrators and customers.</div>
      </section>

      <section className="stats d1">
        <div className="stat-card">
          <div className="stat-icon ic-blue"><Users /></div>
          <div><div className="stat-value">{totalUsers}</div><div className="stat-label">Total users</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon ic-purple"><Shield /></div>
          <div><div className="stat-value">{adminUsers}</div><div className="stat-label">Administrators</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon ic-green"><User /></div>
          <div><div className="stat-value">{customerUsers}</div><div className="stat-label">Customers</div></div>
        </div>
      </section>

      <section className="toolbar d1">
        <div className="search-box">
          <Search />
          <input type="text" placeholder="Search by name or email…" />
        </div>
        <div className="filter-chip">Role: All <ChevronDown /></div>
        <div className="results-count">Showing <b>{totalUsers}</b> users</div>
      </section>

      <section className="d2">
        <div className="table-card">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isOnlyAdmin = user.role === 'ADMIN' && adminUsers <= 1;
                  const initial = user.userName ? user.userName.charAt(0).toUpperCase() : 'U';

                  return (
                    <tr key={user.id}>
                      <td className="id-cell">#{user.id}</td>
                      <td className="name-cell">
                        <span className="user-avatar">{initial}</span>
                        {user.userName}
                      </td>
                      <td className="email-cell">{user.email}</td>
                      <td>
                        {user.role === 'ADMIN' ? (
                          <span className="role-pill role-admin"><Shield /> Admin</span>
                        ) : (
                          <span className="role-pill role-customer"><User /> Customer</span>
                        )}
                      </td>
                      <td>
                        {user.role === 'CUSTOMER' ? (
                          <button 
                            className="action-btn btn-make-admin"
                            onClick={() => handleRoleChange(user.id, 'ADMIN')}
                          >
                            <Shield /> Make Admin
                          </button>
                        ) : (
                          <button 
                            className={`action-btn btn-revoke ${isOnlyAdmin ? 'disabled' : ''}`}
                            onClick={() => !isOnlyAdmin && handleRoleChange(user.id, 'CUSTOMER')}
                            title={isOnlyAdmin ? "Can't revoke — at least one administrator must remain" : ""}
                          >
                            <User /> Revoke Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-foot">
            <Info />
            The last remaining administrator can't be revoked, to prevent losing console access.
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminUsers;
