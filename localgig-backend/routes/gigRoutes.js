const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

/* ===========================================
   1️⃣ CREATE GIG (CLIENT)
=========================================== */

router.post("/", verifyToken, (req, res) => {

  const { title, description, location, budget, duration, job_date, latitude, longitude } = req.body;

  if (!title || !description || !location || !budget || !duration || !job_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const clientId = req.user.id;

  const sql = `
  INSERT INTO gigs
  (title, description, location, budget, duration, job_date, latitude, longitude, client_id, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
  `;

  db.query(
    sql,
    [title, description, location, budget, duration, job_date, latitude, longitude, clientId],
    (err) => {

      if (err) {
        console.log("CREATE GIG ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({ message: "Job posted successfully" });

    }
  );

});


/* ===========================================
   2️⃣ CLIENT - GET MY GIGS
=========================================== */

router.get("/client", verifyToken, (req, res) => {

  const clientId = req.user.id;

  const sql = `
  SELECT *
  FROM gigs
  WHERE client_id = ?
  ORDER BY id DESC
  `;

  db.query(sql, [clientId], (err, result) => {

    if (err) return res.status(500).json(err);

    res.json(result);

  });

});


/* ===========================================
   3️⃣ NEARBY GIG SEARCH (MAP)
=========================================== */

router.get("/nearby/search", verifyToken, (req, res) => {

  const { lat, lng, radius } = req.query;

  if (!lat || !lng || !radius) {
    return res.status(400).json({
      message: "lat, lng and radius are required"
    });
  }

  const sql = `
  SELECT *,
  (6371 * acos(
      cos(radians(?)) *
      cos(radians(latitude)) *
      cos(radians(longitude) - radians(?)) +
      sin(radians(?)) *
      sin(radians(latitude))
  )) AS distance
  FROM gigs
  WHERE status = 'open'
  HAVING distance < ?
  ORDER BY distance ASC
  `;

  db.query(sql, [lat, lng, lat, radius], (err, result) => {

    if (err) return res.status(500).json(err);

    res.json(result);

  });

});


/* ===========================================
   4️⃣ GET ALL OPEN GIGS (STUDENT)
=========================================== */

router.get("/", (req, res) => {

  const sql = `
  SELECT *
  FROM gigs
  WHERE status = 'open'
  ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) return res.status(500).json(err);

    res.json(result);

  });

});


/* ===========================================
   5️⃣ GET SINGLE GIG
=========================================== */

router.get("/:id", (req, res) => {

  const gigId = req.params.id;

  const sql = `
  SELECT *
  FROM gigs
  WHERE id = ?
  `;

  db.query(sql, [gigId], (err, result) => {

    if (err) return res.status(500).json(err);

    if (result.length === 0)
      return res.status(404).json({ message: "Gig not found" });

    res.json(result[0]);

  });

});


/* ===========================================
   6️⃣ UPDATE GIG (CLIENT)
=========================================== */

router.put("/:id", verifyToken, (req, res) => {

  const gigId = req.params.id;
  const { title, description, budget } = req.body;
  const userId = req.user.id;

  db.query("SELECT * FROM gigs WHERE id = ?", [gigId], (err, result) => {

    if (err) return res.status(500).json(err);

    if (result.length === 0)
      return res.status(404).json({ message: "Gig not found" });

    if (result[0].client_id !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    const sql = `
    UPDATE gigs
    SET title = ?, description = ?, budget = ?
    WHERE id = ?
    `;

    db.query(sql, [title, description, budget, gigId], (err) => {

      if (err) return res.status(500).json(err);

      res.json({ message: "Gig updated successfully" });

    });

  });

});


/* ===========================================
   7️⃣ DELETE GIG
=========================================== */

router.delete("/:id", verifyToken, (req, res) => {

  const gigId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  db.query("SELECT * FROM gigs WHERE id = ?", [gigId], (err, result) => {

    if (err) return res.status(500).json(err);

    if (result.length === 0)
      return res.status(404).json({ message: "Gig not found" });

    if (result[0].client_id !== userId && userRole !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    db.query("DELETE FROM gigs WHERE id = ?", [gigId], (err) => {

      if (err) return res.status(500).json(err);

      res.json({ message: "Gig deleted successfully" });

    });

  });

});


/* ===========================================
   8️⃣ MARK GIG COMPLETED
=========================================== */

router.put("/:gigId/complete", verifyToken, (req, res) => {

  const gigId = req.params.gigId;

  db.query(
    "UPDATE gigs SET status = 'completed' WHERE id = ?",
    [gigId],
    (err) => {

      if (err) return res.status(500).json(err);

      res.json({ message: "Gig marked as completed" });

    }
  );

});

module.exports = router;