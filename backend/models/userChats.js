import mongoose from "mongoose";

const userChatsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    chats: [
        {
            // id created when this chat is saved in db
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
                // ! generating the same time for all entries??
                // default: Date.now(),
                default: () => {
                    const [seconds, nanoseconds] = process.hrtime();
                    return new Date(seconds * 1000 + nanoseconds / 1e6);
                }
            }
        }
    ]
}, { timestamps: true })

// if chat exists then use it, otherwise create a new one
export default mongoose.models.UserChats || mongoose.model("UserChats", userChatsSchema)
