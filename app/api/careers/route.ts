import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const TO_EMAIL  = 'techdigitalmarmat@gmail.com'
const FROM_NAME = 'Digital Marmat Careers'

// Singleton — reuses the SMTP connection across warm requests
let _transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (_transporter) return _transporter

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error('SMTP credentials not configured.')
  }

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    pool: true,
    maxConnections: 3,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  })

  return _transporter
}

function buildApplicationEmail(data: {
  name: string; email: string; position: string; message: string; cvName: string
}) {
  const { name, email, position, message, cvName } = data
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
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

    <div style="background:linear-gradient(135deg,#1B2738 0%,#1E73D8 100%);padding:36px 40px;">
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.65);font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">Digital Marmat Careers</p>
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">New Job Application 📋</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.70);font-size:14px;">Someone has applied for the ${position} role.</p>
    </div>

    <div style="background:#EEF6FF;border-left:4px solid #1E73D8;padding:16px 24px;margin:28px 28px 0;">
      <p style="margin:0;color:#1E73D8;font-weight:700;font-size:15px;">Position: ${position}</p>
      <p style="margin:6px 0 0;color:#555;font-size:13px;">CV attached to this email. Reply to contact ${name} directly.</p>
    </div>

    <div style="padding:28px 40px;">
      <h2 style="margin:0 0 20px;font-size:16px;color:#1B2738;font-weight:700;border-bottom:2px solid #f0f0f0;padding-bottom:12px;">Applicant Details</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ['👤 Full Name',   name],
          ['✉️ Email',       `<a href="mailto:${email}" style="color:#1E73D8;text-decoration:none;">${email}</a>`],
          ['💼 Position',    position],
          ['📄 CV File',     cvName || '<span style="color:#999;">Not attached</span>'],
        ].map(([label, value]) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f5f5f5;color:#888;font-size:13px;width:160px;vertical-align:top;font-weight:600;">${label}</td>
          <td style="padding:12px 0;border-bottom:1px solid #f5f5f5;color:#1B2738;font-size:14px;">${value}</td>
        </tr>`).join('')}
      </table>

      ${message ? `
      <div style="margin-top:28px;background:#F8FAFC;border-radius:10px;padding:20px 24px;border:1px solid #E8EEF4;">
        <p style="margin:0 0 12px;font-size:12px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Cover Note</p>
        <p style="margin:0;color:#2d3748;font-size:15px;line-height:1.75;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>` : ''}

      <div style="margin-top:32px;text-align:center;">
        <a href="mailto:${email}?subject=Re: Your Application for ${position} — Digital Marmat"
           style="display:inline-block;background:linear-gradient(135deg,#1B2738,#1E73D8);color:#fff;padding:14px 40px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;">
          Reply to ${name}
        </a>
      </div>
    </div>

    <div style="background:#F8FAFC;padding:20px 40px;border-top:1px solid #EFEFEF;">
      <p style="margin:0;color:#aaa;font-size:12px;text-align:center;">
        Received via <strong style="color:#888;">digitalmarmat.com</strong> careers page &nbsp;·&nbsp; ${receivedAt} (NPT)
      </p>
    </div>
  </div>
</body>
</html>`
}

function buildApplicantConfirmation(name: string, position: string) {
  return /* html */`
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

    <div style="background:linear-gradient(135deg,#1B2738 0%,#1E73D8 100%);padding:36px 40px;text-align:center;">
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.65);font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">Digital Marmat · Careers</p>
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">Application Received, ${name}! 🎉</h1>
    </div>

    <div style="padding:40px;">
      <p style="margin:0 0 20px;color:#2d3748;font-size:16px;line-height:1.7;">
        Thank you for applying for the <strong style="color:#1E73D8;">${position}</strong> position at Digital Marmat. We've received your application and CV.
      </p>
      <p style="margin:0 0 20px;color:#555;font-size:15px;line-height:1.7;">
        Our team will review your application and get back to you within <strong>3 business days</strong>. If you have any questions in the meantime, feel free to reach us:
      </p>

      <div style="background:#F0F7FF;border-radius:12px;padding:24px 28px;margin:24px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#1E73D8;font-size:14px;width:28px;">✉️</td><td style="padding:8px 0;color:#1B2738;font-size:14px;font-weight:600;">info@digitalmarmat.com</td></tr>
          <tr><td style="padding:8px 0;color:#25D366;font-size:14px;">💬</td><td style="padding:8px 0;color:#1B2738;font-size:14px;font-weight:600;">WhatsApp: +977 9802362213</td></tr>
        </table>
      </div>

      <p style="margin:0;color:#888;font-size:13px;line-height:1.6;">
        We appreciate your interest in joining our team and look forward to learning more about you.
      </p>

      <div style="margin-top:32px;text-align:center;">
        <a href="https://digitalmarmat.com/about"
           style="display:inline-block;background:linear-gradient(135deg,#1B2738,#1E73D8);color:#fff;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;">
          Learn About Our Team →
        </a>
      </div>
    </div>

    <div style="background:#F8FAFC;padding:24px 40px;border-top:1px solid #EFEFEF;text-align:center;">
      <p style="margin:0 0 6px;color:#888;font-size:13px;font-weight:600;">Digital Marmat · IT Services</p>
      <p style="margin:0;color:#aaa;font-size:12px;">Kathmandu, Nepal &nbsp;·&nbsp; digitalmarmat.com</p>
    </div>
  </div>
</body>
</html>`
}

export async function POST(req: Request) {
  let name = '', email = '', position = '', message = ''
  let cvBuffer: Buffer | null = null
  let cvName = ''

  // Accept both FormData (with file) and JSON (fallback)
  const contentType = req.headers.get('content-type') ?? ''

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    name     = (formData.get('name')     as string) ?? ''
    email    = (formData.get('email')    as string) ?? ''
    position = (formData.get('position') as string) ?? ''
    message  = (formData.get('message')  as string) ?? ''

    const cvFile = formData.get('cv') as File | null
    if (cvFile && cvFile.size > 0) {
      cvBuffer = Buffer.from(await cvFile.arrayBuffer())
      cvName   = cvFile.name
    }
  } else {
    const body = await req.json()
    name     = body.name     ?? ''
    email    = body.email    ?? ''
    position = body.position ?? ''
    message  = body.message  ?? ''
    cvName   = body.fileName ?? ''
  }

  if (!name.trim() || !email.trim() || !position.trim()) {
    return NextResponse.json({ error: 'Name, email, and position are required.' }, { status: 400 })
  }

  try {
    const transporter = getTransporter()
    const fromAddress = `"${FROM_NAME}" <${process.env.SMTP_USER}>`

    const attachments = cvBuffer
      ? [{ filename: cvName, content: cvBuffer }]
      : []

    // Send both emails in parallel — cuts wait time roughly in half
    await Promise.all([
      transporter.sendMail({
        from:        fromAddress,
        replyTo:     `"${name}" <${email}>`,
        to:          TO_EMAIL,
        subject:     `📋 Job Application: ${position} — ${name}`,
        html:        buildApplicationEmail({ name, email, position, message, cvName }),
        attachments,
      }),
      transporter.sendMail({
        from:    fromAddress,
        to:      email,
        subject: `Application Received — Digital Marmat`,
        html:    buildApplicantConfirmation(name, position),
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Email send failed'
    console.error('[Careers API]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
