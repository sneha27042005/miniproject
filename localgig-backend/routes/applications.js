const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

/* ===========================================
   APPLY TO GIG
=========================================== */

router.post("/apply/:gigId", verifyToken, (req, res) => {

  const gigId = req.params.gigId;
  const studentId = req.user.id;

  const checkSql = `
  SELECT * FROM applications
  WHERE gig_id = ? AND student_id = ?
  `;

  db.query(checkSql, [gigId, studentId], (err, result) => {

    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      return res.status(400).json({ message: "You already applied" });
    }

    db.query(
      "SELECT status FROM gigs WHERE id=?",
      [gigId],
      (err, gig) => {

        if (err) return res.status(500).json(err);

        if (gig.length === 0) {
          return res.status(404).json({ message: "Gig not found" });
        }

        if (gig[0].status !== "open") {
          return res.status(400).json({
            message: "This job is no longer open"
          });
        }

        const insertSql = `
        INSERT INTO applications
        (gig_id, student_id, status, applied_at)
        VALUES (?, ?, 'applied', NOW())
        `;

        db.query(insertSql, [gigId, studentId], (err) => {

          if (err) return res.status(500).json(err);

          res.json({ message: "Applied successfully" });

        });

      }
    );

  });

});


/* ===========================================
   STUDENT APPLICATIONS
=========================================== */

router.get("/my", verifyToken, (req, res) => {

  const studentId = req.user.id;

  const sql = `
  SELECT
  applications.id AS application_id,
  applications.status AS application_status,
  applications.check_in_time,
  applications.check_out_time,
  gigs.id AS gig_id,
  gigs.title,
  gigs.location,
  gigs.budget,
  gigs.job_date,
  gigs.duration,
  gigs.status AS gig_status
  FROM applications
  JOIN gigs ON applications.gig_id = gigs.id
  WHERE applications.student_id = ?
  ORDER BY applications.applied_at DESC
  `;

  db.query(sql, [studentId], (err, result) => {

    if (err) return res.status(500).json(err);

    res.json(result || []);

  });

});


/* ===========================================
   CLIENT VIEW APPLICANTS
=========================================== */

router.get("/gig/:gigId", verifyToken, (req, res) => {

  const gigId = req.params.gigId;

  const sql = `
  SELECT
  applications.id AS application_id,
  applications.status,
  applications.applied_at,
  users.id AS student_id,
  users.name,
  users.email
  FROM applications
  JOIN users ON applications.student_id = users.id
  WHERE applications.gig_id = ?
  ORDER BY applications.applied_at ASC
  `;

  db.query(sql, [gigId], (err, result) => {

    if (err) return res.status(500).json(err);

    res.json(result);

  });

});


/* ===========================================
   ACCEPT / REJECT APPLICATION
=========================================== */

router.put("/:applicationId/status", verifyToken, (req, res) => {

  const applicationId = req.params.applicationId;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  db.query(
    "UPDATE applications SET status=? WHERE id=?",
    [status, applicationId],
    (err) => {

      if (err) return res.status(500).json(err);

      if (status === "accepted") {

        db.query(
          "SELECT gig_id FROM applications WHERE id=?",
          [applicationId],
          (err, result) => {

            if (err) return res.status(500).json(err);

            const gigId = result[0].gig_id;

            

            db.query(
              "UPDATE gigs SET status='in_progress' WHERE id=?",
              [gigId]
            );

            res.json({
              message: "Application accepted successfully"
            });

          }
        );

      } else {

        res.json({ message: "Application rejected" });

      }

    }
  );

});


/* ===========================================
   CHECK IN
=========================================== */

router.put("/checkin/:id", verifyToken, (req, res) => {

  const id = req.params.id;

  db.query(
    "SELECT check_in_time FROM applications WHERE id=?",
    [id],
    (err, result) => {

      if (err) return res.status(500).json(err);

      if (result[0]?.check_in_time) {
        return res.status(400).json({
          message: "Already checked in"
        });
      }

      db.query(
        "UPDATE applications SET check_in_time = NOW() WHERE id=?",
        [id],
        (err) => {

          if (err) return res.status(500).json(err);

          res.json({ message: "Checked in successfully" });

        }
      );

    }
  );

});


/* ===========================================
   CHECK OUT
=========================================== */

router.put("/checkout/:id", verifyToken, (req, res) => {

  const id = req.params.id;

  db.query(
    "SELECT check_out_time FROM applications WHERE id=?",
    [id],
    (err, result) => {

      if (err) return res.status(500).json(err);

      if (result[0]?.check_out_time) {
        return res.status(400).json({
          message: "Already checked out"
        });
      }

      db.query(
        "UPDATE applications SET check_out_time = NOW() WHERE id=?",
        [id],
        (err) => {

          if (err) return res.status(500).json(err);

          db.query(
            `UPDATE gigs
            SET status='completed'
            WHERE id=(SELECT gig_id FROM applications WHERE id=?)`,
            [id]
          );

          res.json({ message: "Checked out successfully" });

        }
      );

    }
  );

});


/* ===========================================
   STUDENT EARNINGS
=========================================== */

router.get("/earnings", verifyToken, (req, res) => {

  const studentId = req.user.id;

  const sql = `
  SELECT SUM(gigs.budget) AS earnings
  FROM applications
  JOIN gigs ON applications.gig_id = gigs.id
  WHERE applications.student_id = ?
  AND applications.check_out_time IS NOT NULL
  `;

  db.query(sql, [studentId], (err, result) => {

    if (err) return res.status(500).json(err);

    res.json({
      earnings: result[0]?.earnings || 0
    });

  });

});


/* ===========================================
   CANCEL APPLICATION
=========================================== */

router.put("/cancel/:id", verifyToken, (req, res) => {

  const id = req.params.id;

  db.query(
    "SELECT check_in_time FROM applications WHERE id=?",
    [id],
    (err, result) => {

      if (err) return res.status(500).json(err);

      if (result[0]?.check_in_time) {
        return res.status(400).json({
          message: "Cannot cancel after check-in"
        });
      }

     // get full application first
db.query(
  "SELECT * FROM applications WHERE id=?",
  [id],
  (err, result) => {

    if (err) return res.status(500).json(err);

    const app = result[0];

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const wasAccepted = app.status === "accepted";

    // cancel current application
   db.query(
  "SELECT * FROM applications WHERE id=?",
  [id],
  (err, result) => {

    const app = result[0];
    const wasAccepted = app.status === "accepted";

    // cancel current
    db.query(
      "UPDATE applications SET status='cancelled' WHERE id=?",
      [id],
      (err) => {

        if (wasAccepted) {

          // find next student
          db.query(
            `SELECT * FROM applications
             WHERE gig_id=? AND status='applied'
             ORDER BY applied_at ASC
             LIMIT 1`,
            [app.gig_id],
            (err, next) => {

              if (next.length > 0) {

                // accept next
                db.query(
                  "UPDATE applications SET status='accepted' WHERE id=?",
                  [next[0].id]
                );

              }

              res.json({ message: "Updated" });

            }
          );

        } else {
          res.json({ message: "Cancelled" });
        }

      }
    );

  }
);

  }
);

    }
  );

});


module.exports = router;