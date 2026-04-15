import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import { generateShortCode } from './services/LinkService'
import prisma from './db'

dotenv.config()
const app = express();

// 1. CORS setup for both of your Vercel domains
app.use(cors({
    origin: [
        "https://lnk-io.vercel.app", 
        "https://link-shortener-mohit.vercel.app", 
        "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send("lnk.io API is Running")
})

// 2. Ignore Favicon requests to keep logs clean
app.get('/favicon.ico', (req, res) => res.status(204).end());

// --- New Route: Get Stats without incrementing clicks ---
// This is what your Frontend's "Refresh Stats" button will call
app.get('/stats/:code', async (req: Request, res: Response) => {
    const code = req.params.code as string;
    try {
        const link = await prisma.link.findFirst({
            where: { shortCode: code }
        });

        if (link) {
            return res.json(link);
        }
        res.status(404).json({ error: "Link not found" });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// --- Shorten Route ---
app.post('/shorten', async (req: Request, res: Response) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ error: "Please provide originalUrl" });
    }

    try {
        const shortCode = generateShortCode();
        const newLink = await prisma.link.create({
            data: {
                originalUrl: originalUrl,
                shortCode: shortCode,
            },
        });
        res.status(201).json(newLink);
    } catch (error) {
        console.error("Create Error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// --- Redirection & Analytics Route ---
app.get('/:code', async (req: Request, res: Response) => {
    const code = req.params.code as string;

    try {
        // Step 1: Find the link
        const link = await prisma.link.findFirst({
            where: { shortCode: code }
        });

        if (link) {
            // Step 2: Increment the click count
            await prisma.link.update({
                where: { id: link.id },
                data: { clicks: { increment: 1 } }
            });

            // Step 3: Ensure URL is absolute and Redirect
            const targetUrl = link.originalUrl.startsWith('http') 
                ? link.originalUrl 
                : `https://${link.originalUrl}`;
                
            return res.redirect(targetUrl);
        }
        
        throw new Error("Not found");
    } catch (error) {
        return res.status(404).send(`
            <div style="font-family: sans-serif; text-align: center; margin-top: 100px; background: #0d1117; color: white; height: 100vh; padding-top: 50px;">
                <h1 style="color: #38bdf8; font-size: 3rem;">404</h1>
                <h2>Link Not Found</h2>
                <a href="https://lnk-io.vercel.app" style="color: #38bdf8; text-decoration: none; border: 1px solid #38bdf8; padding: 10px 20px; border-radius: 8px;">Back to Home</a>
            </div>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
})