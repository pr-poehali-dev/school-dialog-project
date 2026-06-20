import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет вопрос от посетителя сайта директору школы на почту director.45@yandex.ru"""

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    body = json.loads(event.get('body', '{}'))
    name = body.get('name', '').strip()
    email = body.get('email', '').strip()
    question = body.get('question', '').strip()

    if not name or not email or not question:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Все поля обязательны'}, ensure_ascii=False),
        }

    smtp_password = os.environ['SMTP_PASSWORD']
    sender = 'director.45@yandex.ru'
    recipient = 'director.45@yandex.ru'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Вопрос директору с сайта от {name}'
    msg['From'] = sender
    msg['To'] = recipient
    msg['Reply-To'] = email

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1E3A5F; padding: 24px; border-radius: 12px 12px 0 0;">
        <h2 style="color: #fff; margin: 0; font-size: 20px;">Новый вопрос директору школы</h2>
        <p style="color: #4FA3E3; margin: 4px 0 0 0;">МБОУ «СОШ №45» г. Кемерово</p>
      </div>
      <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">ИМЯ ОТПРАВИТЕЛЯ</p>
        <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #1E3A5F;">{name}</p>
        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">ЭЛЕКТРОННАЯ ПОЧТА</p>
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #1E3A5F;">
          <a href="mailto:{email}" style="color: #4FA3E3;">{email}</a>
        </p>
        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">ВОПРОС</p>
        <div style="background: #fff; border-left: 4px solid #F4B400; padding: 16px; border-radius: 4px;">
          <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #1E3A5F;">{question}</p>
        </div>
      </div>
    </div>
    """

    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(sender, smtp_password)
        server.sendmail(sender, recipient, msg.as_string())

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'success': True}, ensure_ascii=False),
    }
