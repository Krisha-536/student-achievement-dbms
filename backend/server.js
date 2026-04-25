const express = require("express");
const cors = require("cors");
require("./db");  // DB connection

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
    res.send("Server running ✅");
});

// API routes
app.use("/api", routes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
