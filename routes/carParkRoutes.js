const e = require("express");
const express = require("express");

const router = express.Router();

const CarPark = require("../models/carparkSchema");

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
			if (count <= process.env.ParkingCapacity) {
				const newSlot = new CarPark();

				console.log(CarPark.find().sort({ field }));
				newSlot.slotNo = CarPark.find({ slotNo: { $max } });

				newSlot.carNo = req.body.carNo;
				newSlot.slotAvailable = false;
				newSlot
					.save()
					.then((newSlot) => res.status(200).send("Car is parked at Slot " + newSlot.slotNo))
					.catch((err) => console.log(err));
			} else {
				res.status(400).send("No Empty slot found!");
			}
		});

		// const newSlot = new CarPark();
	}
	// if(ParkingSlot)
	// const newEntry = new CarPark({
	// 	carNo: req.body.carNo,
	// 	slotNo: 10,
	// 	slotAvailable: false,
	// });
});

//2
router.post("/unparkCar", async (req, res) => {
	await CarPark.findOneAndUpdate({ slotNo: req.body.slotNo }).exec((err, ParkingSlot) => {
		if (ParkingSlot.slotAvailable == false) {
			ParkingSlot.slotAvailable = true;
			ParkingSlot.carNo = "";
			ParkingSlot.save()
				.then(res.status(200).send())
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
			const slotNo = ParkingSlot.slotNo;
			const carNo = ParkingSlot.carNo;
			res.status(200).send({ carNo, slotNo });
		});
	} else if (req.body.slotNo) {
		await CarPark.findOne({ slotNo: req.body.slotNo }).exec((err, ParkingSlot) => {
			const carNo = ParkingSlot.carNo;
			const slotNo = ParkingSlot.slotNo;
			res.status(200).send({ carNo, slotNo });
		});
	}
});

module.exports = router;
