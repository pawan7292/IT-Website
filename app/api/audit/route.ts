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

// ─── Lead email to Digital Marmat ────────────────────────────────────────────

function buildLeadEmail(d: {
  name: string; email: string; phone: string
  website: string; business: string; visitors: string; goal: string
}) {
  const receivedAt = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kathmandu', dateStyle: 'full', timeStyle: 'short',
  })

  const rows = [
    ['👤 Full Name',         d.name],
    ['✉️ Email',             `<a href="mailto:${d.email}" style="color:#1E73D8;">${d.email}</a>`],
    ['📞 Phone',             d.phone],
    ['🌐 Website URL',       `<a href="${d.website}" target="_blank" style="color:#1E73D8;">${d.website}</a>`],
    ['🏢 Business Name',     d.business  || '<span style="color:#aaa;">Not provided</span>'],
    ['📊 Monthly Visitors',  d.visitors  || '<span style="color:#aaa;">Not specified</span>'],
    ['🎯 Main Goal',         d.goal      || '<span style="color:#aaa;">Not specified</span>'],
  ]

  return /* html */`
<!DOCTYPE html><html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1B2738,#1E73D8);padding:36px 40px;">
    <p style="margin:0 0 4px;color:rgba(255,255,255,.65);font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Digital Marmat</p>
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">New Free SEO Audit Request 🔍</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,.70);font-size:14px;">Someone wants a free SEO audit for their website.</p>
  </div>
  <!-- Alert -->
  <div style="background:#EEF6FF;border-left:4px solid #1E73D8;padding:16px 24px;margin:28px 28px 0;">
    <p style="margin:0;color:#1E73D8;font-weight:700;font-size:15px;">Website to Audit: ${d.website}</p>
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
      <a href="mailto:${d.email}?subject=Your Free SEO Audit — Digital Marmat"
         style="display:inline-block;background:linear-gradient(135deg,#1B2738,#1E73D8);color:#fff;padding:14px 40px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;">
        Reply to ${d.name}
      </a>
    </div>
  </div>
  <!-- Footer -->
  <div style="background:#F8FAFC;padding:20px 40px;border-top:1px solid #EFEFEF;">
    <p style="margin:0;color:#aaa;font-size:12px;text-align:center;">
      Free SEO Audit request via <strong style="color:#888;">digitalmarmat.com</strong> &nbsp;·&nbsp; ${receivedAt} (NPT)
    </p>
  </div>
</div>
</body></html>`
}

// ─── Confirmation email to the requester ─────────────────────────────────────

function buildConfirmationEmail(name: string, website: string) {
  return /* html */`
<!DOCTYPE html><html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1B2738,#1E73D8);padding:36px 40px;text-align:center;">
    <p style="margin:0 0 4px;color:rgba(255,255,255,.65);font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Digital Marmat · SEO Experts</p>
    <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">Your Free SEO Audit is Booked! 🎉</h1>
  </div>
  <!-- Body -->
  <div style="padding:40px;">
    <p style="margin:0 0 20px;color:#2d3748;font-size:16px;line-height:1.7;">Hi <strong>${name}</strong>,</p>
    <p style="margin:0 0 20px;color:#555;font-size:15px;line-height:1.7;">
      We've received your SEO audit request for <strong style="color:#1E73D8;">${website}</strong>.
      Our SEO team will start analysing your website and you'll receive your full report within <strong>24 hours</strong>.
    </p>
    <!-- What's included box -->
    <div style="background:#F0F7FF;border-radius:12px;padding:24px 28px;margin:24px 0;">
      <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#1B2738;">Your audit will cover:</p>
      ${[
        '✅ Technical SEO — speed, crawlability, mobile-friendliness',
        '✅ On-Page SEO — titles, meta tags, headings, content quality',
        '✅ Keyword Rankings — where you rank and where you can win',
        '✅ Competitor Analysis — how you stack up against top 3 rivals',
        '✅ Backlink Profile — authority and quality of your inbound links',
        '✅ Local SEO — Google Business Profile and local citations',
        '✅ Core Web Vitals — Google\'s page experience scores',
        '✅ Actionable Recommendations — prioritised fix list',
      ].map(item => `<p style="margin:0 0 10px;color:#2d3748;font-size:14px;line-height:1.6;">${item}</p>`).join('')}
    </div>
    <p style="margin:0 0 20px;color:#555;font-size:15px;line-height:1.7;">
      If you have any questions while you wait, you can reach us directly:
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0 0 8px;color:#1B2738;font-size:14px;">📞 <strong>+977 9802362213</strong></p>
      <p style="margin:0 0 8px;color:#1B2738;font-size:14px;">💬 <strong>WhatsApp: +977 9802362213</strong></p>
      <p style="margin:0;color:#1B2738;font-size:14px;">✉️ <strong>info@digitalmarmat.com</strong></p>
    </div>
    <div style="text-align:center;">
      <a href="https://digitalmarmat.com/services/seo-services"
         style="display:inline-block;background:linear-gradient(135deg,#1B2738,#1E73D8);color:#fff;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;">
        Learn About Our SEO Services →
      </a>
    </div>
  </div>
  <!-- Footer -->
  <div style="background:#F8FAFC;padding:24px 40px;border-top:1px solid #EFEFEF;text-align:center;">
    <p style="margin:0 0 6px;color:#888;font-size:13px;font-weight:600;">Digital Marmat · IT Service</p>
    <p style="margin:0;color:#aaa;font-size:12px;">Kathmandu, Nepal &nbsp;·&nbsp; digitalmarmat.com</p>
  </div>
</div>
</body></html>`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, phone, website, business, visitors, goal } = body as {
    name: string; email: string; phone: string; website: string
    business?: string; visitors?: string; goal?: string
  }

  if (!name?.trim() || !email?.trim() || !phone?.trim() || !website?.trim()) {
    return NextResponse.json({ error: 'Name, email, phone, and website are required.' }, { status: 400 })
  }

  try {
    const transporter = getTransporter()
    const from = `"${FROM_NAME}" <${process.env.SMTP_USER}>`

    // Send both emails in parallel — cuts wait time roughly in half
    await Promise.all([
      transporter.sendMail({
        from,
        replyTo: `"${name}" <${email}>`,
        to:      TO_EMAIL,
        subject: `🔍 Free SEO Audit Request — ${website}`,
        html:    buildLeadEmail({ name, email, phone, website, business: business ?? '', visitors: visitors ?? '', goal: goal ?? '' }),
      }),
      transporter.sendMail({
        from,
        to:      email,
        subject: `Your Free SEO Audit is Confirmed — Digital Marmat`,
        html:    buildConfirmationEmail(name, website),
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Email send failed'
    console.error('[Audit API]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
