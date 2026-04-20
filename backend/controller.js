const db = require("./db");

exports.addAchievement = (req, res) => {
    const { name, roll_no, title, category, level, position } = req.body;

    const sql = `
    INSERT INTO achievements 
    (name, roll_no, title, category, level, position, status)
    VALUES (?, ?, ?, ?, ?, ?, 'pending')
  `;

    db.query(
        sql,
        [name, roll_no, title, category, level, position],
        (err, result) => {
            if (err) return res.send(err);
            res.send("Inserted ✅");
        }
    );
};

exports.getAchievements = (req, res) => {
    const db = require("./db"); // only add this if not already at top

    const sql = "SELECT * FROM achievements WHERE status='approved'";

    db.query(sql, (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
};

exports.updateStatus = (req, res) => {
    const db = require("./db");

    const id = req.params.id;
    const { status } = req.body;

    const sql = "UPDATE achievements SET status=? WHERE id=?";

    db.query(sql, [status, id], (err, result) => {
        if (err) return res.send(err);
        res.send("Status updated ✅");
    });
};

exports.getPending = (req, res) => {
    const db = require("./db");

    const sql = "SELECT * FROM achievements WHERE status='pending'";

    db.query(sql, (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
};