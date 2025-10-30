# backend/src/gpt.py
import json
from openai import OpenAI
from src.config import settings

client = OpenAI(api_key=settings.openai_api_key)

PROMPT = """
You are a legal AI assistant.

From the following legal document text, extract all user-fillable placeholders.

For each placeholder, return:
- placeholder: the exact text (e.g. "[Company Name]" or "______________")
- field_name: machine-friendly key (e.g. company_name)
- description: what it represents
- question: what should be asked to the user

Return only a JSON array. Do not include explanations.

Text:
\"\"\"{text}\"\"\"
"""

def extract_placeholders(text: str):
    user_message = PROMPT.format(text=text)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_message}
        ],
        temperature=0.3
    )

    try:
        return json.loads(response.choices[0].message.content.strip())
    except json.JSONDecodeError:
        return [{"placeholder": "ERROR", "field_name": "error", "description": "Failed to parse JSON", "question": "Could not parse placeholders"}]
