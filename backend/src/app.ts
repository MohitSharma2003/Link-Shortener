import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import { generateShortCode } from './services/LinkService'
import prisma from './db'

dotenv.config()
const app = express();

// 1. Production CORS (Replace with your actual Vercel link)
app.use(cors({
    origin: ["https://your-vercel-project-name.vercel.app", "http://localhost:5173"] 
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
    const { code } = req.params;

    try {
        // Optimized: Find and Increment in ONE step
        // We use updateMany or update so the click is registered before the user leaves
        const link = await prisma.link.update({
            where: { shortCode: code },
            data: {
                clicks: { increment: 1 }
            }
        });

        if (link) {
            // Ensure URL is absolute for redirection
            const targetUrl = link.originalUrl.startsWith('http') 
                ? link.originalUrl 
                : `https://${link.originalUrl}`;
                
            return res.redirect(targetUrl);
        }
        
    } catch (error) {
        // If Prisma can't find the record, it throws an error. Catch it here for 404.
        console.log("Redirect error (Likely 404):", code);
        return res.status(404).send(`
            <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                <h1>404 - Link Not Found</h1>
                <p>The short link you are looking for doesn't exist or has expired.</p>
                <a href="https://your-vercel-url.vercel.app">Create a new one</a>
            </div>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
})