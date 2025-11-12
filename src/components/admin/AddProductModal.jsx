import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AddProductModal = ({ isOpen, onClose, categories, onProductAdded }) => {
  const { user, isAdmin } = useAuth();
  const [formData, setFormData] = useState({ name: '', category_id: '', price: '', description: '' });
  const [codes, setCodes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !isAdmin()) return null; // admin only

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Add product
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          category_id: parseInt(formData.category_id)
        })
      });

      if (!response.ok) throw new Error('Failed to create product');
      const product = await response.json();

      // Add gift codes
      const codeList = codes.split('\n').map(c => c.trim()).filter(c => c.length > 0);
      if (codeList.length > 0) {
        await fetch(`http://localhost:5000/api/products/${product.product_id}/codes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({ codes: codeList })
        });
      }

      if (onProductAdded) onProductAdded(product);
      setFormData({ name: '', category_id: '', price: '', description: '' });
      setCodes('');
      onClose();
      alert('Product and codes added successfully!');
    } catch (err) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" />
          <select name="category_id" value={formData.category_id} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select category</option>
            {categories.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>)}
          </select>
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required className="w-full p-2 border rounded" />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" rows="3" />
          <textarea value={codes} onChange={(e) => setCodes(e.target.value)} placeholder="Gift Codes (one per line)" rows="5" className="w-full p-2 border rounded" />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="flex-1 p-2 bg-blue-600 text-white rounded">
              {loading ? 'Adding...' : 'Add Product'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 p-2 bg-gray-300 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
