const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();





// ================= LOGIN =================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified
      }
    });
  });
});

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});






/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1️⃣ Check if email already exists
    const checkSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkSql, [email], async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        return res.status(400).json({
          message: "Email already registered"
        });
      }

      // 2️⃣ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3️⃣ Insert user
      const insertSql = `
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [name, email, hashedPassword, role],
        (err) => {
          if (err) return res.status(500).json(err);

          res.json({ message: "Registered successfully" });
        }
      );
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", verifyToken, (req, res) => {
  const sql = "SELECT id, name, email, verified FROM users WHERE id = ?";

  db.query(sql, [req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result[0]);
  });
});
module.exports = router;