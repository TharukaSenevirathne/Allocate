import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();

router.post('/login', async (req, res) => {
  const { reg_no, password } = req.body;
  const pool = req.db; // make sure this is set up correctly

  try {
    // First, check in Users table
    let [rows] = await pool.query('SELECT * FROM Users WHERE reg_no = ?', [reg_no]);

    let userType = 'User'; // default

    // If not found in Users, check staff table
    if (rows.length === 0) {
      [rows] = await pool.query('SELECT * FROM staff WHERE reg_number = ?', [reg_no]);
      userType = 'Staff';
    }

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    // Note: user.password_hash column name is same in both tables
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      userType,
      userId: user.user_id || user.staff_id, // either user_id or staff_id
      name: user.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
