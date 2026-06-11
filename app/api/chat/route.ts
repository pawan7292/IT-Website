import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { servicesData } from '@/data/services'
import { blogPosts } from '@/data/blog'

const TO_EMAIL  = 'techdigitalmarmat@gmail.com'
const FROM_NAME = 'Digital Marmat Website'

// Tried in order — if one is overloaded/rate-limited/empty, the next is used.
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-flash-lite-latest']

function buildServicesKnowledge(): string {
  return servicesData
    .map((s) => {
      const benefits = s.benefits.map((b) => `  - ${b.title}: ${b.description}`).join('\n')
      const features = s.features.map((f) => `  - ${f.title}: ${f.description}`).join('\n')
      const faqs = s.faqs.map((f) => `  Q: ${f.question}\n  A: ${f.answer}`).join('\n')
      return `### ${s.name} (page: /services/${s.slug})\n${s.heroDescription}\n\nKey benefits:\n${benefits}\n\nWhat's included:\n${features}\n\nTechnologies used: ${s.technologies.join(', ')}\n\nFAQs:\n${faqs}`
    })
    .join('\n\n')
}

function buildBlogKnowledge(): string {
  return blogPosts
    .map((p) => `- "${p.title}" (${p.category}): ${p.excerpt} — /blog/${p.slug}`)
    .join('\n')
}

const SYSTEM_PROMPT = `You are "Marmat AI", the friendly virtual assistant on the Digital Marmat website (digitalmarmat.com.np).

ABOUT DIGITAL MARMAT:
- A Nepal-based IT company headquartered in Kathmandu.
- 5+ years of experience, 50+ projects delivered, 99.9% client satisfaction, 100+ happy clients.
- Team: Pawan Thapa (CEO / Founder), Sabina Phuyal (Co-Founder), Rajan Khadka (Co-Founder), Aayush Mainali (IT Head).
- Why clients choose us: 100% custom solutions (never templates), proven track record, diverse expertise (web, software, marketing, design, AI) all under one roof, client-centric approach, on-time delivery, and dedicated ongoing support.

SERVICES — full details (benefits, what's included, FAQs):
${buildServicesKnowledge()}

PRICING (NPR, starting prices — final quote depends on project scope):
- Website Development: Starter NPR 15,000 | Business NPR 35,000 | Enterprise — custom quote
- Digital Marketing: Basic NPR 8,000/mo | Growth NPR 18,000/mo | Pro — custom quote
- SEO: Local SEO NPR 6,000/mo | Growth SEO NPR 14,000/mo | Authority SEO — custom quote
- Branding: Basic Brand NPR 10,000 | Full Brand NPR 25,000 | Brand Strategy — custom quote
- Mobile Apps: Simple apps from NPR 80,000 | Mid-complexity with backend NPR 1,50,000-4,00,000 | Enterprise — custom quote
- AI Automation: Simple workflow automations from NPR 15,000 | Custom AI chatbots/data pipelines NPR 50,000-2,00,000+
- For Software Development and E-Commerce, pricing depends on project scope — recommend a free consultation.
- Full pricing details: /pricing

BLOG ARTICLES (recommend the most relevant one if it helps answer the user's question):
${buildBlogKnowledge()}

CONTACT & LINKS:
- WhatsApp / Phone: +977 9802362213
- Email: info@digitalmarmat.com
- Location: Kathmandu, Nepal
- Free SEO audit: /free-seo-audit
- Full pricing: /pricing
- Contact form: /contact
- Careers: /careers
- About us: /about

YOUR ROLE:
- Be warm, concise, and helpful. Keep replies short (2-4 sentences) unless the user asks for more detail.
- Use the information above to answer questions about services, pricing, process, FAQs, the company, and blog content as accurately as possible.
- If you don't know something or it isn't covered above, say so honestly and suggest WhatsApp or the contact form.
- Never invent prices, services, or facts not listed here.

LEAD CAPTURE:
- If the user shows interest in a quote, consultation, project, or hiring Digital Marmat, warmly ask for their name and email (one at a time, naturally) so the team can follow up.
- Once the user has provided BOTH a name and an email address anywhere in the conversation, append this exact tag on its own new line at the very end of your reply (it is hidden from the user):
[LEAD_COLLECTED:name=<name>;email=<email>;interest=<short summary of what they're interested in>]
- Only include this tag once per conversation. Never invent a name or email — only use what the user actually typed.`

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
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  })

  return _transporter
}

function buildLeadEmail(data: { name: string; email: string; interest: string; conversation: string }) {
  const { name, email, interest, conversation } = data
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
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.65);font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">Digital Marmat · AI Chat</p>
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">New Lead from AI Chat 🤖</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.70);font-size:14px;">${name} chatted with the website assistant.</p>
    </div>

    <div style="background:#EEF6FF;border-left:4px solid #1E73D8;padding:16px 24px;margin:28px 28px 0;">
      <p style="margin:0;color:#1E73D8;font-weight:700;font-size:15px;">Interested in: ${interest}</p>
      <p style="margin:6px 0 0;color:#555;font-size:13px;">Reply to contact ${name} directly.</p>
    </div>

    <div style="padding:28px 40px;">
      <h2 style="margin:0 0 20px;font-size:16px;color:#1B2738;font-weight:700;border-bottom:2px solid #f0f0f0;padding-bottom:12px;">Lead Details</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ['👤 Name',  name],
          ['✉️ Email', `<a href="mailto:${email}" style="color:#1E73D8;text-decoration:none;">${email}</a>`],
        ].map(([label, value]) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f5f5f5;color:#888;font-size:13px;width:120px;vertical-align:top;font-weight:600;">${label}</td>
          <td style="padding:12px 0;border-bottom:1px solid #f5f5f5;color:#1B2738;font-size:14px;">${value}</td>
        </tr>`).join('')}
      </table>

      <div style="margin-top:28px;background:#F8FAFC;border-radius:10px;padding:20px 24px;border:1px solid #E8EEF4;">
        <p style="margin:0 0 12px;font-size:12px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Conversation</p>
        <p style="margin:0;color:#2d3748;font-size:13px;line-height:1.8;white-space:pre-wrap;">${conversation.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>

      <div style="margin-top:32px;text-align:center;">
        <a href="mailto:${email}?subject=Re: Your enquiry — Digital Marmat"
           style="display:inline-block;background:linear-gradient(135deg,#1B2738,#1E73D8);color:#fff;padding:14px 40px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;">
          Reply to ${name}
        </a>
      </div>
    </div>

    <div style="background:#F8FAFC;padding:20px 40px;border-top:1px solid #EFEFEF;">
      <p style="margin:0;color:#aaa;font-size:12px;text-align:center;">
        Captured via <strong style="color:#888;">digitalmarmat.com.np</strong> AI chat &nbsp;·&nbsp; ${receivedAt} (NPT)
      </p>
    </div>
  </div>
</body>
</html>`
}

type ChatMessage = { role: 'user' | 'model'; text: string }

async function callGemini(contents: { role: string; parts: { text: string }[] }[], apiKey: string): Promise<string> {
  let lastError = 'Unknown error'

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: { temperature: 0.4, maxOutputTokens: 400 },
          }),
        }
      )

      if (!res.ok) {
        lastError = await res.text()
        console.error(`[Chat API] ${model} error:`, lastError)
        continue
      }

      const data = await res.json()
      const reply: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      if (!reply) {
        lastError = `${model} returned an empty reply`
        continue
      }

      return reply
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err)
      console.error(`[Chat API] ${model} network error:`, err)
    }
  }

  throw new Error(lastError)
}

export async function POST(req: Request) {
  const { message, history } = (await req.json()) as { message?: string; history?: ChatMessage[] }

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Chat is not configured.' }, { status: 500 })
  }

  const contents = [
    ...(history ?? []).map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    { role: 'user', parts: [{ text: message }] },
  ]

  let reply: string
  try {
    reply = await callGemini(contents, apiKey)
  } catch (err) {
    console.error('[Chat API] All Gemini models failed:', err)
    return NextResponse.json({ error: 'AI is temporarily unavailable. Please try WhatsApp instead.' }, { status: 502 })
  }

  const leadMatch = reply.match(/\[LEAD_COLLECTED:([\s\S]*?)\]/)
  let leadCaptured = false

  if (leadMatch) {
    reply = reply.replace(leadMatch[0], '').trim()

    const fields: Record<string, string> = {}
    for (const pair of leadMatch[1].split(';')) {
      const [key, ...rest] = pair.split('=')
      if (key) fields[key.trim()] = rest.join('=').trim()
    }

    if (fields.name && fields.email) {
      try {
        const transporter = getTransporter()
        const conversation = [...(history ?? []), { role: 'user', text: message } as ChatMessage]
          .map((m) => `${m.role === 'user' ? 'Visitor' : 'Marmat AI'}: ${m.text}`)
          .join('\n')

        await transporter.sendMail({
          from:    `"${FROM_NAME}" <${process.env.SMTP_USER}>`,
          replyTo: `"${fields.name}" <${fields.email}>`,
          to:      TO_EMAIL,
          subject: `🤖 New Lead from AI Chat: ${fields.name}`,
          html:    buildLeadEmail({ name: fields.name, email: fields.email, interest: fields.interest ?? 'General enquiry', conversation }),
        })
        leadCaptured = true
      } catch (err) {
        console.error('[Chat API] Failed to send lead email:', err)
      }
    }
  }

  return NextResponse.json({ reply, leadCaptured })
}
