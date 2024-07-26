import express, { json } from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
const app = express();
const port = 3000;
const SHORTENER_API_URL = process.env.SHORTENER_API_URL;
const SHORTENER_API_KEY = process.env.SHORTENER_API_KEY;

app.use(cors());
app.use(json());

app.get('/', (req, res) => {
    res.send('Server Deployed 🥳');
});

app.get(`/shortener`, async (req, res) => {
    const { inputValue } = req.query;
    if (!inputValue) {
        return res.status(400).json({ success: false, message: 'URL parameter is required' });
    }

    try {
        const apiUrl = SHORTENER_API_URL;
        const apiKey = SHORTENER_API_KEY;
        const payload = {
            url: inputValue,
            domain: "tinyurl.com",
        };
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.code === 0) {
            const shortenedUrl = data.data.tiny_url;
            res.json({ success: true, data: { url: shortenedUrl } });
        } else {
            res.status(500).json({ success: false, message: 'Failed to shorten URL' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: `Error with external service: ${error.message}` });
    }
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));