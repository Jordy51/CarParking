const express = require("express");

const PORT = process.env.PORT || 5000;

require("dotenv").config();

require("./db/mongoDB")

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", require("./routes/carParkRoutes"))

app.listen(PORT, () => console.log(`Server is up and running on http://localhost:${PORT}`));
