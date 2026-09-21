import { NextResponse } from "next/server";
import { emailProvider } from "@/lib/email/provider";
import { buildKarmaCoinsSpentEmail } from "@/lib/mail-templates";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetEmail = searchParams.get("email") || "team@botmartz.com";

    const emailHtml = buildKarmaCoinsSpentEmail({
      email: targetEmail,
      amount: 300,
      reason: "Redeemed Perk: 1-on-1 Founder Architecture Audit",
      newBalance: 1850,
      fulfillmentCode: "PERK-TEST-998822"
    });

    const result = await emailProvider.sendEmail({
      to: targetEmail,
      subject: "Test: Karma Coins Spend Confirmation | Botmartz",
      html: emailHtml
    });

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      sentTo: targetEmail
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
