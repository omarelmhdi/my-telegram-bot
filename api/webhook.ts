import { Telegraf } from "telegraf"
import { message } from "telegraf/filters"
import { OpenAI } from "openai"

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Initialize the bot with the token
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

// Set up message handling
bot.on(message("text"), async (ctx) => {
  try {
    // Send "typing" action
    await ctx.sendChatAction("typing")

    const userMessage = ctx.message.text

    // Generate response from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "أنت مساعد ذكي ومفيد." },
        { role: "user", content: userMessage },
      ],
      max_tokens: 1000,
    })

    // Send the response back to the user
    await ctx.reply(completion.choices[0].message.content)
  } catch (error) {
    console.error("Error:", error)
    await ctx.reply("عذراً، حدث خطأ أثناء معالجة طلبك.")
  }
})

// Webhook handler for Vercel
export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { body } = req
      await bot.handleUpdate(body)
      res.status(200).json({ ok: true })
    } else if (req.method === "GET") {
      // For setting up the webhook
      const { secret_token } = req.query

      if (secret_token === process.env.WEBHOOK_SECRET) {
        const webhookUrl = `https://${req.headers.host}/api/webhook`
        await bot.telegram.setWebhook(webhookUrl)
        res.status(200).json({
          ok: true,
          message: `Webhook set to ${webhookUrl}`,
        })
      } else {
        res.status(401).json({ ok: false, message: "Unauthorized" })
      }
    } else {
      res.status(405).json({ ok: false, message: "Method not allowed" })
    }
  } catch (error) {
    console.error("Error in webhook handler:", error)
    res.status(500).json({ ok: false, error: "Internal server error" })
  }
}
