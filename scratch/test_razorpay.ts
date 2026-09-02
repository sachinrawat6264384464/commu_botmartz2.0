import Razorpay from "razorpay";

async function testRazorpay() {
  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  console.log("Testing Razorpay with Key ID:", key_id);
  if (!key_id || !key_secret) {
    console.error("Missing Razorpay keys in env.");
    process.exit(1);
  }

  const rzp = new Razorpay({
    key_id,
    key_secret
  });

  try {
    const order = await rzp.orders.create({
      amount: 29900, // 299 INR in paise
      currency: "INR",
      receipt: `test_rcpt_${Date.now()}`,
      notes: {
        test: "Botmartz Fellowship Test"
      }
    });

    console.log("✔ Razorpay Order successfully created:", order.id, "Amount:", order.amount, "Currency:", order.currency);
  } catch (e: any) {
    console.error("❌ Razorpay order creation failed:", e);
  }
}

testRazorpay();
