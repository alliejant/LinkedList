const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    currentCompany: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    photo: String,
    experience: [
      {
        jobTitle: String,
        company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
        startDate: Date,
        endDate: Date
      }
    ],
    education: [
      {
        institution: String,
        degree: String,
        endDate: Date
      }
    ],
    skills: [String]
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", user => {


})

userSchema.post("findOneAndUpdate", user => {
    if (this.isModified(this.currentCompany){
        if()

    }
})

userSchema.pre("findOneAndRemove", user => {

})


module.exports = mongoose.model("User", userSchema);
