import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import nodemailer from 'nodemailer'
import { sendWhatsAppMessage } from '@/lib/sendWhatsAppMessage'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const TO_EMAIL  = 'techdigitalmarmat@gmail.com'
const FROM_NAME = 'Digital Marmat WhatsApp Bot'

const COMPANY_KNOWLEDGE = `
You are a helpful assistant for Digital Marmat IT Services,
a digital marketing and IT company based in Kathmandu, Nepal.

ABOUT US:
- Company: Digital Marmat IT Services
- Location: Kathmandu, Nepal
- Phone: +977-9802362213
- Email: info@digitalmarmat.com
- Website: https://www.digitalmarmat.com.np
- Working Hours: Sunday to Friday, 10 AM to 6 PM Nepal Time

OUR SERVICES:
1. Website Development — Custom business websites with React and Next.js,
   e-commerce stores (Shopify, WooCommerce), portfolios, landing pages.
2. SEO Services — Technical SEO, keyword research, local SEO for Nepal businesses.
   FREE SEO Audit: https://www.digitalmarmat.com.np/free-seo-audit
3. Digital Marketing — Google Ads, Facebook & Instagram Ads, lead generation.
4. Social Media Marketing — Facebook, Instagram, TikTok, LinkedIn management.
5. UI/UX Design — Wireframes, prototypes, Figma designs for web and mobile.
6. E-Commerce Development — Shopify, WooCommerce, custom stores with eSewa/Khalti.
7. Mobile App Development — Android & iOS apps using React Native.
8. Branding & Design — Logo design, brand identity, marketing materials.
9. Software Development — Custom web apps, APIs, backend systems.
10. AI Automation — Chatbots, workflow automation, AI integrations.

HOW TO COLLECT LEADS:
When a customer is interested in a service, politely ask for:
1. Their full name
2. Their email address
3. Their website URL (if they have one, otherwise "none")
4. Which service they need

Once you have all 4 pieces, say:
"Thank you [name]! Our team will contact you within 24 hours."
Then on the very last line of your reply (alone), add exactly:
[LEAD_COLLECTED: name=VALUE, email=VALUE, website=VALUE, service=VALUE]

CONVERSATION RULES:
- Be friendly, warm, and professional at all times
- Reply in the same language the customer uses (English or Nepali — both fine)
- Keep replies short and clear — 2 to 4 sentences maximum
- Always offer the Free SEO Audit when someone asks about SEO or rankings
- Never invent prices — say "Our team will send you a custom quote based on your needs"
- If you do not know something specific, say "Let me connect you with our team" and collect their contact details
- Do not answer questions unrelated to Digital Marmat or digital marketing
`

const conversationHistory: Record<string, { role: 'user' | 'assistant'; content: string }[]> = {}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? ''
    let body: Record<string, unknown>

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text()
      const params = new URLSearchParams(text)
      body = Object.fromEntries(params.entries())
    } else {
      body = await request.json()
    }

    let phoneNumber = ''
    let customerMessage = ''

    // Meta WhatsApp Business API format
    if (body.entry) {
      const entry = (body.entry as { changes: { value: { messages?: { from: string; text?: { body: string } }[] } }[] }[])[0]
      const messageData = entry?.changes?.[0]?.value?.messages?.[0]
      if (!messageData) return NextResponse.json({ status: 'no message' })
      phoneNumber = messageData.from
      customerMessage = messageData.text?.body ?? ''
    }
    // Twilio format
    else if (body.From) {
      phoneNumber = body.From as string
      customerMessage = (body.Body as string) ?? ''
    }

    if (!customerMessage) return NextResponse.json({ status: 'no text message' })

    if (!conversationHistory[phoneNumber]) conversationHistory[phoneNumber] = []

    conversationHistory[phoneNumber].push({ role: 'user', content: customerMessage })

    if (conversationHistory[phoneNumber].length > 10) {
      conversationHistory[phoneNumber] = conversationHistory[phoneNumber].slice(-10)
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: COMPANY_KNOWLEDGE,
      messages: conversationHistory[phoneNumber],
    })

    const aiReply =
      response.content[0].type === 'text'
        ? response.content[0].text
        : 'Sorry, I could not process that. Please try again.'

    conversationHistory[phoneNumber].push({ role: 'assistant', content: aiReply })

    if (aiReply.includes('[LEAD_COLLECTED:')) {
      const match = aiReply.match(/\[LEAD_COLLECTED:\s*(.+?)\]/)
      if (match) await emailLead(match[1], phoneNumber)
    }

    const cleanReply = aiReply.replace(/\[LEAD_COLLECTED:.*?\]/gs, '').trim()

    await sendWhatsAppMessage(phoneNumber, cleanReply)

    return NextResponse.json({ status: 'success', reply: cleanReply })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}

// Webhook verification for Meta WhatsApp Business API
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const mode      = params.get('hub.mode')
  const token     = params.get('hub.verify_token')
  const challenge = params.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

async function emailLead(leadInfo: string, phoneNumber: string) {
  const timestamp = new Date().toLocaleString('en-NP', { timeZone: 'Asia/Kathmandu' })
  console.log(`[NEW LEAD] ${timestamp} | ${leadInfo} | Phone: ${phoneNumber}`)

  try {
    const host = process.env.SMTP_HOST
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    if (!host || !user || !pass) return

    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: { user, pass },
    })

    const from = `"${FROM_NAME}" <${user}>`
    await transporter.sendMail({
      from,
      to: TO_EMAIL,
      subject: `New WhatsApp Lead — ${timestamp}`,
      html: `
        <h2 style="color:#1E3A8A">New WhatsApp Lead 🎉</h2>
        <p><strong>Received:</strong> ${timestamp}</p>
        <p><strong>WhatsApp number:</strong> ${phoneNumber}</p>
        <hr/>
        <p><strong>Lead info:</strong> ${leadInfo}</p>
        <hr/>
        <p style="color:#666;font-size:12px">Sent by Digital Marmat WhatsApp AI Bot</p>
      `,
    })
  } catch (err) {
    console.error('Failed to email lead:', err)
  }
}
