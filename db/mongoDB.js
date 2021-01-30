const mongoose = require("mongoose");

const db = process.env.MongoURI;

mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(() => {
		console.log("MongoDB Connected!");

		// Droping DataBase
		// mongoose.connection.db.dropCollection("carparks", (err, result) => {
		// 	if (err) {
		// 		console.log("Collection Droped!");
		// 	}
		// });
	})
	.catch((err) => {
		console.log(err);
	});
