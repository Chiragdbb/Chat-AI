import { useEffect, useRef, useState } from 'react'
import './newPrompt.css'
import Upload from '../upload/Upload'
import { IKImage } from 'imagekitio-react';
import model from '../../lib/gemini';
import Markdown from 'react-markdown'

const NewPrompt = () => {

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

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "Hello, I have 2 dogs in my house." }],
            },
            {
                role: "model",
                parts: [{ text: "Great to meet you. What would you like to know?" }],
            },
        ],
        generationConfig: {
            // maxOutputTokens: 100,
        },
    });

    // todo: bug
    const validPath = img?.dbData?.filePath && img.dbData.filePath.trim() !== "";

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" })
    }, [answer, question, img.dbData])

    async function add(text) {
        setQuestion(text)
        const result = await chat.sendMessageStream(Object.entries(img.aiData).length ? [img.aiData, text] : [text]);
        let accumText = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            console.log(chunkText);
            accumText += chunkText;
            setAnswer(accumText);
        }
        setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {}
        })
    }

    const submitHandler = async (e) => {
        e.preventDefault()

        const text = e.target.text.value;

        if (text.trim() === "" || !text) {
            setInputValue("")
            return
        };

        console.log("text", text)
        setInputValue("")

        // add(text)
    }

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
                    onChange={(e) => (setInputValue(e.target.value))}
                />
                <button>
                    <img src="/arrow.png" alt="" />
                </button>
            </form>
        </>
    )
}

export default NewPrompt