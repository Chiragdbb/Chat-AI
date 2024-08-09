import './chatPage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import Markdown from 'react-markdown'
import { IKImage } from 'imagekitio-react'
import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const ChatPage = () => {
    // get chat id from url
    const path = useLocation().pathname
    const chatId = path.split("/").at(-1)
    const { getAccessTokenSilently } = useAuth0()

    const { isPending, error, data } = useQuery({
        // todo: look into it
        queryKey: ['chat', chatId],
        queryFn: async () => {
            const token = await getAccessTokenSilently()

            return fetch(`${import.meta.env.VITE_SERVER_URL}/api/chat/${chatId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': "application/json"
                }
            })
                .then((res) => res.json())
                .catch(e => {
                    console.log(e)
                })
        }
    })

    return (
        <div className='chatPage' id='chatPage'>
            <div className="wrapper">
                <div className="chat">
                    {isPending
                        ? "Loading..."
                        : error
                            ? "Something went wrong"
                            : (data?.history?.map((message, i) => (
                                <React.Fragment key={i}>
                                    {message.img && (
                                        <IKImage
                                            key={i}
                                            urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                                            path={message.img}
                                            width={400}
                                            height={300}
                                            transformation={[{ width: 400, height: 300 }]}
                                            loading='lazy'
                                            lqip={{ active: true, quality: 20 }}
                                        />
                                    )}
                                    <div className={message.role === "user" ? "message user" : "message model"} key={i}>
                                        <div className='model-logo'>
                                            <img src="/logo-2.svg" alt="" hidden />
                                        </div>
                                        <Markdown>
                                            {message?.parts[0]?.text}
                                        </Markdown>
                                    </div>
                                </React.Fragment>
                            )))}
                    {/* // ! why data is checked  */}
                    {data && <NewPrompt data={data} />}
                    <div />
                </div>
            </div>
        </div>
    )
}

export default ChatPage