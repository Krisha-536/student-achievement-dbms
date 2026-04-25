const db = require("./db");
const multer = require("multer");

// ================= FILE UPLOAD CONFIG =================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });
exports.upload = upload;

// ================= ADD ACHIEVEMENT =================
exports.addAchievement = (req, res) => {
    const {
        name,
        roll_no,
        department,
        year,
        title,
        category,
        level,
        position
    } = req.body;

    const filePath = req.file ? req.file.path : null;

    const getIdsQuery = `
      SELECT 
        (SELECT department_id FROM departments WHERE dept_name = ?) AS department_id,
        (SELECT year_id FROM years WHERE year_name = ?) AS year_id,
        (SELECT category_id FROM categories WHERE category_name = ?) AS category_id
    `;
    console.log("REQ BODY:", req.body);
    db.query(getIdsQuery, [department, year, category], (err, ids) => {
        if (err) return res.send(err);

        const { department_id, year_id, category_id } = ids[0];

        if (!department_id || !year_id || !category_id) {
            return res.json({ message: "Invalid mapping ❌" });
        }

        // Insert student
        const studentQuery = `
            INSERT INTO students (name, roll_no, department_id, year_id)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE student_id=LAST_INSERT_ID(student_id)
        `;

        db.query(studentQuery, [name, roll_no, department_id, year_id], (err, result) => {
            if (err) return res.send(err);

            const student_id = result.insertId;

            // Insert achievement
            const achievementQuery = `
                INSERT INTO achievements 
                (student_id, category_id, title, level, position, status)
                VALUES (?, ?, ?, ?, ?, 'pending')
            `;

            db.query(
                achievementQuery,
                [student_id, category_id, title, level, position],
                (err2, result2) => {
                    if (err2) return res.send(err2);

                    const achievement_id = result2.insertId;

                    if (filePath) {
                        const fileQuery = `
                            INSERT INTO files (achievement_id, file_path, file_type)
                            VALUES (?, ?, ?)
                        `;
                        db.query(fileQuery, [achievement_id, filePath, req.file.mimetype], (err3) => {
                            if (err3) return res.send(err3);
                            res.json({ message: "Inserted with file ✅" });
                        });
                    } else {
                        res.json({ message: "Inserted without file ✅" });
                    }
                }
            );
        });
    });
};
// ================= GET APPROVED =================
exports.getAchievements = (req, res) => {
    const sql = `
    SELECT 
        s.name, 
        s.roll_no,
        d.dept_name,
        y.year_name,
        a.achievement_id,
        a.title,
        c.category_name,
        a.level,
        a.position,
        a.status,
        f.file_path   -- ✅ IMPORTANT
    FROM achievements a
    JOIN students s ON a.student_id = s.student_id
    JOIN departments d ON s.department_id = d.department_id
    JOIN years y ON s.year_id = y.year_id
    LEFT JOIN categories c ON a.category_id = c.category_id
    LEFT JOIN files f ON a.achievement_id = f.achievement_id
    WHERE a.status='approved'
    `;

    db.query(sql, (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
};

// ================= GET PENDING =================
// ✅ GET PENDING (FULL DATA LIKE APPROVED)
exports.getPending = (req, res) => {
    const sql = `
    SELECT 
        s.name, 
        s.roll_no,
        d.dept_name,
        y.year_name,
        a.achievement_id,
        a.title,
        c.category_name,
        a.level,
        a.position,
        a.status,
        f.file_path
    FROM achievements a
    JOIN students s ON a.student_id = s.student_id
    JOIN departments d ON s.department_id = d.department_id
    JOIN years y ON s.year_id = y.year_id
    LEFT JOIN categories c ON a.category_id = c.category_id
    LEFT JOIN files f ON a.achievement_id = f.achievement_id
    WHERE a.status IN ('pending')
    `;

    db.query(sql, (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
};

// ================= UPDATE STATUS =================
exports.updateStatus = (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const approved_by = 1;
    const sql = "UPDATE achievements SET status=?, approved_by=? WHERE achievement_id=?";

    db.query(sql, [status, approved_by, id], (err) => {
        if (err) return res.send(err);
        res.json({ message: "Status updated ✅" });
    });
};

// ================= FILTER DATA =================
exports.getFilters = (req, res) => {
    const data = {};

    db.query("SELECT * FROM departments", (err, dept) => {
        if (err) return res.send(err);

        data.departments = dept;

        db.query("SELECT * FROM years", (err2, years) => {
            if (err2) return res.send(err2);

            data.years = years;

            db.query("SELECT * FROM categories", (err3, cat) => {
                if (err3) return res.send(err3);

                data.categories = cat;

                res.json(data);
            });
        });
    });
};
exports.getRejected = (req, res) => {
    const sql = `
    SELECT 
        s.name, 
        s.roll_no,
        d.dept_name,
        y.year_name,
        a.achievement_id,
        a.title,
        c.category_name,
        a.level,
        a.position,
        a.status,
        f.file_path
    FROM achievements a
    JOIN students s ON a.student_id = s.student_id
    LEFT JOIN departments d ON s.department_id = d.department_id -- Use LEFT JOIN
    LEFT JOIN years y ON s.year_id = y.year_id             -- Use LEFT JOIN
    LEFT JOIN categories c ON a.category_id = c.category_id
    LEFT JOIN files f ON a.achievement_id = f.achievement_id
    WHERE a.status='rejected'
    `;

    db.query(sql, (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
};