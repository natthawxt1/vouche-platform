const pool = require('../db');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM Product p 
      LEFT JOIN Category c ON p.category_id = c.category_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT p.*, c.name as category_name FROM Product p LEFT JOIN Category c ON p.category_id = c.category_id WHERE p.product_id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add product (Admin only)
exports.addProduct = async (req, res) => {
  const { name, category_id, price, stock, description } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO Product (name, category_id, price, stock, description) VALUES (?, ?, ?, ?, ?)',
      [name, category_id, price, stock, description || null]
    );

    res.status(201).json({
      product_id: result.insertId,
      name,
      category_id,
      price,
      stock,
      description
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category_id, price, stock, description } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE Product SET name = ?, category_id = ?, price = ?, stock = ?, description = ? WHERE product_id = ?',
      [name, category_id, price, stock, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      'DELETE FROM Product WHERE product_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get categories
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Category');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};