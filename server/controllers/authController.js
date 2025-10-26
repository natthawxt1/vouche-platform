const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // หา user ในฐานข้อมูล
    const [rows] = await pool.query(
      'SELECT * FROM User WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    // ตรวจสอบ password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // ส่งข้อมูลกลับไป
    res.json({
      token: token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // ตรวจสอบว่า email ซ้ำไหม
    const [existing] = await pool.query(
      'SELECT * FROM User WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO User (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );

    // สร้าง token
    const token = jwt.sign(
      { user_id: result.insertId, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token: token,
      user: {
        user_id: result.insertId,
        name: name,
        email: email,
        role: 'user'
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
};