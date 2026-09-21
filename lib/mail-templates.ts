import nodemailer from "nodemailer";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";

export async function getSmtpTransporter() {
  let settings: any = {};
  try {
    if (adminDb && hasAdminCredentials) {
      const settingsSnap = await adminDb.collection("settings").doc("global").get();
      if (settingsSnap.exists) {
        settings = settingsSnap.data();
      }
    }
  } catch (e) {
    console.warn("Could not fetch global settings for SMTP:", e);
  }

  const smtpHost = process.env.SMTP_HOST || settings?.email?.smtpHost || process.env.GMAIL_HOST || 'smtp.hostinger.com';
  const smtpPort = Number(process.env.SMTP_PORT || settings?.email?.smtpPort || '465');
  const smtpUser = process.env.SMTP_USER || settings?.email?.smtpUser || process.env.GMAIL_USER || 'team@botmartz.com';
  const rawPass = process.env.SMTP_PASS || settings?.email?.smtpPass || process.env.GMAIL_APP_PASS || 'mrxz-sqbl-arab-cf6p';
  const smtpPass = (rawPass && rawPass !== '4ahz-gtmt-1tyv-zbfz') ? rawPass : 'mrxz-sqbl-arab-cf6p';

  if (!smtpUser || !smtpPass) {
    console.warn("⚠️ [SMTP Helper] Credentials not configured in settings/global or env variables!");
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: { rejectUnauthorized: false }
  });

  return { transporter, smtpUser };
}

export function buildRegistrationEmail(name: string, eventTitle: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Registration Received | Botmartz Community</title>
</head>
<body style="margin:0;padding:0;background:#050B14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050B14;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0A111F;border:1px solid #1E293B;border-radius:16px;overflow:hidden;padding:32px;">
          <tr>
            <td style="padding-bottom:24px;border-bottom:1px solid #1E293B;">
              <span style="font-size:16px;font-weight:800;color:#ffffff;text-transform:uppercase;">BOTMARTZ COMMUNITY</span>
              <span style="font-size:11px;color:#00B8F0;font-weight:600;margin-left:8px;font-family:monospace;">/ EVENTS</span>
            </td>
          </tr>
          <tr>
            <td style="padding-top:32px;padding-bottom:24px;">
              <p style="margin:0;font-size:14px;color:#00B8F0;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;font-family:monospace;margin-bottom:12px;">REGISTRATION RECEIVED</p>
              <h2 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;margin-bottom:16px;line-height:1.2;">Your Spot Request for ${eventTitle}</h2>
              <p style="margin:0;font-size:15px;color:#8A9EB0;line-height:1.6;margin-bottom:20px;">
                Hi ${name},<br/><br/>
                We have received your registration details for <strong>${eventTitle}</strong>. 
                Your digital ticket pass with unique QR verification will be issued upon payment / UTR approval.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildTicketPassEmail(data: {
  name: string;
  email: string;
  ticketId: string;
  eventTitle: string;
  tier: string;
  amountPaid: string;
  venue: string;
  date: string;
  qrDataUrl: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Your Verified Ticket Pass | Botmartz Community</title>
</head>
<body style="margin:0;padding:0;background:#050B14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050B14;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0A111F;border:1px solid #1E293B;border-radius:16px;overflow:hidden;padding:32px;">
          <tr>
            <td style="padding-bottom:24px;border-bottom:1px solid #1E293B;">
              <span style="font-size:16px;font-weight:800;color:#ffffff;text-transform:uppercase;">BOTMARTZ COMMUNITY</span>
              <span style="font-size:11px;color:#00B8F0;font-weight:600;margin-left:8px;font-family:monospace;">/ VERIFIED PASS</span>
            </td>
          </tr>
          <tr>
            <td style="padding-top:32px;padding-bottom:24px;">
              <p style="margin:0;font-size:14px;color:#00B8F0;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;font-family:monospace;margin-bottom:12px;">ADMISSION CONFIRMED</p>
              <h2 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;margin-bottom:16px;line-height:1.2;">Your Pass for ${data.eventTitle}</h2>
              <p style="margin:0;font-size:15px;color:#8A9EB0;line-height:1.6;margin-bottom:24px;">
                Hi ${data.name}, your registration has been verified. Present this pass or QR code at the check-in desk on arrival.
              </p>
              
              <div style="background:#050B14;border:1px solid #00B8F0;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                <img src="${data.qrDataUrl}" alt="Check-in QR Code" width="180" height="180" style="display:block;margin:0 auto 16px auto;background:#ffffff;padding:8px;border-radius:8px;" />
                <p style="margin:0;font-family:monospace;font-size:16px;color:#00B8F0;font-weight:700;">TICKET ID: ${data.ticketId}</p>
                <p style="margin:4px 0 0 0;font-size:13px;color:#94A3B8;">Tier: ${data.tier} | Paid: ${data.amountPaid}</p>
                <p style="margin:4px 0 0 0;font-size:13px;color:#94A3B8;">Date: ${data.date} | Venue: ${data.venue}</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildArenaEnrollmentEmail(data: {
  name: string;
  email: string;
  projectTitle: string;
  difficulty: string;
  projectId: string;
  teamType?: string;
  enrollmentId?: string;
  enrolledAt?: string;
  category?: string;
  overview?: string;
  productionSla?: string;
}): string {
  const prdUrl = `https://community.botmartz.com/arena/${data.projectId}`;
  const logUrl = `https://community.botmartz.com/arena/daily-log`;
  const walletUrl = `https://community.botmartz.com/arena/wallet`;
  const roadmapUrl = `https://community.botmartz.com/arena/roadmaps`;
  const formattedDate = data.enrolledAt ? new Date(data.enrolledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Slot Confirmed | Botmartz Virtual AI Internship</title>
</head>
<body style="margin:0;padding:0;background:#050B14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050B14;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0A111F;border:1px solid #1E293B;border-radius:16px;overflow:hidden;padding:32px;">
          <tr>
            <td style="padding-bottom:24px;border-bottom:1px solid #1E293B;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:16px;font-weight:800;color:#ffffff;text-transform:uppercase;">BOTMARTZ BUILDERS ARENA</span>
                  </td>
                  <td align="right">
                    <span style="font-size:10px;font-weight:700;color:#00B8F0;background:rgba(0,184,240,0.1);border:1px solid rgba(0,184,240,0.3);padding:4px 10px;border-radius:20px;font-family:monospace;">
                      CONFIRMED
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top:32px;padding-bottom:24px;">
              <p style="margin:0 0 8px 0;font-size:13px;color:#00B8F0;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;font-family:monospace;">SLOT RESERVED &amp; TRACK ACTIVE</p>
              <h2 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;">Welcome to the Virtual AI Internship Track, ${data.name}!</h2>
              
              <p style="margin:0 0 24px 0;font-size:15px;color:#8A9EB0;line-height:1.6;">
                You are officially enrolled in <strong>${data.projectTitle}</strong> (<span style="color:#00B8F0;font-family:monospace;">${data.difficulty} Tier</span>). Your technical workspace and daily proof-of-work tracking are now live.
              </p>

              <!-- Detailed Project Blueprint Card -->
              <div style="background:#050B14;border:1.5px solid #1E293B;border-radius:14px;padding:24px;margin-bottom:24px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                  <tr>
                    <td>
                      <span style="font-size:11px;color:#00B8F0;text-transform:uppercase;font-family:monospace;font-weight:700;">PROJECT BLUEPRINT SUMMARY</span>
                    </td>
                    <td align="right">
                      <span style="font-size:11px;color:#94A3B8;font-family:monospace;">ID: ${data.enrollmentId || data.projectId}</span>
                    </td>
                  </tr>
                </table>

                <h3 style="margin:0 0 8px 0;font-size:20px;color:#ffffff;font-weight:800;">${data.projectTitle}</h3>
                ${data.overview ? `<p style="margin:0 0 16px 0;font-size:13px;color:#CBD5E1;line-height:1.6;">${data.overview}</p>` : ''}
                
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A111F;border-radius:10px;padding:12px;font-size:13px;color:#8A9EB0;line-height:1.6;font-family:monospace;">
                  <tr>
                    <td style="padding:4px 0;">Difficulty Tier: <strong style="color:#00B8F0;">${data.difficulty}</strong></td>
                    <td style="padding:4px 0;" align="right">Enrollment Date: <strong style="color:#ffffff;">${formattedDate}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">Team Format: <strong style="color:#ffffff;">${data.teamType || "Solo Shipper"}</strong></td>
                    <td style="padding:4px 0;" align="right">Duration: <strong style="color:#ffffff;">45 Days</strong></td>
                  </tr>
                  ${data.productionSla ? `
                  <tr>
                    <td colspan="2" style="padding-top:8px;border-top:1px solid #1E293B;color:#10B981;">
                      Production SLA Target: <strong style="color:#ffffff;">${data.productionSla}</strong>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- IMPORTANT DAILY TRACKING & UNLOCKING INSTRUCTIONS -->
              <div style="background:rgba(0,102,255,0.08);border:1.5px solid #0066FF;border-radius:14px;padding:20px;margin-bottom:24px;">
                <h4 style="margin:0 0 10px 0;font-size:15px;color:#00B8F0;font-weight:800;text-transform:uppercase;font-family:sans-serif;">
                  📌 CRITICAL: Daily Tracking, Perks &amp; Unlocking Next PRDs
                </h4>
                <ul style="margin:0;padding-left:18px;font-size:13px;color:#CBD5E1;line-height:1.7;">
                  <li style="margin-bottom:8px;">
                    <strong style="color:#ffffff;">Log Daily Proof of Work:</strong> Submit your daily GitHub commit URL at <a href="${logUrl}" style="color:#00B8F0;text-decoration:underline;">botmartz.com/arena/daily-log</a> to build your GitHub activity streak and earn <strong>+20 to +70 Karma Coins every day</strong>.
                  </li>
                  <li style="margin-bottom:8px;">
                    <strong style="color:#ffffff;">Mark Project Completed:</strong> When you finish your PRD tasks or Day 45, click <strong>&quot;Mark Project Completed&quot;</strong> in your project workspace to claim your <strong>+500 Karma Coins Bonus</strong>!
                  </li>
                  <li style="margin-bottom:8px;">
                    <strong style="color:#ffffff;">Redeem Perks &amp; Grants:</strong> Spend your Karma Coins at <a href="${walletUrl}" style="color:#00B8F0;text-decoration:underline;">botmartz.com/arena/wallet</a> for 1-on-1 founder clinics, AWS/GPU cloud compute grants, and swag kits.
                  </li>
                  <li>
                    <strong style="color:#ffffff;">Unlock Next PRD:</strong> Marking your current project completed immediately frees up your slot so you can enroll in your next Arena system!
                  </li>
                </ul>
              </div>

              <!-- CTA Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${prdUrl}" style="display:inline-block;padding:14px 32px;background:#0066FF;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:12px;text-transform:uppercase;letter-spacing:0.05em;font-family:monospace;box-shadow:0 4px 16px rgba(0,102,255,0.4);">
                      Open Architecture PRD Blueprint &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Community Links -->
              <div style="background:#0F172A;border-radius:12px;padding:16px;text-align:center;">
                <p style="margin:0 0 8px 0;font-size:13px;color:#94A3B8;">Join 500+ builders in live engineering pulse channels:</p>
                <a href="https://discord.gg/botmartz" style="color:#00B8F0;text-decoration:none;font-weight:600;font-size:13px;margin:0 8px;">Discord Server &rarr;</a>
                <a href="https://community.botmartz.com/arena/calendar" style="color:#00B8F0;text-decoration:none;font-weight:600;font-size:13px;margin:0 8px;">Saturday Office Hours &rarr;</a>
              </div>
            </td>
          </tr>
          <tr>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildKarmaCoinsSpentEmail(data: {
  email: string;
  amount: number;
  reason: string;
  newBalance: number;
  referenceId?: string;
  fulfillmentCode?: string;
}): string {
  const walletUrl = "https://community.botmartz.com/arena/wallet";
  const dateStr = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata"
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Karma Coins Spend Confirmation | Botmartz Community</title>
</head>
<body style="margin:0;padding:0;background:#050B14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050B14;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0A111F;border:1px solid #1E293B;border-radius:16px;overflow:hidden;padding:32px;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;border-bottom:1px solid #1E293B;">
              <span style="font-size:16px;font-weight:800;color:#ffffff;text-transform:uppercase;">BOTMARTZ COMMUNITY</span>
              <span style="font-size:11px;color:#F59E0B;font-weight:700;margin-left:8px;font-family:monospace;">/ KARMA WALLET</span>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding-top:28px;padding-bottom:24px;">
              <div style="display:inline-block;padding:4px 12px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.4);border-radius:20px;color:#F59E0B;font-size:11px;font-weight:700;font-family:monospace;letter-spacing:0.05em;margin-bottom:16px;">
                ✓ TRANSACTION DEBIT CONFIRMED
              </div>

              <h2 style="margin:0 0 12px 0;font-size:24px;font-weight:800;color:#ffffff;line-height:1.2;">
                Karma Coins Spent Notice
              </h2>

              <p style="margin:0 0 20px 0;font-size:14px;color:#94A3B8;line-height:1.6;">
                This email confirms that <strong>${data.amount} Karma Coins</strong> have been debited from your Botmartz wallet for the following activity:
              </p>

              <!-- Transaction Summary Box -->
              <div style="background:#050B14;border:1px solid #1E293B;border-radius:14px;padding:20px;margin-bottom:24px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#CBD5E1;font-family:monospace;line-height:1.8;">
                  <tr>
                    <td style="color:#64748B;">Coins Debited:</td>
                    <td align="right" style="color:#EF4444;font-weight:800;font-size:15px;">-${data.amount} Karma Coins</td>
                  </tr>
                  <tr>
                    <td style="color:#64748B;">Reason / Item:</td>
                    <td align="right" style="color:#ffffff;font-weight:700;">${data.reason}</td>
                  </tr>
                  ${data.fulfillmentCode ? `
                  <tr>
                    <td style="color:#64748B;">Voucher / Ref Code:</td>
                    <td align="right" style="color:#00B8F0;font-weight:800;">${data.fulfillmentCode}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="color:#64748B;">Updated Wallet Balance:</td>
                    <td align="right" style="color:#10B981;font-weight:800;">${data.newBalance} Karma Coins</td>
                  </tr>
                  <tr>
                    <td style="color:#64748B;">Timestamp:</td>
                    <td align="right" style="color:#94A3B8;">${dateStr}</td>
                  </tr>
                </table>
              </div>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${walletUrl}" style="display:inline-block;padding:14px 28px;background:#0066FF;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;border-radius:12px;text-transform:uppercase;letter-spacing:0.05em;font-family:monospace;box-shadow:0 4px 16px rgba(0,102,255,0.4);">
                      View Karma Wallet Ledger &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;color:#64748B;line-height:1.5;text-align:center;">
                If you did not authorize this transaction, please contact team@botmartz.com immediately.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top:20px;border-top:1px solid #1E293B;font-size:11px;color:#475569;line-height:1.5;text-align:center;font-family:monospace;">
              Botmartz Community &bull; Cryptographic Karma Coins Ledger &bull; Pure Proof-of-Work
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

