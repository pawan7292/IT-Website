import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// ─── Config ───────────────────────────────────────────────────────────────────
// Required env vars in .env.local:
//   SMTP_HOST=smtp.gmail.com          (or your host's SMTP)
//   SMTP_PORT=587
//   SMTP_USER=info@digitalmarmat.com  (your sending Gmail account)
//   SMTP_PASS=xxxx xxxx xxxx xxxx     (Gmail App Password — not your login password)

const TO_EMAIL   = 'techdigitalmarmat@gmail.com'
const FROM_NAME  = 'Digital Marmat Website'

// Singleton — reuses the SMTP connection across warm requests
let _transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  if (_transporter) return _transporter

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error('SMTP credentials not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env.local')
  }

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    pool: true,       // keep connection alive across sends
    maxConnections: 3,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  })

  return _transporter
}

// ─── Email to Digital Marmat (lead notification) ─────────────────────────────

function buildLeadEmail(data: {
  name: string; email: string; phone: string
  service: string; budget: string; message: string
}) {
  const { name, email, phone, service, budget, message } = data
  const receivedAt = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kathmandu',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  return /* html */`
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1B2738 0%,#1E73D8 100%);padding:36px 40px;">
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.65);font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">Digital Marmat</p>
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">New Client Enquiry 🎉</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.70);font-size:14px;">You have a new lead from your website contact form.</p>
    </div>

    <!-- Alert banner -->
    <div style="background:#EEF6FF;border-left:4px solid #1E73D8;padding:16px 24px;margin:28px 28px 0;">
      <p style="margin:0;color:#1E73D8;font-weight:700;font-size:15px;">Service Requested: ${service}</p>
      <p style="margin:6px 0 0;color:#555;font-size:13px;">Reply to this email to reach ${name} directly.</p>
    </div>

    <!-- Details -->
    <div style="padding:28px 40px;">
      <h2 style="margin:0 0 20px;font-size:16px;color:#1B2738;font-weight:700;border-bottom:2px solid #f0f0f0;padding-bottom:12px;">Contact Details</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ['👤 Full Name',      name],
          ['✉️ Email',          `<a href="mailto:${email}" style="color:#1E73D8;text-decoration:none;">${email}</a>`],
          ['📞 Phone',          phone || '<span style="color:#999;">Not provided</span>'],
          ['🛠 Service',        service],
          ['💰 Budget Range',   budget || '<span style="color:#999;">Not specified</span>'],
        ].map(([label, value]) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f5f5f5;color:#888;font-size:13px;width:160px;vertical-align:top;font-weight:600;">${label}</td>
          <td style="padding:12px 0;border-bottom:1px solid #f5f5f5;color:#1B2738;font-size:14px;">${value}</td>
        </tr>`).join('')}
      </table>

      <!-- Message -->
      <div style="margin-top:28px;background:#F8FAFC;border-radius:10px;padding:20px 24px;border:1px solid #E8EEF4;">
        <p style="margin:0 0 12px;font-size:12px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Project Message</p>
        <p style="margin:0;color:#2d3748;font-size:15px;line-height:1.75;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>

      <!-- CTA Button -->
      <div style="margin-top:32px;text-align:center;">
        <a href="mailto:${email}?subject=Re: Your ${service} Enquiry — Digital Marmat"
           style="display:inline-block;background:linear-gradient(135deg,#1B2738,#1E73D8);color:#ffffff;padding:14px 40px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.3px;">
          Reply to ${name}
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#F8FAFC;padding:20px 40px;border-top:1px solid #EFEFEF;">
      <p style="margin:0;color:#aaa;font-size:12px;text-align:center;">
        Received via <strong style="color:#888;">digitalmarmat.com</strong> contact form &nbsp;·&nbsp; ${receivedAt} (NPT)
      </p>
    </div>
  </div>
</body>
</html>`
}

// ─── Confirmation email to the client ────────────────────────────────────────

function buildConfirmationEmail(name: string, service: string) {
  return /* html */`
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1B2738 0%,#1E73D8 100%);padding:36px 40px;text-align:center;">
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.65);font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">Digital Marmat · IT Service</p>
      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">Thank You, ${name}! 🙌</h1>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <p style="margin:0 0 20px;color:#2d3748;font-size:16px;line-height:1.7;">
        We've received your enquiry about <strong style="color:#1E73D8;">${service}</strong> and we're excited to learn more about your project.
      </p>
      <p style="margin:0 0 20px;color:#555;font-size:15px;line-height:1.7;">
        A member of our team will review your message and get back to you within <strong>24 hours</strong> (Monday–Friday). If your project is urgent, feel free to reach us directly:
      </p>

      <!-- Contact info -->
      <div style="background:#F0F7FF;border-radius:12px;padding:24px 28px;margin:24px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#1E73D8;font-size:14px;width:28px;">📞</td><td style="padding:8px 0;color:#1B2738;font-size:14px;font-weight:600;">+977 9802362213</td></tr>
          <tr><td style="padding:8px 0;color:#25D366;font-size:14px;">💬</td><td style="padding:8px 0;color:#1B2738;font-size:14px;font-weight:600;">WhatsApp: +977 9802362213</td></tr>
          <tr><td style="padding:8px 0;color:#1E73D8;font-size:14px;">✉️</td><td style="padding:8px 0;color:#1B2738;font-size:14px;font-weight:600;">info@digitalmarmat.com</td></tr>
        </table>
      </div>

      <!-- What's next -->
      <h2 style="margin:28px 0 16px;font-size:16px;color:#1B2738;font-weight:700;">What happens next?</h2>
      <div style="display:block;margin-bottom:16px;">
        ${[
          ['1', 'Our team reviews your enquiry and prepares tailored questions'],
          ['2', 'We schedule a free 30-minute discovery call at a time that suits you'],
          ['3', 'You receive a detailed proposal with timeline and transparent pricing'],
        ].map(([n, text]) => `
        <div style="display:flex;align-items:flex-start;margin-bottom:14px;">
          <span style="min-width:28px;height:28px;background:#1E73D8;border-radius:50%;color:white;font-size:13px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;margin-right:14px;margin-top:2px;">${n}</span>
          <p style="margin:0;color:#555;font-size:14px;line-height:1.6;">${text}</p>
        </div>`).join('')}
      </div>

      <div style="margin-top:32px;text-align:center;">
        <a href="https://digitalmarmat.com/portfolio"
           style="display:inline-block;background:linear-gradient(135deg,#1B2738,#1E73D8);color:#ffffff;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;">
          View Our Work →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#F8FAFC;padding:24px 40px;border-top:1px solid #EFEFEF;text-align:center;">
      <p style="margin:0 0 6px;color:#888;font-size:13px;font-weight:600;">Digital Marmat · IT Service</p>
      <p style="margin:0;color:#aaa;font-size:12px;">Kathmandu, Nepal &nbsp;·&nbsp; digitalmarmat.com</p>
    </div>
  </div>
</body>
</html>`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, phone, service, budget, message } = body as {
    name: string; email: string; phone?: string
    service: string; budget?: string; message: string
  }

  if (!name?.trim() || !email?.trim() || !service?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Name, email, service, and message are required.' }, { status: 400 })
  }

  try {
    const transporter = getTransporter()
    const fromAddress  = `"${FROM_NAME}" <${process.env.SMTP_USER}>`

    // Send both emails in parallel — cuts wait time roughly in half
    await Promise.all([
      transporter.sendMail({
        from:    fromAddress,
        replyTo: `"${name}" <${email}>`,
        to:      TO_EMAIL,
        subject: `🚀 New Lead: ${service} — ${name}`,
        html:    buildLeadEmail({ name, email, phone: phone ?? '', service, budget: budget ?? '', message }),
      }),
      transporter.sendMail({
        from:    fromAddress,
        to:      email,
        subject: `We received your message — Digital Marmat`,
        html:    buildConfirmationEmail(name, service),
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Email send failed'
    console.error('[Contact API]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
