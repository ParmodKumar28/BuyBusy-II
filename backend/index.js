import express from 'express';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import cors from 'cors';
import bodyParser from "body-parser";
import crypto from "crypto";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
const razorpay = new Razorpay({
    key_id: process.env.RAZOR_TEST_KEY_ID,
    key_secret: process.env.RAZOR_TEST_KEY_SECRET,
});

app.get('/', (req,res) => {
    res.send('Busybuy backend is working fine:)');
});

// Endpoint to create Razorpay order
app.post("/create-order", async (req, res) => {
  const { amount, currency } = req.body;

  const options = {
    amount: amount * 100, // Convert to paise
    currency: currency || "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
});


// Endpoint to verify payment
app.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZOR_TEST_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, message: "Signature mismatch!" });
    }
  } catch (error) {
    console.error("Error in payment verification:", error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
});



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});