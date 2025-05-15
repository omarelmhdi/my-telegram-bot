import yaml
import dotenv
from pathlib import Path

config_dir = Path(__file__).parent.parent.resolve() / "config"

# load yaml config
with open(config_dir / "config.yml", 'r') as f:
    config_yaml = yaml.safe_load(f)

# load .env config
config_env = dotenv.dotenv_values(config_dir / "config.env")

# config.py

# Telegram Bot Token
telegram_token = "8001323035:AAFMQwiSD_vQDBOi4XTKGgUacjjzpdVniWQ"

# OpenAI API Key
openai_api_key = "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"

# OpenAI Base URL (غالبًا هتفضل زي ما هي)
openai_api_base = "https://api.openai.com/v1"

# مين مسموح له يستخدم البوت (None = الكل مسموح له)
allowed_telegram_usernames = None

# عدد الثواني قبل بدء محادثة جديدة لو المستخدم سابها فترة
new_dialog_timeout = 600

# هل يتم إرسال الرد تدريجيًا (streaming)
enable_message_streaming = True

# عدد الصور اللي بيرجعها عند توليد صور
return_n_generated_images = 1

# حجم الصور اللي بيرجعها (مثلاً: 512x512)
image_size = "512x512"

# عدد أوضاع الدردشة في كل صفحة (لو في نظام أوضاع)
n_chat_modes_per_page = 5

# MongoDB URI (None لو مش عايز تستخدم قاعدة بيانات حالياً)
mongodb_uri = None


# chat_modes
with open(config_dir / "chat_modes.yml", 'r') as f:
    chat_modes = yaml.safe_load(f)

# models
with open(config_dir / "models.yml", 'r') as f:
    models = yaml.safe_load(f)

# files
help_group_chat_video_path = Path(__file__).parent.parent.resolve() / "static" / "help_group_chat.mp4"
