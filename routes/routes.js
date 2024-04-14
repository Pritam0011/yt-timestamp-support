import { config } from "dotenv";
config();
import { Router } from "express";
import nodemailer from "nodemailer";
const rou = Router();
import axios from "axios";
const validation_url = process.env.EMAIL_VALIDATION_URL;

rou.get("/", (req, res) => {
	return res.status(200).json({ message: "Hello World" });
});
rou.post("/ext/api/send", async (req, res) => {
	const { to, emailHtml } = req.body;
	console.log("to", to);

	const transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		secure: process.env.MAIL_SECURE === "true" ? true : false,
		auth: {
			user: process.env.MAIL_AUTH_USER,
			pass: process.env.MAIL_AUTH_PASS,
		},
	});

	try {
		const data = await axios.get(`${validation_url}&email=${to}`);

		if (data.data.deliverability === "UNDELIVERABLE")
			return res.status(400).json({ msg: "Mail Not Found!" });
	} catch (error) {
		return res.status(500).json({ msg: "error" });
	}

	const options = {
		from: "Youtube-Video-Timestamp-Extension@ext.com",
		to,
		subject: "Bookmarks from YOUTUBE VIDEO TIMESTAMP EXTENSION",
		html: emailHtml,
	};

	try {
		await transporter.sendMail(options);
		return res.status(200).json({ msg: "ok" });
	} catch (error) {
		return res.status(500).json({ msg: "error" });
	}
});

export default rou;
