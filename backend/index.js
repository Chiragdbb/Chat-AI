import express from 'express'
import ImageKit from 'imagekit'
import cors from 'cors'
import mongoose from 'mongoose'
import Chat from './models/chat.js'
import UserChats from './models/userChats.js'
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import userChats from './models/userChats.js'

const PORT = process.env.PORT || 3000
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
    ClerkExpressRequireAuth(),
    async (req, res) => {
        const userId = req.auth.userId

        try {
            const userChats = await userChats.find({ userId })
            // check fetched data structure
            res.status(200).send(userChats[0].chats)
        } catch (error) {

        }
    })

app.post("/api/chats",
    ClerkExpressRequireAuth(),
    async (req, res) => {
        const { userId, text } = req.body

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

            // IF FIRST CHAT, THEN CREATE USER CHATS ARRAY
            // IF USER CHATS ALREADY EXIST, THEN PUSH THIS ONE IN IT
            const userChats = await UserChats.find({ userId: userId })

            // DOESN'T EXIST
            if (!userChats.length) {
                const newUserChats = new UserChats({
                    userId: userId,
                    chats: [
                        {
                            _id: savedChat._id,
                            title: text.substring(0, 40),
                        }
                    ]
                })

                await newUserChats.save()
            } else {
                //EXISTS
                await UserChats.updateOne({ userId: userId }, {
                    // todo: pushing inside data entry or just the object we give
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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(401).send('Unauthenticated!');
});

app.listen(PORT, () => {
    connect()
    console.log(`SERVER RUNNNING ON ${PORT}`)
})