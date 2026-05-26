const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

/* ADMIN OVERVIEW */
router.get("/overview", verifyToken, verifyAdmin, (req, res) => {

  const usersSql = "SELECT COUNT(*) AS totalUsers FROM users";
  const jobsSql = "SELECT COUNT(*) AS activeJobs FROM gigs WHERE status = 'open'";

  db.query(usersSql, (err, users) => {
    if (err) return res.status(500).json(err);

    db.query(jobsSql, (err2, jobs) => {
      if (err2) return res.status(500).json(err2);

      res.json({
        totalUsers: users[0].totalUsers,
        activeJobs: jobs[0].activeJobs
      });
    });
  });

});

// ADMIN - View All Users
router.get("/users", verifyToken, verifyAdmin, (req, res) => {

  const sql = `
    SELECT id, name, email, role
    FROM users
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });

});



/* ADMIN - View Pending Verifications */
router.get("/verification", verifyToken, verifyAdmin, (req, res) => {

  const sql = `
    SELECT id, name, email, role
    FROM users
    WHERE verified = 0 AND role = 'client'
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });

});

/* ADMIN - Approve Verification */
router.put("/verification/:id", verifyToken, verifyAdmin, (req, res) => {

  const userId = req.params.id;

  const sql = `
    UPDATE users
    SET verified = 1
    WHERE id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "User verified successfully"
    });
  });

});

/* ADMIN - View All Gigs */
router.get("/jobs", verifyToken, verifyAdmin, (req, res) => {

  const sql = `
    SELECT 
      gigs.id,
      gigs.title,
      gigs.budget,
      gigs.status,
      gigs.job_date,
      users.name AS client_name
    FROM gigs
    JOIN users ON gigs.client_id = users.id
    ORDER BY gigs.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });

});

/* ADMIN - Delete Gig */
router.delete("/jobs/:id", verifyToken, verifyAdmin, (req, res) => {

  const gigId = req.params.id;

  const sql = "DELETE FROM gigs WHERE id = ?";

  db.query(sql, [gigId], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.json({ message: "Gig deleted successfully" });
  });

});

/* ADMIN - View All Reports */
router.get("/reports", verifyToken, verifyAdmin, (req, res) => {

  const sql = `
    SELECT 
      reports.id,
      reports.reason,
      reports.status,
      reports.created_at,
      reporter.name AS reporter_name,
      reported_user.name AS reported_user_name,
      gigs.title AS reported_gig_title
    FROM reports
    LEFT JOIN users AS reporter ON reports.reporter_id = reporter.id
    LEFT JOIN users AS reported_user ON reports.reported_user_id = reported_user.id
    LEFT JOIN gigs ON reports.reported_gig_id = gigs.id
    ORDER BY reports.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });

});

/* ADMIN - Resolve Report */
router.put("/reports/:id/resolve", verifyToken, verifyAdmin, (req, res) => {

  const reportId = req.params.id;

  const sql = `
    UPDATE reports
    SET status = 'resolved'
    WHERE id = ?
  `;

  db.query(sql, [reportId], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({ message: "Report resolved successfully" });
  });

});

module.exports = router;