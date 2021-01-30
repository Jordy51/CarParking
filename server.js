const express = require("express");
const requestIp = require("request-ip");

const PORT = process.env.PORT || 5000;

require("dotenv").config();

require("./db/mongoDB");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let ips = Array();

app.use((req, res, next) => {
	const clientIp = requestIp.getClientIp(req);
	let i = 0;
	let flag = 0;
	for (i = 0; i < ips.length; i = i + 1) {
		if (ips[i].ip == clientIp) {
			ips[i].count = ips[i].count + 1;
			if (ips[i].count % 10 == 0) {
				if (ips[i].time + 10 > Math.floor(Date.now() / 1000)) {
					console.log("Alert TOoo may request by IP " + ips[i].ip);
				}
				ips[i].time = Math.floor(Date.now() / 1000);
			}
			flag = 1;
			break;
		}
	}
	if (flag == 0) {
		ips.push({ ip: clientIp, time: Math.floor(Date.now() / 1000), count: 0 });
	}
	console.log(ips);
	next();
});

app.use("/", require("./routes/carParkingRoutes"));

app.listen(PORT, () => console.log(`Server is up and running on http://localhost:${PORT}`));
