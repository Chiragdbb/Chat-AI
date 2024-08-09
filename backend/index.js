import express from 'express'
import ImageKit from 'imagekit'
import cors from 'cors'
import mongoose from 'mongoose'
import Chat from './models/chat.js'
import UserChats from './models/userChats.js'
import { auth } from 'express-oauth2-jwt-bearer'

const AUTH_AUDIENCE = process.env.AUTH0_AUDIENCE_API
const AUTH_ISSUER_BASE_URL = process.env.AUTH0_ISSUER_BASE_URL
const PORT = process.env.PORT

const app = express()

// Connect to db
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(`Error while connecting to DB: ${error}`)
    }
}

// allow CORS
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))

app.use(express.json())

// auth0 middleware config
const checkJwt = auth({
    issuerBaseURL: AUTH_ISSUER_BASE_URL,
    audience: AUTH_AUDIENCE,
});


// ImageKit auth
const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});

// routes
app.get("/api/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
})

app.get("/api/userchats",
    checkJwt,
    async (req, res) => {
        const userId = req.auth.payload.sub
        try {
            const userChats = await UserChats.find({ userId })
            res.status(200).send(userChats[0]?.chats || [])
        } catch (e) {
            console.log(e)
            res.status(500).send("Error fetching userchats!")
        }
    })

app.get("/api/chat/:id", checkJwt, async (req, res) => {
    try {
        const userId = req.auth.payload.sub;
        const chatId = req.params.id;

        const chat = await Chat.findOne({ _id: req.params.id, userId });

        if (!chat) {
            return res.status(404).send(`Chat with ID ${chatId} not found`);
        }

        res.status(200).send(chat);
    } catch (e) {
        console.log(e);
        res.status(500).send(`Error fetching chat ${req.params.id}`);
    }
});


app.put("/api/chat/:id",
    checkJwt,
    async (req, res) => {
        const userId = req.auth.payload.sub
        const { question, answer, img } = req.body

        const newItems = [
            // 1st prompt answer is given by model when creating a new chat
            ...(question
                ? [{ role: "user", parts: [{ text: question }], ...(img && { ...img }) }]
                : []),
            { role: "model", parts: [{ text: answer }] }
        ]

        try {
            const updatedChat = await Chat.updateOne({ _id: req.params.id, userId },
                {
                    $push: {
                        history: {
                            $each: newItems,
                        }
                    }
                }
            )

            res.status(200).send(updatedChat)
        } catch (e) {
            console.log(e)
            res.status(500).send(`Error while updating chat ${req.params.id}`)
        }
    })

app.post("/api/chats",
    checkJwt,
    async (req, res) => {
        const userId = req.auth.payload.sub
        const { text } = req.body

        try {
            // CREATE A NEW CHAT
            const newChat = new Chat({
                userId: userId,
                history: [
                    {
                        role: "user",
                        parts: [{ text }],
                    }
                ]
            })

            const savedChat = await newChat.save()

            // IF FIRST CHAT, THEN CREATE USERCHATS ARRAY, ELSE PUSH THIS ONE IN IT
            const userChats = await UserChats.find({ userId: userId })

            // DOESN'T EXIST
            if (!userChats.length) {
                const newUserChats = new UserChats({
                    userId: userId,
                    chats: [
                        {
                            _id: savedChat._id,
                            title: text.split(" ", 5).join(" "),
                        }
                    ]
                })

                await newUserChats.save()
            } else {
                //EXISTS
                await UserChats.updateOne({ userId: userId }, {
                    // todo: check if we are pushing inside data entry or just the object we give?
                    $push: {
                        chats: {
                            _id: savedChat._id,
                            title: text.substring(0, 40)
                        }
                    }
                })
            }

            res.status(201).send(newChat._id)
        } catch (e) {
            res.status(500).send(`Error while creating chat: ${e}`)
        }
    })

app.delete("/api/chat/:id",
    checkJwt,
    async (req, res) => {
        const userId = req.auth.payload.sub
        const chatId = req.params.id

        try {
            // remove chat from Chat
            await Chat.deleteOne({ _id: chatId, userId })


            // remove this title from userchats
            const result = await UserChats.updateOne(
                {
                    userId,
                    "chats._id": chatId
                },
                {
                    $pull: {
                        chats: {
                            _id: chatId
                        }
                    }
                }
            );

            // Check if any documents were modified
            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: `Chat with ID ${chatId} not found for user ${userId}` });
            }

            res.status(200).json({ message: `Chat with ID ${chatId} deleted successfully.` });
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: `Couldn't delete chat: ${e.message}` })
        }
    }
)

app.listen(PORT, () => {
    connect()
    console.log(`SERVER RUNNNING ON ${PORT}`)
})