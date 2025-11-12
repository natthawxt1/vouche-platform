import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../services/api';
import AddProductModal from '../components/admin/AddProductModal';
import EditProductModal from '../components/admin/EditProductModal';
import AddCategoryModal from '../components/admin/AddCategoryModal';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    categories: 0,
    orders: 0,
    giftCodes: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setStats(prev => ({
        ...prev,
        totalProducts: productsRes.data.length,
        categories: categoriesRes.data.length
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock < 20) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete product');
      alert('Product deleted successfully!');
      fetchData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete category');
      alert('Category deleted successfully!');
      fetchData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleQuickStockUpdate = async (productId, newStock) => {
    try {
      const product = products.find(p => p.product_id === productId);
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...product,
          stock: parseInt(newStock)
        })
      });

      if (!response.ok) throw new Error('Failed to update stock');
      fetchData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-primary-700 to-primary-900 text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">VOUCHÉ</h1>
          <p className="text-sm text-primary-200 mb-8">Admin Portal</p>

          <nav className="space-y-2">
            {['dashboard','products','categories','orders','stock'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <span>{tab==='dashboard'?'📊':tab==='products'?'📦':tab==='categories'?'📂':tab==='orders'?'🛒':'📊'}</span>
                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              </button>
            ))}
            <a href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 mt-8">
              <span>🏠</span>
              <span>Back to Store</span>
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-8 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <span className="text-xl">🔔</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <span className="font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Dashboard */}
          {activeTab==='dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span>🛍️</span>
                  <span className="text-2xl font-bold text-primary-600">{stats.totalProducts}</span>
                </div>
                <div className="text-gray-600 text-sm">Total Products</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span>📊</span>
                  <span className="text-2xl font-bold text-blue-600">{stats.categories}</span>
                </div>
                <div className="text-gray-600 text-sm">Categories</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span>🛒</span>
                  <span className="text-2xl font-bold text-green-600">{stats.orders}</span>
                </div>
                <div className="text-gray-600 text-sm">Orders</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span>🎁</span>
                  <span className="text-2xl font-bold text-orange-600">{stats.giftCodes}</span>
                </div>
                <div className="text-gray-600 text-sm">Gift Codes</div>
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab==='products' && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Manage Products</h3>
                <button onClick={()=>setShowAddProductModal(true)} className="btn-primary">+ Add Product</button>
              </div>
              <div className="p-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e)=>setSearchTerm(e.target.value)}
                  className="input-field max-w-md mb-4"
                />
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        {['ID','Product','Category','Stock','Price','Status','Actions'].map(head => (
                          <th key={head} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{head}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredProducts.map(product=>{
                        const status = getStockStatus(product.stock);
                        return (
                          <tr key={product.product_id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">{product.product_id}</td>
                            <td className="px-4 py-3 flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded flex items-center justify-center">🎮</div>
                              <span className="font-medium text-sm">{product.name}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{product.category_name||'N/A'}</td>
                            <td className="px-4 py-3 text-sm">{product.stock}</td>
                            <td className="px-4 py-3 text-sm font-semibold">${product.price}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.text}</span></td>
                            <td className="px-4 py-3 flex gap-2">
                              <button onClick={()=>handleEditProduct(product)} className="text-blue-600 hover:text-blue-800">✏️</button>
                              <button onClick={()=>handleDeleteProduct(product.product_id)} className="text-red-600 hover:text-red-800">🗑️</button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {filteredProducts.length===0 && <div className="text-center py-12 text-gray-500">No products found</div>}
                </div>
              </div>
            </div>
          )}

          {/* Categories */}
          {activeTab==='categories' && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Manage Categories</h3>
                <button onClick={()=>setShowAddCategoryModal(true)} className="btn-primary">+ Add Category</button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat=>(
                  <div key={cat.category_id} className="border rounded-lg p-4 hover:border-primary-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl mb-2">📁</div>
                        <h4 className="font-semibold text-gray-800">{cat.name}</h4>
                        <p className="text-sm text-gray-600">ID: {cat.category_id}</p>
                        <p className="text-sm text-gray-600">{products.filter(p=>p.category_id===cat.category_id).length} products</p>
                      </div>
                      <button onClick={()=>handleDeleteCategory(cat.category_id)} className="text-red-600 hover:text-red-800">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AddProductModal isOpen={showAddProductModal} onClose={()=>setShowAddProductModal(false)} categories={categories} onProductAdded={fetchData}/>
      <EditProductModal isOpen={showEditProductModal} onClose={()=>setShowEditProductModal(false)} product={selectedProduct} categories={categories} onProductUpdated={fetchData}/>
      <AddCategoryModal isOpen={showAddCategoryModal} onClose={()=>setShowAddCategoryModal(false)} onCategoryAdded={fetchData}/>
    </div>
  )
}

export default AdminDashboard;
