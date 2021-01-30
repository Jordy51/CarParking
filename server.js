const express = require("express");
const requestIp = require("request-ip");
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 5000;

require("dotenv").config();

require("./db/mongoDB");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

let ips = {};

app.use((req, res, next) => {
	const clientIp = requestIp.getClientIp(req);

	let flag = 0;

	if (ips[clientIp]) {
		ips[clientIp].count += 1;
		if (ips[clientIp].count % 10 == 0) {
			if (ips[clientIp].time + 10 > Math.floor(Date.now() / 1000)) {
				console.log("Alert Too may request by IP " + ips[clientIp].ip);
				res.status(429).send("You are sending too many requests!");
				flag = 1;
			}
			ips[clientIp].time = Math.floor(Date.now() / 1000);
		}

	} else {
		ips[clientIp] = { count: 1, time: Math.floor(Date.now() / 1000) };
	}
	if (flag == 0) next();
});

app.use("/", require("./routes/carParkingRoutes"));

app.listen(PORT, () => console.log(`Server is up and running on http://localhost:${PORT}`));
