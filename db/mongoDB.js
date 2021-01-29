const mongoose = require("mongoose");

const db = process.env.MongoURI;

mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(() => console.log("MongoDB Connected!"))
	.catch((err) => {
		console.log(err);
	});
