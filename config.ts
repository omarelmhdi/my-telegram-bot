export const config = {
  telegram_token: process.env.TELEGRAM_BOT_TOKEN || "",
  openai_api_key: process.env.OPENAI_API_KEY || "",
  webhook_secret: process.env.WEBHOOK_SECRET || "your_secret_token",
}
