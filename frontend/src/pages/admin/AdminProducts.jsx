import React, { useEffect, useState } from 'react';
import { adminAuthApi } from '../../api/adminAuthApi';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, X, Search, ChevronDown, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    manufacturer: '',
    categoryId: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await adminAuthApi.getMedicines();
      setProducts(response.data?.data || response.data || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminAuthApi.getCategories();
      setCategories(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminAuthApi.deleteMedicine(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        manufacturer: product.manufacturer || '',
        categoryId: product.categoryId || product.category?.id || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', description: '', price: '', stock: '', manufacturer: '', categoryId: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await adminAuthApi.updateMedicine(editingProduct.id, formData);
        toast.success('Product updated successfully');
      } else {
        await adminAuthApi.addMedicine(formData);
        toast.success('Product added successfully');
      }
      closeModal();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const filteredProducts = products.filter(p => {
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterCategory && p.category?.id !== parseInt(filterCategory)) return false;
    if (filterStock === 'in-stock' && p.stock <= 0) return false;
    if (filterStock === 'out-of-stock' && p.stock > 0) return false;
    if (filterStock === 'low-stock' && (p.stock > 10 || p.stock === 0)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="admin-products-wrapper">
      <section className="page-head d1">
        <div>
          <div className="page-title">Products Catalog</div>
          <div className="page-sub">Manage medicines and inventory.</div>
        </div>
        <button className="add-btn" onClick={() => openModal()}>
          <Plus />
          Add Product
        </button>
      </section>

      <section className="toolbar d1">
        <div className="search-box">
          <Search />
          <input 
            type="text" 
            placeholder="Search products by name…" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-chip">
          Category: 
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="">All</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <ChevronDown />
        </div>
        <div className="filter-chip">
          Stock:
          <select value={filterStock} onChange={e => setFilterStock(e.target.value)}>
            <option value="">All</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <ChevronDown />
        </div>
        <div className="results-count">Showing <b>{filteredProducts.length}</b> products</div>
      </section>

      <section className="d2">
        <div className="table-card">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.slice((currentPage - 1) * 20, currentPage * 20).map((product) => (
                  <tr key={product.id}>
                    <td className="id-cell">#{product.id}</td>
                    <td>
                      <div className="name-cell">{product.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>{product.manufacturer}</div>
                    </td>
                    <td><span className="cat-pill">{product.category?.name || 'Uncategorized'}</span></td>
                    <td className="price-cell">₹{Number(product.price).toFixed(2)}</td>
                    <td>
                      {product.stock > 10 ? (
                        <span className="stock-pill stock-good"><span className="stock-dot"></span>{product.stock} in stock</span>
                      ) : product.stock > 0 ? (
                        <span className="stock-pill stock-low"><span className="stock-dot"></span>{product.stock} in stock</span>
                      ) : (
                        <span className="stock-pill stock-out"><span className="stock-dot"></span>Out of stock</span>
                      )}
                    </td>
                    <td className="actions-cell">
                      <div className="icon-action icon-edit" onClick={() => openModal(product)}>
                        <Edit2 />
                      </div>
                      <div className="icon-action icon-del" onClick={() => handleDelete(product.id)}>
                        <Trash2 />
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-foot">
            <div className="foot-info">Showing {Math.min(filteredProducts.length, 20)} of {filteredProducts.length} products</div>
            <div className="pagination">
              <div className="page-btn" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>
                <ChevronLeft size={14} />
              </div>
              <div className="page-btn active">{currentPage}</div>
              <div className="page-btn" onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / 20)))} style={{ cursor: currentPage >= Math.ceil(filteredProducts.length / 20) ? 'not-allowed' : 'pointer', opacity: currentPage >= Math.ceil(filteredProducts.length / 20) ? 0.5 : 1 }}>
                <ChevronRight size={14} />
              </div>
            </div>
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
                  <Package />
                </div>
                <div>
                  <div className="modal-title">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </div>
                  <div className="modal-sub">Fields marked with * are required</div>
                </div>
              </div>
              <button className="close-btn" onClick={closeModal}>
                <X />
              </button>
            </div>
         
            <div className="modal-body">
              <form id="productForm" onSubmit={handleSubmit}>
                <div className="form-section">
                  <div className="section-label">Basic Information</div>
                  <div className="field">
                    <label className="field-label">Product Name <span className="req">*</span></label>
                    <input 
                      className="field-input" 
                      type="text" 
                      placeholder="e.g. Paracetamol 500mg"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid-2">
                    <div className="field">
                      <label className="field-label">Generic Name <span className="opt">Optional</span></label>
                      <input className="field-input" type="text" placeholder="e.g. Acetaminophen" />
                    </div>
                    <div className="field">
                      <label className="field-label">Brand <span className="opt">Optional</span></label>
                      <input className="field-input" type="text" placeholder="e.g. Cipla" />
                    </div>
                  </div>
                </div>
           
                <div className="form-section">
                  <div className="section-label">Category &amp; Manufacturer</div>
                  <div className="grid-2">
                    <div className="field">
                      <label className="field-label">Category <span className="req">*</span></label>
                      <select 
                        className="field-select"
                        required
                        value={formData.categoryId}
                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="field-label">Manufacturer <span className="req">*</span></label>
                      <input 
                        className="field-input" 
                        type="text" 
                        placeholder="e.g. Sun Pharma"
                        required
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
           
                <div className="form-section">
                  <div className="section-label">Pricing &amp; Stock</div>
                  <div className="grid-3">
                    <div className="field">
                      <label className="field-label">Price <span className="req">*</span></label>
                      <div className="input-prefix">
                        <span>₹</span>
                        <input 
                          className="field-input" 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="field-label">Discount Price <span className="opt">Optional</span></label>
                      <div className="input-prefix">
                        <span>₹</span>
                        <input className="field-input" type="number" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="field">
                      <label className="field-label">Initial Stock <span className="req">*</span></label>
                      <input 
                        className="field-input" 
                        type="number" 
                        placeholder="0"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
           
                <div className="form-section">
                  <div className="section-label">Batch &amp; Expiry</div>
                  <div className="grid-2">
                    <div className="field">
                      <label className="field-label">Batch Number <span className="opt">Optional</span></label>
                      <input className="field-input" type="text" placeholder="e.g. BN-2026-014" />
                    </div>
                    <div className="field">
                      <label className="field-label">Expiry Date <span className="req">*</span></label>
                      <input className="field-input" type="date" />
                    </div>
                  </div>
                </div>
           
                <div className="form-section">
                  <div className="section-label">Settings</div>
                  <div className="grid-2">
                    <div className="toggle-row">
                      <div>
                        <div className="toggle-text">Prescription Required</div>
                        <div className="toggle-hint">Customer must upload Rx</div>
                      </div>
                      <div className="switch on"></div>
                    </div>
                    <div className="toggle-row">
                      <div>
                        <div className="toggle-text">Active Status</div>
                        <div className="toggle-hint">Visible in storefront</div>
                      </div>
                      <div className="switch on"></div>
                    </div>
                  </div>
                </div>
           
                <div className="form-section">
                  <div className="section-label">Description</div>
                  <textarea 
                    className="field-textarea" 
                    placeholder="Product details and usage instructions…"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
           
                <div className="form-section" style={{ marginBottom: '4px' }}>
                  <div className="section-label">Product Images</div>
                  <div className="upload-zone">
                    <div className="upload-icon">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>
                    </div>
                    <div className="upload-text">Click to upload or drag and drop</div>
                    <div className="upload-hint">PNG or JPG, up to 5MB each — first image is used as the primary thumbnail</div>
                  </div>
                </div>
              </form>
            </div>
         
            <div className="modal-foot">
              <button type="button" className="btn btn-cancel" onClick={closeModal}>Cancel</button>
              <button type="submit" form="productForm" className="btn btn-create">
                <Plus />
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
