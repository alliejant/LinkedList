const bcrypt = require("bcrypt");
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
userSchema.pre("save", async function(next) {
  var user = this;
  console.log("isModified", user.isModified("password"));
  if (!user.isModified("password")) return next();
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (e) {
    next(e);
  }
});
userSchema.methods.comparePassword = function(candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return next(err);
    next(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
