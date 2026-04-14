import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import { generateShortCode } from './services/LinkService'
import prisma from './db'
import { log } from 'node:console'

// 1) setup

dotenv.config()
const app = express();

app.use(cors());


//middleware to parse JSON bodies
app.use(express.json());

const PORT = 5000;

app.get('/', (req: Request, res: Response) => {
    res.send("Link Shortener is Running")
})

//route for short links

app.post('/shorten', async (req: Request, res: Response) => {
    // Change this line to match your Postman/Frontend key
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: "Please provide originalUrl" });
    }

    try {
        const shortCode = generateShortCode();

        const newLink = await prisma.link.create({
            data: {
                originalUrl: originalUrl, // Now they match!
                shortCode: shortCode,
            },
        });

        res.status(201).json(newLink);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});
//Route to redirect using the short code

app.get('/:code', async (req: Request, res: Response) => {
    const code = req.params.code;

    if (typeof code !== 'string') {
        return res.status(400).json({ error: "Invalid short code" });
    }

    try {
        const link = await prisma.link.findUnique({
            where: { shortCode: code }
        });

        if (link) {
            // Increment the click count in the background
            await prisma.link.update({
                where: { id: link.id },
                data: { clicks: { increment: 1 } }
            });

            return res.redirect(link.originalUrl);
        }
        
        res.status(404).json({ error: "Link not Found"});
    }catch (error){
        res.status(500).json({ error: "Server Error during Redirection"})
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
})






