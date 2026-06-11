import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Uses the same SMTP env vars as the contact form:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS  (see .env.local)

const TO_EMAIL  = 'techdigitalmarmat@gmail.com'
const FROM_NAME = 'Digital Marmat Website'

// Singleton — reuses the SMTP connection across warm requests
let _transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (_transporter) return _transporter

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) throw new Error('SMTP credentials not configured.')

  _transporter = nodemailer.createTransport({
    host, port, secure: false,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  })

  return _transporter
}

const formatNPR = (n: number) => `NPR ${n.toLocaleString('en-IN')}`

// ─── Lead email to Digital Marmat ────────────────────────────────────────────

function buildLeadEmail(d: {
  name: string; email: string; phone: string
  websiteType: string; addons: string[]
  estimateOneTime: number; estimateMonthly: number; hasCustomPricing: boolean
}) {
  const receivedAt = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kathmandu', dateStyle: 'full', timeStyle: 'short',
  })

  const estimateLines = [
    d.estimateOneTime > 0 ? `${formatNPR(d.estimateOneTime)} one-time` : null,
    d.estimateMonthly > 0 ? `${formatNPR(d.estimateMonthly)}/month` : null,
    d.hasCustomPricing ? 'plus custom pricing for selected items' : null,
  ].filter(Boolean).join(' + ')

  const rows = [
    ['👤 Full Name',     d.name],
    ['✉️ Email',         `<a href="mailto:${d.email}" style="color:#1E73D8;">${d.email}</a>`],
    ['📞 Phone',         d.phone || '<span style="color:#aaa;">Not provided</span>'],
    ['📦 Package',       d.websiteType],
    ['➕ Add-ons',       d.addons.length ? d.addons.join(', ') : '<span style="color:#aaa;">None</span>'],
    ['💰 Estimate',      estimateLines || 'Custom quote needed'],
  ]

  return /* html */`
<!DOCTYPE html><html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1B2738,#1E73D8);padding:36px 40px;">
    <p style="margin:0 0 4px;color:rgba(255,255,255,.65);font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Digital Marmat</p>
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">New Cost Calculator Lead 🧮</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,.70);font-size:14px;">Someone used the website cost calculator and requested a quote.</p>
  </div>
  <!-- Alert -->
  <div style="background:#EEF6FF;border-left:4px solid #1E73D8;padding:16px 24px;margin:28px 28px 0;">
    <p style="margin:0;color:#1E73D8;font-weight:700;font-size:15px;">Estimate: ${estimateLines || 'Custom quote needed'}</p>
    <p style="margin:6px 0 0;color:#555;font-size:13px;">Reply to this email to contact ${d.name} directly.</p>
  </div>
  <!-- Details -->
  <div style="padding:28px 40px;">
    <h2 style="margin:0 0 20px;font-size:16px;color:#1B2738;font-weight:700;border-bottom:2px solid #f0f0f0;padding-bottom:12px;">Request Details</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${rows.map(([label, value]) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f5f5f5;color:#888;font-size:13px;width:160px;vertical-align:top;font-weight:600;">${label}</td>
        <td style="padding:12px 0;border-bottom:1px solid #f5f5f5;color:#1B2738;font-size:14px;">${value}</td>
      </tr>`).join('')}
    </table>
    <!-- CTA -->
    <div style="margin-top:32px;text-align:center;">
      <a href="mailto:${d.email}?subject=Your Website Quote — Digital Marmat"
         style="display:inline-block;background:linear-gradient(135deg,#1B2738,#1E73D8);color:#fff;padding:14px 40px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;">
        Reply to ${d.name}
      </a>
    </div>
  </div>
  <!-- Footer -->
  <div style="background:#F8FAFC;padding:20px 40px;border-top:1px solid #EFEFEF;">
    <p style="margin:0;color:#aaa;font-size:12px;text-align:center;">
      Cost calculator request via <strong style="color:#888;">digitalmarmat.com.np</strong> &nbsp;·&nbsp; ${receivedAt} (NPT)
    </p>
  </div>
</div>
</body></html>`
}

// ─── Confirmation email to the requester ─────────────────────────────────────

function buildConfirmationEmail(name: string, d: {
  websiteType: string; addons: string[]
  estimateOneTime: number; estimateMonthly: number; hasCustomPricing: boolean
}) {
  const estimateRows = [
    d.estimateOneTime > 0 ? ['One-time cost', formatNPR(d.estimateOneTime)] : null,
    d.estimateMonthly > 0 ? ['Monthly cost', `${formatNPR(d.estimateMonthly)}/mo`] : null,
  ].filter((row): row is [string, string] => row !== null)

  return /* html */`
<!DOCTYPE html><html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1B2738,#1E73D8);padding:36px 40px;text-align:center;">
    <p style="margin:0 0 4px;color:rgba(255,255,255,.65);font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Digital Marmat · IT Service</p>
    <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">Thanks, ${name}! 🎉</h1>
  </div>
  <!-- Body -->
  <div style="padding:40px;">
    <p style="margin:0 0 20px;color:#2d3748;font-size:16px;line-height:1.7;">
      We've received your estimate request for a <strong style="color:#1E73D8;">${d.websiteType}</strong> website${d.addons.length ? ` with ${d.addons.join(', ')}` : ''}.
    </p>
    <p style="margin:0 0 20px;color:#555;font-size:15px;line-height:1.7;">
      Our team will review your requirements and get back to you within <strong>24 hours</strong> with a detailed, tailored quote.
    </p>
    ${estimateRows.length || d.hasCustomPricing ? `
    <div style="background:#F0F7FF;border-radius:12px;padding:24px 28px;margin:24px 0;">
      <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#1B2738;">Your rough estimate:</p>
      <table style="width:100%;border-collapse:collapse;">
        ${estimateRows.map(([label, value]) => `
        <tr><td style="padding:6px 0;color:#555;font-size:14px;">${label}</td><td style="padding:6px 0;color:#1B2738;font-size:14px;font-weight:700;text-align:right;">${value}</td></tr>`).join('')}
      </table>
      ${d.hasCustomPricing ? `<p style="margin:12px 0 0;color:#888;font-size:13px;">Plus custom pricing for selected items — we'll confirm exact figures in your quote.</p>` : ''}
      <p style="margin:12px 0 0;color:#aaa;font-size:12px;">*This is an estimate only. Final pricing depends on your exact requirements.</p>
    </div>` : ''}
    <div style="background:#f8fafc;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0 0 8px;color:#1B2738;font-size:14px;">📞 <strong>+977 9802362213</strong></p>
      <p style="margin:0 0 8px;color:#1B2738;font-size:14px;">💬 <strong>WhatsApp: +977 9802362213</strong></p>
      <p style="margin:0;color:#1B2738;font-size:14px;">✉️ <strong>info@digitalmarmat.com</strong></p>
    </div>
    <div style="text-align:center;">
      <a href="https://www.digitalmarmat.com.np/pricing"
         style="display:inline-block;background:linear-gradient(135deg,#1B2738,#1E73D8);color:#fff;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;">
        View Full Pricing →
      </a>
    </div>
  </div>
  <!-- Footer -->
  <div style="background:#F8FAFC;padding:24px 40px;border-top:1px solid #EFEFEF;text-align:center;">
    <p style="margin:0 0 6px;color:#888;font-size:13px;font-weight:600;">Digital Marmat · IT Service</p>
    <p style="margin:0;color:#aaa;font-size:12px;">Kathmandu, Nepal &nbsp;·&nbsp; digitalmarmat.com.np</p>
  </div>
</div>
</body></html>`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const body = await req.json()
  const {
    name, email, phone, websiteType, addons,
    estimateOneTime, estimateMonthly, hasCustomPricing,
  } = body as {
    name: string; email: string; phone?: string; websiteType: string
    addons: string[]; estimateOneTime: number; estimateMonthly: number; hasCustomPricing: boolean
  }

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
  }

  try {
    const transporter = getTransporter()
    const from = `"${FROM_NAME}" <${process.env.SMTP_USER}>`
    const data = {
      name, email, phone: phone ?? '', websiteType,
      addons: addons ?? [], estimateOneTime, estimateMonthly, hasCustomPricing,
    }

    // Send both emails in parallel — cuts wait time roughly in half
    await Promise.all([
      transporter.sendMail({
        from,
        replyTo: `"${name}" <${email}>`,
        to:      TO_EMAIL,
        subject: `🧮 Cost Calculator Lead — ${name} (${websiteType})`,
        html:    buildLeadEmail(data),
      }),
      transporter.sendMail({
        from,
        to:      email,
        subject: `Your Website Cost Estimate — Digital Marmat`,
        html:    buildConfirmationEmail(name, data),
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Email send failed'
    console.error('[Calculator API]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
