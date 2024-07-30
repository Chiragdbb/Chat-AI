import mongoose from "mongoose";

const userChatsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    chats: [
        {
            _id: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Data.now()
            }
        }
    ]
}, { timestamps: true })

// if chat exists then use it, otherwise create a new one
export default mongoose.models.userchats || mongoose.model("userchats", userChatsSchema)
