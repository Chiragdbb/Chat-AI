import { useEffect, useRef, useState } from 'react'
import './newPrompt.css'
import Upload from '../upload/Upload'
import { IKImage } from 'imagekitio-react';
import model from '../../lib/gemini';
import Markdown from 'react-markdown'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import toast from 'react-hot-toast'

const NewPrompt = ({ data }) => {

    const endRef = useRef(null)
    const hasSentInitial = useRef(false)
    const isGenerating = useRef(false)

    const [answer, setAnswer] = useState("")
    const [question, setQuestion] = useState("")
    const [inputValue, setInputValue] = useState("")

    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {}
    })

    // todo: bug
    const validPath = img?.dbData?.filePath && img.dbData.filePath.trim() !== "";

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" })
    }, [data, answer, question, img.dbData])

    const queryClient = useQueryClient()
    const { getAccessTokenSilently } = useAuth0()

    const mutation = useMutation({
        mutationFn: async ({ question: q, answer: a, imgPath }) => {
            const token = await getAccessTokenSilently()

            return await fetch(`${import.meta.env.VITE_SERVER_URL}/api/chat/${data._id}`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    question: q,
                    answer: a,
                    img: imgPath
                })
            }).then(res => res.json())
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat', data._id] }).then(() => {
                setQuestion("")
                setAnswer("")
                setImg({
                    isLoading: false,
                    error: "",
                    dbData: {},
                    aiData: {}
                })
            })
        },
        onError: (err) => {
            console.log(err)
            toast.error("Failed to save chat reply")
        }
    })

    const buildChat = () => {
        const filteredHistory = data?.history?.filter(entry => entry.role && entry.parts?.[0]?.text) || [];

        // Gemini chat history must end on a model turn before a new user message.
        // New chats store only the first user prompt — drop that trailing user turn
        // so sendMessageStream can send it as the live message.
        const historyForChat =
            filteredHistory.length && filteredHistory[filteredHistory.length - 1].role === "user"
                ? filteredHistory.slice(0, -1)
                : filteredHistory;

        return model.startChat({
            history: historyForChat.map(({ role, parts }) => ({
                role,
                parts: [{ text: parts[0].text }],
            }))
        });
    }

    const formatGeminiError = (e) => {
        const message = e?.message || String(e)
        if (message.includes("429") || message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate")) {
            return "Gemini rate limit hit. Wait a minute and try again."
        }
        if (message.includes("API key") || message.includes("403")) {
            return "Gemini API key rejected. Check VITE_GEMINI_API_KEY and restart Vite."
        }
        return message.slice(0, 180) || "Failed to get Gemini response"
    }

    const add = async (text, isInitial) => {
        if (isGenerating.current) return
        isGenerating.current = true

        if (!isInitial) setQuestion(text)
        try {
            const chat = buildChat()
            const result = await chat.sendMessageStream(
                Object.entries(img.aiData).length ? [img.aiData, text] : [text]
            );

            let accumText = '';

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                accumText += chunkText;
                setAnswer(accumText);
            }

            if (!accumText.trim()) {
                toast.error("Gemini returned an empty response")
                return
            }

            // Pass values directly — React state would still be stale here
            await mutation.mutateAsync({
                question: isInitial ? null : text,
                answer: accumText,
                imgPath: img.dbData?.filePath || null
            })

        } catch (e) {
            console.log(e)
            toast.error(formatGeminiError(e))
        } finally {
            isGenerating.current = false
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()

        const text = e.target.text.value;

        if (text.trim() === "" || !text) {
            setInputValue("")
            return
        };
        setInputValue("")

        add(text, false)
    }

    useEffect(() => {
        if (hasSentInitial.current) return
        if (data?.history?.length === 1 && data.history[0]?.parts?.length > 0) {
            hasSentInitial.current = true
            add(data.history[0].parts[0].text, true)
        }
    }, [data])

    return (
        <>
            {/* Add new chat */}
            <div className='user-upload'>
                {img.isLoading && (<div className='loading'>Loading...</div>)}
                {!img.isLoading && validPath && (
                    <IKImage
                        className='upload-img message user'
                        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                        path={validPath ? img.dbData.filePath : null}
                        transformation={[{ width: 400 }]}
                    />
                )}
            </div>
            {question && <div className='message user'>
                {question}
            </div>}
            {answer && <div className='message model'>
                <div className='model-logo'>
                    <img src="/logo-2.svg" alt="" hidden />
                </div>
                <Markdown>{answer}</Markdown>
            </div>}
            <div className='endChat' ref={endRef} ></div>

            <div className='form-container'>
                <form className="newForm" onSubmit={submitHandler}>
                    <Upload setImg={setImg} />
                    <input
                        id='file'
                        type='file'
                        multiple={false}
                        hidden />
                    <input
                        type="text"
                        name='text'
                        placeholder='Ask anything...'
                        autoComplete='off'
                        value={inputValue}
                        spellCheck={false}
                        onChange={(e) => (setInputValue(e.target.value))}
                    />
                    <button>
                        <img src="/arrow.png" alt="" />
                    </button>
                </form>
            </div>
        </>
    )
}

export default NewPrompt
