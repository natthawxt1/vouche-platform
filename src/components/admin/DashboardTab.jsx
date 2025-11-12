import React from 'react';

const DashboardTab = ({ stats, products, setShowAddProductModal, setShowAddCategoryModal, setActiveTab, handleEditProduct }) => {
  const lowStockProducts = products.filter(p => p.stock < 20 && p.stock > 0).slice(0, 5);

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">🛍️</span>
            <span className="text-3xl font-bold text-primary-600">{stats.totalProducts}</span>
          </div>
          <div className="text-gray-600 text-sm font-medium">Total Products</div>
          <div className="text-xs text-green-600 mt-1">+12% from last month</div>
        </div>
        {/* ... other 3 stat cards ... */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">📊</span>
            <span className="text-3xl font-bold text-blue-600">{stats.categories}</span>
          </div>
          <div className="text-gray-600 text-sm font-medium">Categories</div>
          <div className="text-xs text-gray-500 mt-1">Active categories</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">🛒</span>
            <span className="text-3xl font-bold text-green-600">{stats.orders}</span>
          </div>
          <div className="text-gray-600 text-sm font-medium">Total Orders</div>
          <div className="text-xs text-green-600 mt-1">+8% from last week</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">💰</span>
            <span className="text-3xl font-bold text-orange-600">$12.5K</span>
          </div>
          <div className="text-gray-600 text-sm font-medium">Revenue</div>
          <div className="text-xs text-green-600 mt-1">+15% this month</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowAddProductModal(true)}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors"
          >
            <div className="text-3xl mb-2">➕</div>
            <div className="font-medium text-sm">Add Product</div>
          </button>
          {/* ... other 3 quick action buttons ... */}
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">⚠️ Low Stock Alert</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map(product => (
                <div key={product.product_id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  {/* ... low stock item layout ... */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded flex items-center justify-center">🎮</div>
                    <div>
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-gray-600">Stock: {product.stock} units</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700"
                  >
                    Restock
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                ✅ All products have sufficient stock
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardTab;