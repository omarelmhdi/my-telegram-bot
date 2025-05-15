import { Telegraf } from "telegraf"
import { message } from "telegraf/filters"
import { OpenAI } from "openai"
import { type NextRequest, NextResponse } from "next/server"

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

// POST handler for webhook updates
export async function POST(request: NextRequest) {
  try {
    const update = await request.json()
    await bot.handleUpdate(update)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error in webhook handler:", error)
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 })
  }
}

// GET handler for setting up the webhook
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const secretToken = searchParams.get("secret_token")

    if (secretToken === process.env.WEBHOOK_SECRET) {
      // Use the VERCEL_URL environment variable or extract from request
      const host = request.headers.get("host") || process.env.VERCEL_URL
      const webhookUrl = `https://${host}/api/webhook`

      await bot.telegram.setWebhook(webhookUrl)

      return NextResponse.json({
        ok: true,
        message: `Webhook set to ${webhookUrl}`,
      })
    } else {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error setting webhook:", error)
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 })
  }
}
