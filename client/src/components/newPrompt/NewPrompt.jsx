import { useEffect, useRef, useState } from 'react'
import './newPrompt.css'
import Upload from '../upload/Upload'
import { IKImage } from 'imagekitio-react';
import model from '../../lib/gemini';
import Markdown from 'react-markdown'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { GoogleGenerativeAIResponseError } from '@google/generative-ai';

const NewPrompt = ({ data }) => {

    const endRef = useRef(null)

    const [answer, setAnswer] = useState("")
    const [question, setQuestion] = useState("")
    const [inputValue, setInputValue] = useState("")

    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {}
    })

    const filteredHistory = data?.history?.filter(entry => entry.role && entry.parts?.[0]?.text) || [];
    const chat = model.startChat({
        history: filteredHistory.map(({ role, parts }) => ({
            role,
            parts: [{ text: parts[0].text }],
        }))
    }, GoogleGenerativeAIResponseError);

    // todo: bug
    const validPath = img?.dbData?.filePath && img.dbData.filePath.trim() !== "";

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" })
    }, [data, answer, question, img.dbData])

    const queryClient = useQueryClient()
    const { getAccessTokenSilently } = useAuth0()


    // ! LOOK INTO THIS
    const mutation = useMutation({
        mutationFn: async () => {
            const token = await getAccessTokenSilently()

            return await fetch(`${import.meta.env.VITE_SERVER_URL}/api/chat/${data._id}`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    // todo: undefined
                    question: question.length ? question : null,
                    answer,
                    img: img.dbData?.filePath || null
                })
            }).then(res => res.json())
        },
        onSuccess: () => {
            // Invalidate and refetch
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
        }
    })

    const add = async (text, isInitial) => {
        // if already a question present
        if (!isInitial) setQuestion(text)
        try {
            const result = await chat.sendMessageStream(Object.entries(img.aiData).length ? [img.aiData, text] : [text]);

            let accumText = '';

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                accumText += chunkText;
                setAnswer(accumText);
            }

            mutation.mutate()

        } catch (e) {
            console.log(e)
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
        // * for initial query model response does not exist  => error for accessing non-existent data
        if (data?.history?.length === 1 && data.history[0]?.parts?.length > 0) {
            add(data.history[0].parts[0].text, true)
        }
    }, [])

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
            {answer && <div className='message'>
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