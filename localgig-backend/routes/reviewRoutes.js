const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

// Add Review (Client ↔ Student)
router.post("/apply/:gigId", verifyToken, (req, res) => {
  const gigId = req.params.gigId;
  const studentId = req.user.id;

  // 1️⃣ Check if already applied
  const checkSql = `
    SELECT * FROM applications
    WHERE gig_id = ? AND student_id = ?
  `;

  db.query(checkSql, [gigId, studentId], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      return res.status(400).json({
        message: "You have already applied to this gig"
      });
    }

    // 2️⃣ Insert if not applied
    const insertSql = `
      INSERT INTO applications (gig_id, student_id, status, applied_at)
      VALUES (?, ?, 'applied', NOW())
    `;

    db.query(insertSql, [gigId, studentId], (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Applied successfully" });
    });
  });
});
// GET average rating of a user
router.get("/average/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      COUNT(*) as total_reviews,
      IFNULL(AVG(rating), 0) as average_rating
    FROM reviews
    WHERE reviewee_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result[0]);
  });
});

// GET reviews of a user
router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT r.*, u.name as reviewer_name
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.reviewee_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});


router.get("/summary/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      COUNT(*) as total_reviews,
      ROUND(IFNULL(AVG(rating), 0), 1) as average_rating
    FROM reviews
    WHERE reviewee_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result[0]);
  });
});

router.put("/update/:reviewId", verifyToken, (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  const sql = `
    UPDATE reviews 
    SET rating = ?, comment = ?
    WHERE id = ? AND reviewer_id = ?
  `;

  db.query(sql, [rating, comment, reviewId, req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ message: "Review updated successfully" });
  });
});

router.delete("/delete/:reviewId", verifyToken, (req, res) => {
  const { reviewId } = req.params;

  const sql = `
    DELETE FROM reviews 
    WHERE id = ? AND reviewer_id = ?
  `;

  db.query(sql, [reviewId, req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ message: "Review deleted successfully" });
  });
});

/* ===========================================
   ADD REVIEW
=========================================== */

router.post("/", verifyToken, (req, res) => {

  const { reviewee_id, rating, comment } = req.body;
  const reviewer_id = req.user.id;

  const sql = `
    INSERT INTO reviews
    (reviewer_id, reviewee_id, rating, comment, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(sql, [reviewer_id, reviewee_id, rating, comment], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json({
      message: "Review submitted successfully"
    });

  });

});

module.exports = router;