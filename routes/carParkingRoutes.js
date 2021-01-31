const express = require("express");

const router = express.Router();

const CarPark = require("../models/carParkingSchema");

//1 - Park a Car

router.all("/parkCar", async (req, res) => {
	console.log(req.method);
	if (req.method != "POST") {
		res.status(405).send();
	} else {
		const ParkingSlot = await CarPark.findOne({ slotAvailable: true });
		if (!req.body.carNo || req.body.carNo == "") {
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
	}
});

//2 - Unpark the Car
router.all("/unparkCar", async (req, res) => {
	if (req.method != "POST") {
		res.status(405).send();
	} else {
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
	}
});

// 3 - Get the Car/Slot Information
router.all("/", async (req, res) => {
	if (req.method != "GET") {
		res.status(405).send();
	} else {
		if (req.body.carNo) {
			await CarPark.findOne({ carNo: req.body.carNo }).exec((err, ParkingSlot) => {
				if (err) {
					res.status(503).send("Database Error");
				} else if (ParkingSlot == null) {
					res.status(404).send("Car Not Found!");
				} else {
					res.status(200).send({ carNo: ParkingSlot.carNo, slotNo: ParkingSlot.slotNo });
				}
			});
		} else if (req.body.slotNo) {
			await CarPark.findOne({ slotNo: req.body.slotNo }).exec((err, ParkingSlot) => {
				if (err) {
					res.status(503).send("Database Error");
				} else if (ParkingSlot == null) {
					if (parseInt(req.body.slotNo) > process.env.ParkingCapacity) {
						res.status(404).send("Slot Not Found!");
					} else {
						res.status(404).send("No car is parked at Slot Number " + req.body.slotNo);
					}
				} else {
					res.status(200).send({ carNo: ParkingSlot.carNo, slotNo: ParkingSlot.slotNo });
				}
			});
		} else {
			res.status(412).send("Send either Slot number or Car number.");
		}
	}
});

module.exports = router;
