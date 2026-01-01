import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONSリクエストへの対応
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POSTメソッドのみ受け付ける
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, company, message } = req.body;

    // バリデーション
    if (!name || !email || !message) {
      return res.status(400).json({
        error: '必須項目が入力されていません。',
        success: false
      });
    }

    // メールアドレスの簡易バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'メールアドレスの形式が正しくありません。',
        success: false
      });
    }

    // Resend APIキーの確認
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not set');
      return res.status(500).json({
        error: 'サーバーの設定エラーです。管理者に連絡してください。',
        success: false
      });
    }

    const resend = new Resend(resendApiKey);

    // メール送信
    const data = await resend.emails.send({
      from: 'Pet Collabo Contact Form <onboarding@resend.dev>', // Resendのデフォルト送信元
      to: ['contact@petcollabo.com'], // 実際の受信先メールアドレスに変更
      replyTo: email, // 返信先を問い合わせ者のメールアドレスに設定
      subject: `Pet Collabo お問い合わせ - ${name}様より`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Cormorant Garamond', serif;
                line-height: 1.6;
                color: #0a0a0a;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                border-bottom: 2px solid #d4af37;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .header h1 {
                margin: 0;
                font-size: 32px;
                color: #0a0a0a;
              }
              .header p {
                margin: 5px 0 0 0;
                color: #737373;
                font-size: 14px;
                letter-spacing: 0.2em;
                text-transform: uppercase;
              }
              .field {
                margin-bottom: 25px;
              }
              .label {
                display: block;
                font-size: 12px;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                color: #737373;
                margin-bottom: 8px;
              }
              .value {
                font-size: 16px;
                color: #0a0a0a;
                padding: 12px;
                background-color: #f5f5f5;
                border-left: 3px solid #d4af37;
              }
              .message-value {
                white-space: pre-wrap;
                line-height: 1.8;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e5e5;
                font-size: 12px;
                color: #737373;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Pet Collabo</h1>
              <p>お問い合わせフォーム</p>
            </div>

            <div class="field">
              <span class="label">お名前</span>
              <div class="value">${name}</div>
            </div>

            <div class="field">
              <span class="label">メールアドレス</span>
              <div class="value">${email}</div>
            </div>

            ${company ? `
            <div class="field">
              <span class="label">会社名</span>
              <div class="value">${company}</div>
            </div>
            ` : ''}

            <div class="field">
              <span class="label">お問い合わせ内容</span>
              <div class="value message-value">${message}</div>
            </div>

            <div class="footer">
              <p>このメールは Pet Collabo ウェブサイトのお問い合わせフォームから送信されました。</p>
              <p>返信する場合は、このメールに直接返信してください。</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log('Email sent successfully:', data);

    return res.status(200).json({
      success: true,
      message: 'メールを送信しました。',
      id: data.id
    });

  } catch (error: any) {
    console.error('Email send error:', error);
    return res.status(500).json({
      error: 'メール送信中にエラーが発生しました。',
      success: false,
      details: error.message
    });
  }
}
