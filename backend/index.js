import express from 'express'
import ImageKit from 'imagekit'
import cors from 'cors'
import mongoose from 'mongoose'
import Chat from './models/chat.js'
import UserChats from './models/userChats.js'
import { auth } from 'express-oauth2-jwt-bearer'

const PORT = process.env.PORT || 3000

const AUTH_AUDIENCE = process.env.AUTH0_AUDIENCE_API
const AUTH_ISSUER_BASE_URL = process.env.AUTH0_ISSUER_BASE_URL

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
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization']
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

app.get("/api/chat/:id",
    checkJwt,
    async (req, res) => {
        const userId = req.auth.payload.sub
        try {
            const chat = await Chat.findOne({ _id: req.params.id, userId })

            res.status(200).send(chat)
        } catch (e) {
            console.log(e)
            res.status(500).send(`Error fetching chat ${req.params.id}`)
        }
    })

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

        // try {
        //     res.json({
        //         message: "successful",
        //         userId,
        //         text,
        //     })
        // } catch (e) {
        //     console.log(e)
        //     res.status(400).send(e)
        // }

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
                            title: text.substring(0, 40),
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

app.listen(PORT, () => {
    connect()
    console.log(`SERVER RUNNNING ON ${PORT}`)
})