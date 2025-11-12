import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 8889,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vouche_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors());
app.use(express.json());

// ==========================================
// ✅ Middleware
// ==========================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  const allowed = ['admin', 'superadmin'];
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ==========================================
// ✅ Test DB Connection
// ==========================================
pool.getConnection()
  .then(conn => {
    console.log('✅ Database connected successfully');
    conn.release();
  })
  .catch(err => console.error('❌ DB connection failed:', err.message));

// ==========================================
// ✅ Default route
// ==========================================
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// ==========================================
// ✅ AUTH
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { user_id: user.user_id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [exists] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    if (exists.length > 0) return res.status(400).json({ error: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO User (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, hash, 'customer']
    );

    const token = jwt.sign(
      { user_id: result.insertId, role: 'customer' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: { user_id: result.insertId, name, email, role: 'customer' }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ✅ CATEGORIES CRUD
// ==========================================
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Category ORDER BY category_id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', authenticateToken, isAdmin, async (req, res) => {
  const { name, description } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Category (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    res.status(201).json({ category_id: result.insertId, name, description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/:id', authenticateToken, isAdmin, async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.query('UPDATE Category SET name=?, description=? WHERE category_id=?',
      [name, description, req.params.id]);
    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM Category WHERE category_id=?', [req.params.id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ✅ PRODUCTS + GIFT CODES
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        (
          SELECT COUNT(*) FROM gift_code 
          WHERE product_id = p.product_id AND status = 'new'
        ) AS stock
      FROM Product p
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Product WHERE product_id=?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', authenticateToken, isAdmin, async (req, res) => {
  const { name, category_id, price, description } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Product (name, category_id, price, description) VALUES (?, ?, ?, ?)',
      [name, category_id, price, description || null]
    );
    res.status(201).json({ product_id: result.insertId, name, category_id, price, description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products/:id/codes', authenticateToken, isAdmin, async (req, res) => {
  const { codes } = req.body;
  if (!codes || !Array.isArray(codes) || codes.length === 0)
    return res.status(400).json({ error: 'Codes array required' });

  try {
    const values = codes.map(code => [req.params.id, code.trim()]);
    await pool.query('INSERT INTO gift_code (product_id, code) VALUES ?', [values]);
    res.json({ message: 'Gift codes added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ✅ ORDERS (simplified)
// ==========================================
app.post('/api/orders', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { user_id, total_price, items } = req.body;

    const [orderResult] = await connection.query(
      'INSERT INTO `Order` (user_id, order_date, total_price, status) VALUES (?, NOW(), ?, ?)',
      [user_id, total_price, 'completed']
    );
    const orderId = orderResult.insertId;

    const collectedCodes = [];
    for (const item of items) {
      await connection.query(
        'INSERT INTO Order_Item (order_id, product_id, quantity, price, payment_method) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price, item.payment_method]
      );

      const [codes] = await connection.query(
        'SELECT gift_code_id, code FROM gift_code WHERE product_id=? AND status="new" LIMIT 1',
        [item.product_id]
      );
      if (codes.length === 0) throw new Error('No available gift codes for this product');

      const selected = codes[0];
      await connection.query(
        'UPDATE gift_code SET status="active", order_id=?, redeemed_at=NOW() WHERE gift_code_id=?',
        [orderId, selected.gift_code_id]
      );

      collectedCodes.push({ product_id: item.product_id, code: selected.code });
    }

    await connection.commit();
    res.status(201).json({ orderId, codes: collectedCodes, message: 'Order completed' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// ==========================================
// ✅ Start server
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
