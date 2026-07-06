import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy')
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email to the site owner
    const ownerEmailData = {
      from: 'onboarding@resend.dev',
      to: 'tamilselvang0002@gmail.com',
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
      html: `
        <h2>New Message from ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    }

    // Greeting email to the sender
    const userEmailData = {
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Thank you for reaching out to Tamil Selvan',
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for getting in touch! I have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br/>Tamil Selvan G</p>
        <hr />
        <p><em>Your message:</em></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    }

    // Send both emails concurrently
    const [ownerResult, userResult] = await Promise.all([
      resend.emails.send(ownerEmailData),
      resend.emails.send(userEmailData)
    ])

    if (ownerResult.error || userResult.error) {
      console.error('Error sending email:', ownerResult.error || userResult.error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
