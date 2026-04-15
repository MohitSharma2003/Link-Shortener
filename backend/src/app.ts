import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import { generateShortCode } from './services/LinkService'
import prisma from './db'

dotenv.config()
const app = express();

// 1. Updated CORS to use your new clean project name
app.use(cors({
    origin: ["https://link-shortener-mohit.vercel.app", "http://localhost:5173"] 
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.send("lnk.io API is Running")
})

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
        // Step 1: Find the link first (using findFirst avoids the unique constraint error)
        const link = await prisma.link.findFirst({
            where: { shortCode: code }
        });

        if (link) {
            // Step 2: Increment the click count using the primary ID (always unique)
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

        // Fallback for codes not in DB
        throw new Error("Link not found");
        
    } catch (error) {
        console.log("Redirect error for code:", code);
        return res.status(404).send(`
            <div style="font-family: sans-serif; text-align: center; margin-top: 100px; background: #0d1117; color: white; height: 100vh; padding-top: 50px;">
                <h1 style="color: #38bdf8; font-size: 3rem;">404</h1>
                <h2>Link Not Found</h2>
                <p style="color: #8b949e;">The link you're looking for doesn't exist.</p>
                <a href="https://link-shortener-mohit.vercel.app" style="color: #38bdf8; text-decoration: none; border: 1px solid #38bdf8; padding: 10px 20px; rounded: 8px;">Create New Link</a>
            </div>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
})