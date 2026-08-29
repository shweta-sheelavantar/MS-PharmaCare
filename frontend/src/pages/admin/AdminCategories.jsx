import React, { useEffect, useState } from 'react';
import { adminAuthApi } from '../../api/adminAuthApi';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, X, Layout, Package, AlertCircle } from 'lucide-react';
import './AdminCategories.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        adminAuthApi.getCategories(),
        adminAuthApi.getMedicines()
      ]);
      setCategories(catRes.data?.data || catRes.data || []);
      setProducts(prodRes.data?.data || prodRes.data || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id, productCount) => {
    if (productCount > 0) return; // Prevent deletion if products exist (mockup logic)
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await adminAuthApi.deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await adminAuthApi.updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        await adminAuthApi.addCategory(formData);
        toast.success('Category added successfully');
      }
      closeModal();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-500"></div>
      </div>
    );
  }

  const uncategorizedCount = products.filter(p => !p.category && !p.categoryId).length;

  return (
    <div className="admin-categories-wrapper">
      <section className="page-head d1">
        <div>
          <div className="page-title">Category Management</div>
          <div className="page-sub">Organize products into functional groups.</div>
        </div>
        <button className="add-btn" onClick={() => openModal()}>
          <Plus />
          Add Category
        </button>
      </section>

      <section className="stats d1">
        <div className="stat-card">
          <div className="stat-icon ic-blue"><Layout /></div>
          <div>
            <div className="stat-value">{categories.length}</div>
            <div className="stat-label">Total categories</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon ic-green"><Package /></div>
          <div>
            <div className="stat-value">{products.length}</div>
            <div className="stat-label">Total products</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon ic-amber"><AlertCircle /></div>
          <div>
            <div className="stat-value">{uncategorizedCount > 0 ? uncategorizedCount : '—'}</div>
            <div className="stat-label">Uncategorized products</div>
          </div>
        </div>
      </section>

      <section className="d2">
        <div className="table-card">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Products</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  const productCount = category.productCount || 0;
                  const canDelete = productCount === 0;

                  return (
                    <tr key={category.id}>
                      <td className="id-cell">#{category.id}</td>
                      <td className="name-cell">{category.name}</td>
                      <td>
                        <span className="count-pill">{productCount} products</span>
                      </td>
                      <td>
                        {category.description ? (
                          <span className="desc-text text-sm text-slate-600">{category.description}</span>
                        ) : (
                          <span className="desc-empty">No description added</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        <div className="icon-action icon-edit" onClick={() => openModal(category)}>
                          <Edit2 />
                        </div>
                        <div 
                          className={`icon-action icon-del ${!canDelete ? 'disabled' : ''}`} 
                          title={!canDelete ? "Cannot delete — category has products" : "Delete category"}
                          onClick={() => handleDelete(category.id, productCount)}
                        >
                          <Trash2 />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-foot">
            <AlertCircle size={14} />
            Categories with products can't be deleted until their products are reassigned or removed.
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="scrim">
          <div className="modal">
            <div className="modal-head">
              <div className="modal-title-row">
                <div className="modal-icon">
                  <Layout />
                </div>
                <div>
                  <div className="modal-title">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </div>
                  <div className="modal-sub">Fields marked with * are required</div>
                </div>
              </div>
              <button className="close-btn" onClick={closeModal}>
                <X />
              </button>
            </div>
            
            <div className="modal-body">
              <form id="categoryForm" onSubmit={handleSubmit}>
                <div className="form-section">
                  <div className="section-label">Basic Information</div>
                  <div className="field">
                    <label className="field-label">Category Name <span className="req">*</span></label>
                    <input
                      className="field-input"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Painkillers"
                    />
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label className="field-label">Description <span className="opt">Optional</span></label>
                    <textarea
                      className="field-textarea"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Optional description of the category..."
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="modal-foot">
              <button type="button" className="btn btn-cancel" onClick={closeModal}>Cancel</button>
              <button type="submit" form="categoryForm" className="btn btn-create">
                <Plus />
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
