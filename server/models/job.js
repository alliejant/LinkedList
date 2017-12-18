const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
	{
		title: String,
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company"
		},
		salary: Number,
		equity: Number
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Job", jobSchema);
