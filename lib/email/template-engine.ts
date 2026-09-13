import { buildUnsubscribeUrl } from './tokens';

export interface EmailTemplateData {
  subject: string;
  html: string;
  text: string;
}

export function sanitizeInput(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return '';
  const str = String(input);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderVariables(template: string, vars: Record<string, any>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    const rawVal = value !== undefined && value !== null ? String(value) : '';
    // Unsafe keys like URLs shouldn't be HTML-escaped if they are in href attributes
    const valToInject = key.endsWith('_url') || key.endsWith('Url') ? rawVal : sanitizeInput(rawVal);
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, valToInject);
  }
  return result;
}

export function wrapInBaseLayout(params: {
  title: string;
  badge: string;
  contentHtml: string;
  unsubscribeUrl?: string;
  recipientEmail?: string;
}): string {
  const unsubLinkHtml = params.unsubscribeUrl
    ? `<p style="margin:8px 0 0 0;"><a href="${params.unsubscribeUrl}" style="color:#64748B;text-decoration:underline;">Unsubscribe from marketing emails</a></p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${sanitizeInput(params.title)}</title>
</head>
<body style="margin:0;padding:0;background:#040914;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#F8FAFC;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#040914;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0A1124;border:1px solid #1E293B;border-radius:16px;overflow:hidden;padding:32px;box-shadow:0 20px 40px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;border-bottom:1px solid #1E293B;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:18px;font-weight:900;letter-spacing:-0.5px;color:#FFFFFF;text-transform:uppercase;">BOTMARTZ</span>
                    <span style="font-size:18px;font-weight:900;letter-spacing:-0.5px;color:#00B8F0;">.COMMUNITY</span>
                  </td>
                  <td align="right">
                    <span style="font-size:10px;font-weight:700;color:#00B8F0;background:rgba(0,184,240,0.1);border:1px solid rgba(0,184,240,0.25);padding:4px 10px;border-radius:20px;font-family:monospace;letter-spacing:0.05em;text-transform:uppercase;">
                      ${sanitizeInput(params.badge)}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content Body -->
          <tr>
            <td style="padding-top:32px;padding-bottom:32px;">
              ${params.contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;border-top:1px solid #1E293B;font-size:12px;color:#64748B;line-height:1.6;text-align:center;">
              <p style="margin:0;">Botmartz Community &bull; AI Engineering &amp; Proof-of-Work Platform</p>
              <p style="margin:4px 0 0 0;">Indore AI Hub &bull; Protected under DPDP Privacy Guidelines.</p>
              ${unsubLinkHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function compileTemplate(templateKey: string, vars: Record<string, any>): EmailTemplateData {
  const email = vars.user_email || vars.email || '';
  const name = vars.user_name || vars.name || 'Builder';
  const appUrl = vars.app_url || process.env.NEXT_PUBLIC_APP_URL || 'https://community.botmartz.com';
  const unsubUrl = vars.unsubscribe_url || (email ? buildUnsubscribeUrl(email, appUrl) : '');

  const defaultVars = {
    user_name: name,
    user_email: email,
    app_url: appUrl,
    unsubscribe_url: unsubUrl,
    action_url: vars.action_url || appUrl,
    ...vars,
  };

  switch (templateKey) {
    case 'WELCOME': {
      const subject = `Welcome to Botmartz Community, ${name}! 🚀`;
      const body = `
        <p style="margin:0 0 12px 0;font-size:14px;color:#00B8F0;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;font-family:monospace;">ACCOUNT ACTIVATED</p>
        <h2 style="margin:0 0 16px 0;font-size:24px;font-weight:800;color:#FFFFFF;line-height:1.2;">Welcome to the Developer Ecosystem</h2>
        <p style="margin:0 0 20px 0;font-size:15px;color:#94A3B8;line-height:1.6;">
          Hi <strong>${sanitizeInput(name)}</strong>,<br/><br/>
          We are thrilled to have you join Botmartz Community! Your developer portal is now ready. You can explore real-world AI Arena challenges, register for upcoming bootcamps, connect with tech leaders, and build your proof-of-work portfolio.
        </p>

        <div style="background:#050B14;border:1px solid #1E293B;border-radius:12px;padding:20px;margin-bottom:24px;">
          <h4 style="margin:0 0 8px 0;font-size:14px;color:#00B8F0;text-transform:uppercase;font-family:monospace;">Quick Start Blueprint</h4>
          <ul style="margin:0;padding-left:20px;font-size:14px;color:#CBD5E1;line-height:1.7;">
            <li>Complete your profile & link your GitHub.</li>
            <li>Explore 50+ real-world AI & Web3 project roadmaps.</li>
            <li>Enroll in Arena internships & log your daily proof of work.</li>
          </ul>
        </div>

        <!-- Official WhatsApp Community Group Invite -->
        <div style="background:rgba(37,211,102,0.08);border:1.5px solid rgba(37,211,102,0.3);border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
          <h4 style="margin:0 0 6px 0;font-size:15px;color:#25D366;font-weight:800;text-transform:uppercase;font-family:sans-serif;">💬 Join Official WhatsApp Builder Group</h4>
          <p style="margin:0 0 16px 0;font-size:13px;color:#CBD5E1;line-height:1.5;">
            Connect directly with founders, AI mentors, and fellow builders. Get instant notifications for live bootcamps and sprint teardowns.
          </p>
          <a href="https://chat.whatsapp.com/DkzKwpjuktaCYAofOtMlAQ" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 28px;background:#25D366;color:#000000;text-decoration:none;font-weight:900;font-size:13px;border-radius:10px;text-transform:uppercase;letter-spacing:0.05em;box-shadow:0 4px 14px rgba(37,211,102,0.35);">
            Join WhatsApp Community &rarr;
          </a>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td align="center">
              <a href="${defaultVars.action_url}" style="display:inline-block;padding:14px 32px;background:#0066FF;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:10px;text-transform:uppercase;letter-spacing:0.05em;box-shadow:0 4px 16px rgba(0,102,255,0.4);">
                Go to Developer Dashboard &rarr;
              </a>
            </td>
          </tr>
        </table>
      `;

      return {
        subject,
        html: wrapInBaseLayout({
          title: subject,
          badge: 'ONBOARDING',
          contentHtml: body,
          unsubscribeUrl: unsubUrl,
          recipientEmail: email,
        }),
        text: `Hi ${name}, welcome to Botmartz Community! Join WhatsApp Community: https://chat.whatsapp.com/DkzKwpjuktaCYAofOtMlAQ | Dashboard: ${defaultVars.action_url}`,
      };
    }

    case 'NEWSLETTER_WELCOME': {
      const subject = `Confirmed: You're on the Botmartz Newsletter! 📬`;
      const body = `
        <p style="margin:0 0 12px 0;font-size:14px;color:#00B8F0;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;font-family:monospace;">SUBSCRIPTION CONFIRMED</p>
        <h2 style="margin:0 0 16px 0;font-size:24px;font-weight:800;color:#FFFFFF;line-height:1.2;">You're All Set for Insider Engineering Updates</h2>
        <p style="margin:0 0 20px 0;font-size:15px;color:#94A3B8;line-height:1.6;">
          Hi ${sanitizeInput(name)},<br/><br/>
          Thank you for subscribing to the Botmartz Weekly Dispatch! Expect high-impact technical deep dives, AI architecture breakdowns, bootcamps, and career opportunities delivered straight to your inbox.
        </p>

        <div style="background:rgba(0,184,240,0.05);border:1px solid rgba(0,184,240,0.2);border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
          <p style="margin:0;font-size:14px;color:#00B8F0;font-weight:600;">No Spam. 100% High-Signal Engineering Content.</p>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td align="center">
              <a href="${defaultVars.app_url}" style="display:inline-block;padding:14px 32px;background:#0066FF;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:10px;text-transform:uppercase;letter-spacing:0.05em;">
                Explore Latest Articles &rarr;
              </a>
            </td>
          </tr>
        </table>
      `;

      return {
        subject,
        html: wrapInBaseLayout({
          title: subject,
          badge: 'NEWSLETTER',
          contentHtml: body,
          unsubscribeUrl: unsubUrl,
          recipientEmail: email,
        }),
        text: `Hi ${name}, your subscription to Botmartz newsletter is confirmed!`,
      };
    }

    case 'DRIP_STEP_1_FEATURES': {
      const subject = `Day 1: Level up your career with Botmartz Arena ⚡`;
      const body = `
        <p style="margin:0 0 12px 0;font-size:14px;color:#00B8F0;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;font-family:monospace;">INSIGHTS // DAY 1</p>
        <h2 style="margin:0 0 16px 0;font-size:24px;font-weight:800;color:#FFFFFF;line-height:1.2;">Build Proof of Work, Not Just Certificates</h2>
        <p style="margin:0 0 20px 0;font-size:15px;color:#94A3B8;line-height:1.6;">
          Hi ${sanitizeInput(name)},<br/><br/>
          Traditional resumes are obsolete. Modern tech companies hire based on verifiable proof of work. That's why we created <strong>Botmartz Arena</strong>.
        </p>

        <div style="background:#050B14;border:1px solid #1E293B;border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 8px 0;font-size:13px;color:#00B8F0;font-weight:700;text-transform:uppercase;font-family:monospace;">What you get inside Arena:</p>
          <p style="margin:0;font-size:14px;color:#CBD5E1;line-height:1.6;">
            &bull; Real production PRDs & system design requirements<br/>
            &bull; Automated code auditing & latency SLA targets<br/>
            &bull; Live daily log tracking heatmap for GitHub activity
          </p>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td align="center">
              <a href="${defaultVars.app_url}/arena" style="display:inline-block;padding:14px 32px;background:#0066FF;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:10px;text-transform:uppercase;">
                Check Arena Track PRDs &rarr;
              </a>
            </td>
          </tr>
        </table>
      `;

      return {
        subject,
        html: wrapInBaseLayout({
          title: subject,
          badge: 'DRIP // DAY 1',
          contentHtml: body,
          unsubscribeUrl: unsubUrl,
          recipientEmail: email,
        }),
        text: `Hi ${name}, check out Botmartz Arena to build proof of work: ${defaultVars.app_url}/arena`,
      };
    }

    case 'DRIP_STEP_2_GETTING_STARTED': {
      const subject = `Day 3: Unlock 50+ Career Roadmaps & Tech Directories 🗺️`;
      const body = `
        <p style="margin:0 0 12px 0;font-size:14px;color:#00B8F0;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;font-family:monospace;">INSIGHTS // DAY 3</p>
        <h2 style="margin:0 0 16px 0;font-size:24px;font-weight:800;color:#FFFFFF;line-height:1.2;">Your Personalized Engineering Roadmap</h2>
        <p style="margin:0 0 20px 0;font-size:15px;color:#94A3B8;line-height:1.6;">
          Hi ${sanitizeInput(name)},<br/><br/>
          Whether you aspire to become a Full-Stack AI Engineer, DevOps Architect, or Systems Specialist, having a clear roadmap saves months of trial and error.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td align="center">
              <a href="${defaultVars.app_url}/roadmaps" style="display:inline-block;padding:14px 32px;background:#0066FF;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:10px;text-transform:uppercase;">
                View 50 Career Roadmaps &rarr;
              </a>
            </td>
          </tr>
        </table>
      `;

      return {
        subject,
        html: wrapInBaseLayout({
          title: subject,
          badge: 'DRIP // DAY 3',
          contentHtml: body,
          unsubscribeUrl: unsubUrl,
          recipientEmail: email,
        }),
        text: `Hi ${name}, view 50 Career Roadmaps on Botmartz: ${defaultVars.app_url}/roadmaps`,
      };
    }

    case 'TRANSACTIONAL':
    default: {
      const subject = renderVariables(vars.subject || 'Notification from Botmartz Community', defaultVars);
      const customContent = renderVariables(vars.content || vars.message || '<p>You have a new update from Botmartz.</p>', defaultVars);
      
      const body = `
        <h2 style="margin:0 0 16px 0;font-size:22px;font-weight:800;color:#FFFFFF;">${subject}</h2>
        <div style="font-size:15px;color:#CBD5E1;line-height:1.6;">
          ${customContent}
        </div>
      `;

      return {
        subject,
        html: wrapInBaseLayout({
          title: subject,
          badge: vars.badge || 'TRANSACTIONAL',
          contentHtml: body,
          unsubscribeUrl: vars.is_marketing ? unsubUrl : undefined,
          recipientEmail: email,
        }),
        text: renderVariables(vars.text || `${subject}\n\nVisit: ${defaultVars.action_url}`, defaultVars),
      };
    }
  }
}
