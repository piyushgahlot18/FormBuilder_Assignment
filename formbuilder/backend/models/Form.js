const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { type: String, enum: ["text", "textarea", "dropdown", "checkbox"], required: true },
  options: [String],
  required: { type: Boolean, default: false },
});

const formSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    fields: [fieldSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", formSchema);
