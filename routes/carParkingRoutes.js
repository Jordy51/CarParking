const express = require("express");

const router = express.Router();

const CarPark = require("../models/carParkingSchema");

//1
router.post("/parkCar", async (req, res) => {
	const ParkingSlot = await CarPark.findOne({ slotAvailable: true });

	console.log(typeof req.body.carNo);
	if (!req.body.carNo || req.body.carNo == '') {
		res.status(412).send("Please enter the car no. with the field");
	} else {
		if (ParkingSlot && req.body.carNo) {
			ParkingSlot.carNo = req.body.carNo;
			ParkingSlot.slotAvailable = false;
			ParkingSlot.save()
				.then(res.status(200).send(ParkingSlot.slotNo))
				.catch((err) => {
					console.log(err);
					res.status(503).send("Data couldn't be sent to database successfully");
				});
		} else {
			await CarPark.find().countDocuments((err, count) => {
				if (err) {
					res.status(503).send("Database Error");
				} else {
					if (count < process.env.ParkingCapacity) {
						const newSlot = new CarPark();

						newSlot.slotNo = count + 1;
						newSlot.carNo = req.body.carNo;
						newSlot.slotAvailable = false;
						newSlot
							.save()
							.then(res.status(200).send(newSlot.slotNo))
							.catch((err) => {
								console.log(err);
								res.status(503).send("Data couldn't be sent to database successfully");
							});
					} else {
						res.status(404).send("No Empty slot found!");
					}
				}
			});
		}
	}
});

//2
router.post("/unparkCar", async (req, res) => {
	if (req.body.slotNo) {
		await CarPark.findOne({ slotNo: req.body.slotNo }).exec((err, ParkingSlot) => {
			if (err) {
				res.status(503).send("Database Error");
			} else {
				if (ParkingSlot.slotAvailable == false) {
					ParkingSlot.slotAvailable = true;
					ParkingSlot.carNo = "";
					ParkingSlot.save()
						.then(res.status(200).send(ParkingSlot.carNo))
						.catch((err) => res.status(503).send("Data couldn't be sent to database successfully"));
				} else {
					res.status(404).send("Car not found!");
				}
			}
		});
	} else {
		res.status(412).send("Please enter the Slot number.");
	}
});

// 3 Done
router.get("/", async (req, res) => {
	if (req.body.carNo) {
		await CarPark.findOne({ carNo: req.body.carNo }).exec((err, ParkingSlot) => {
			if (err) {
				res.status(503).send("Database Error");
			} else {
				console.log(ParkingSlot)
				res.status(200).send({ carNo: ParkingSlot.carNo, slotNo: ParkingSlot.slotNo });
			}
		});
	} else if (req.body.slotNo) {
		await CarPark.findOne({ slotNo: req.body.slotNo }).exec((err, ParkingSlot) => {
			if (err) {
				res.status(503).send("Database Error");
			} else {
				res.status(200).send({ carNo: ParkingSlot.carNo, slotNo: ParkingSlot.slotNo });
			}
		});
	} else {
		res.status(412).send("Send either Slot number or Car number.");
	}
});

module.exports = router;
