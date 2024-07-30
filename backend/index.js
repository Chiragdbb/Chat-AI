import express from 'express'
import ImageKit from 'imagekit'
import cors from 'cors'
import mongoose from 'mongoose'

const PORT = process.env.PORT || 3000
const app = express()

// db Connect
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
    credentials: true
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

// app.get("/api/test", (req,res)=>{
//     res.send("working")
// })

app.post("/api/chats", (req, res) => {
    const { text } = req.body
    console.log(text)
    // res.status(200).send(`Entered text: ${text}`)
})

app.listen(PORT, () => {
    connect()
    console.log(`SERVER RUNNNING ON ${PORT}`)
})