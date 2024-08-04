import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    history: [
        {
            role: {
                type: String,
                enum: ["user", "model"],
                required: true,
            },
            parts: [
                {
                    text: {
                        type: String,
                        required: true,
                    },
                }
            ],
            img: {
                type: String,
                required: false
            }
        }
    ]
}, { timestamps: true })

// if chat exists then use it, otherwise create a new one
export default mongoose.models.Chat || mongoose.model("Chat", chatSchema)
