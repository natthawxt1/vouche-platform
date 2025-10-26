import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,  
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vouche_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Products Routes
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM Product p 
      LEFT JOIN Category c ON p.category_id = c.category_id 
      WHERE p.stock >= 0
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
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
});

// Categories Routes
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Category');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Orders Routes
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM `Order` WHERE user_id = ? ORDER BY order_date DESC',
      [req.params.userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { user_id, total_price, items } = req.body;
    
    // Insert order
    const [orderResult] = await connection.query(
      'INSERT INTO `Order` (user_id, order_date, total_price) VALUES (?, NOW(), ?)',
      [user_id, total_price]
    );
    
    const orderId = orderResult.insertId;
    
    // Insert order items
    for (const item of items) {
      await connection.query(
        'INSERT INTO Order_Item (order_id, product_id, quantity, price, payment_method) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price, item.payment_method]
      );
      
      // Update product stock
      await connection.query(
        'UPDATE Product SET stock = stock - ? WHERE product_id = ?',
        [item.quantity, item.product_id]
      );
    }
    
    await connection.commit();
    res.status(201).json({ orderId, message: 'Order created successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});