const mongoose = require("mongoose");

const CarParkSchema = new mongoose.Schema({
	slotAvailable: {
		type: Boolean,
		required: true,
	},
	slotNo: {
		type: String,
		required: true,
	},
	carNo: {
		type: String,
		required: false,
	},
});

module.exports = mongoose.model("CarPark", CarParkSchema);
