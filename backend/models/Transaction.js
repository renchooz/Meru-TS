import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    description: { type: String, default: "" },
    amount: { type: Number, required: true },
    payee: { type: String, default: "" },
    category: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", TransactionSchema);
