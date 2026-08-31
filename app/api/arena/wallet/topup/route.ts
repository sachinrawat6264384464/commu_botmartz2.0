import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Strictly lock down: All Karma Coin purchases must proceed through cryptographically verified Razorpay Checkout
  return NextResponse.json(
    {
      error: "Direct coin top-ups are disabled for security. Please initiate your purchase through Razorpay checkout.",
      checkoutEndpoint: "/api/checkout/create-order"
    },
    { status: 403 }
  );
}
