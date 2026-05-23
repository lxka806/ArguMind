const nodemailer = require("nodemailer")

const smtpHost = process.env.EMAIL_HOST
const smtpPort = Number(process.env.EMAIL_PORT || 587)
const smtpSecure = process.env.EMAIL_SECURE === "true"
const smtpUser = process.env.EMAIL_USERNAME
const smtpPass = process.env.EMAIL_PASSWORD
const emailFrom = process.env.EMAIL_FROM || `ArguMind <${smtpUser || "no-reply@argumind.local"}>`

const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: smtpUser && smtpPass ? {
        user: smtpUser,
        pass: smtpPass
    } : undefined
})

const sendEmail = async (options) => {
    try {
        if (!smtpHost) {
            throw new Error("Email host is not configured. Set EMAIL_HOST in backend/.env.")
        }

        if (!smtpUser || !smtpPass) {
            throw new Error("Email credentials are missing. Set EMAIL_USERNAME and EMAIL_PASSWORD in backend/.env.")
        }

        await transporter.sendMail({
            from: emailFrom,
            to: options.to,
            subject: options.subject,
            html: options.html
        })
    } catch (e) {
        console.log("Email error:", e)
        throw e
    }
}

module.exports = sendEmail
