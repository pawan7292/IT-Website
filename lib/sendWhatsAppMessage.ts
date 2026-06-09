export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error('WhatsApp credentials not configured')
    return
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: { body: message },
        }),
      }
    )
    if (!response.ok) {
      console.error('Failed to send WhatsApp message:', await response.text())
    }
  } catch (error) {
    console.error('WhatsApp send error:', error)
  }
}
