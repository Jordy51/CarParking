const express = require("express");
const requestIp = require("request-ip");

const PORT = process.env.PORT || 5000;

require("dotenv").config();

require("./db/mongoDB");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let ips = Array();
console.log(ips);
app.use((req, res, next) => {
	const clientIp = requestIp.getClientIp(req);
	ips.push([clientIp, Date.now()]);
	console.log("Inside " + ips);
	next();
});

app.use("/", require("./routes/carParkingRoutes"));

app.listen(PORT, () => console.log(`Server is up and running on http://localhost:${PORT}`));
