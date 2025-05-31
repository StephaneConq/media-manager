from google import genai
from google.genai import types
from google.auth import default

from config import SUMMARIZE_COMMENTS_PROMPT

CREDS, PROJECT = default()


def summarize(comments: list) -> str:
    """
    Summarize a list of comments.
    :param comments: The list of comments to summarize.
    :return: The summarized text.
    """
    client = genai.Client(
        vertexai=True,
        project=PROJECT,
        location="global",
    )

    model = "gemini-2.0-flash-001"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="\n".join(comments))
            ]
        )
    ]

    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        top_p=1,
        seed=0,
        safety_settings=[types.SafetySetting(
            category="HARM_CATEGORY_HATE_SPEECH",
            threshold="OFF"
        ), types.SafetySetting(
            category="HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold="OFF"
        ), types.SafetySetting(
            category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold="OFF"
        ), types.SafetySetting(
            category="HARM_CATEGORY_HARASSMENT",
            threshold="OFF"
        )],
        system_instruction=[types.Part.from_text(text=SUMMARIZE_COMMENTS_PROMPT)],
    )

    res = client.models.generate_content(
        model=model,
        contents=contents,
        config=generate_content_config,
    )
    
    return res.text
