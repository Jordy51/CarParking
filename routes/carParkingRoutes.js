const express = require("express");

const router = express.Router();

const CarPark = require("../models/carParkingSchema");

//1
router.post("/parkCar", async (req, res) => {
	const ParkingSlot = await CarPark.findOne({ slotAvailable: true });

	if (ParkingSlot) {
		ParkingSlot.carNo = req.body.carNo;
		ParkingSlot.slotAvailable = false;
		ParkingSlot.save()
			.then(res.status(200).send(ParkingSlot.slotNo))
			.catch((err) => console.log(err));
	} else {
		await CarPark.find().countDocuments((err, count) => {
			if (count < process.env.ParkingCapacity) {
				const newSlot = new CarPark();

				newSlot.slotNo = count + 1;
				newSlot.carNo = req.body.carNo;
				newSlot.slotAvailable = false;
				newSlot
					.save()
					.then(res.status(200).send(ParkingSlot.slotNo))
					.catch((err) => console.log(err));
			} else {
				res.status(400).send("No Empty slot found!");
			}
		});
	}
});

//2
router.post("/unparkCar", async (req, res) => {
	await CarPark.findOne({ slotNo: req.body.slotNo }).exec((err, ParkingSlot) => {
		if (ParkingSlot.slotAvailable == false) {
			ParkingSlot.slotAvailable = true;
			ParkingSlot.carNo = "";
			ParkingSlot.save()
				.then(res.status(200).send(ParkingSlot.carNo))
				.catch((err) => console.log(err));
		} else {
			res.status(404).send("Car not found!");
		}
	});
});

// 3 Done
router.get("/", async (req, res) => {
	if (req.body.carNo) {
		await CarPark.findOne({ carNo: req.body.carNo }).exec((err, ParkingSlot) => {
			res.status(200).send({ carNo: ParkingSlot.carNo, slotNo: ParkingSlot.slotNo });
		});
	} else if (req.body.slotNo) {
		await CarPark.findOne({ slotNo: req.body.slotNo }).exec((err, ParkingSlot) => {
			res.status(200).send({ carNo: ParkingSlot.carNo, slotNo: ParkingSlot.slotNo });
		});
	}
});

module.exports = router;
