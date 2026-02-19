import os
import json
import time
from typing import Optional

import requests
from telethon import TelegramClient, events

def env(name: str, default: Optional[str] = None) -> str:
    value = os.getenv(name, default)
    if value is None:
        raise RuntimeError(f"Missing env var: {name}")
    return value

TG_API_ID = int(env("TG_API_ID"))
TG_API_HASH = env("TG_API_HASH")
TG_PHONE = env("TG_PHONE")
PROVIDER_GROUP_ID = int(env("PROVIDER_GROUP_ID"))
INGEST_URL = env("TELEGRAM_INGEST_URL", "http://localhost:3000/api/telegram/ingest")

SESSION_NAME = "telegram_user_listener"

client = TelegramClient(SESSION_NAME, TG_API_ID, TG_API_HASH)

@client.on(events.NewMessage(chats=PROVIDER_GROUP_ID))
async def handler(event):
    message = event.message.message or ""
    if not message.strip():
        return

    payload = {
        "text": message,
        "chatId": PROVIDER_GROUP_ID,
        "chatName": "PROVIDER_GROUP",
        "source": "PROVIDER",
    }

    try:
        response = requests.post(INGEST_URL, json=payload, timeout=10)
        if response.status_code >= 400:
            print("Ingest error:", response.status_code, response.text)
    except Exception as exc:
        print("Ingest request failed:", exc)

async def main():
    await client.start(phone=TG_PHONE)
    print("Telegram user listener active")
    await client.run_until_disconnected()

if __name__ == "__main__":
    with client:
        client.loop.run_until_complete(main())
