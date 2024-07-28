import { useRef } from 'react'
import './chatPage.css'
import { useEffect } from 'react'

const ChatPage = () => {

    const endRef = useRef(null)

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" })
    }, [])

    return (
        <div className='chatPage'>
            <div className="wrapper">
                <div className="chat">
                    <div className="message user">Test message from user</div>
                    <div className="message">Test message from AI</div>
                    <div className="message user">Test message from user</div>
                    <div className="message">Test message from AI</div>
                    <div className="message user">Test message from user</div>
                    <div className="message">Test message from AI</div>
                    <div className="message user">Test message from user Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis architecto quidem recusandae harum omnis officiis deserunt nihil sit maxime enim!</div>
                    <div className="message">Test message from AI Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae velit, nisi soluta maxime aperiam quidem nam modi consequatur. Quas quos, earum optio mollitia eos aut corporis excepturi distinctio tempora facere! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla officia facere nostrum iure, culpa quidem debitis ipsam consequatur, dolor itaque sed laudantium provident eum nihil, quo dolorum ratione eos pariatur!
                        Quia nihil, quae optio nesciunt incidunt impedit corrupti adipisci eum veritatis voluptas excepturi assumenda accusamus ad odit facilis voluptatem minus odio quo. Dolorum dolores quae obcaecati odio, corporis provident ea! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam eaque earum maiores eligendi odio minima quod ad asperiores ipsum facere illum esse dolor, corrupti animi voluptates quis nihil assumenda excepturi.
                        Harum distinctio neque maxime laudantium, quibusdam consequuntur tempora architecto veniam veritatis quas animi quisquam dolore eos repellat est odio. Similique illo dolores expedita, excepturi totam nihil vel tempore est voluptatibus!
                        Fugit repudiandae nobis consequuntur, modi rem quisquam eveniet consequatur corrupti molestiae eum velit quidem, eius animi quis laborum sunt odio quod dolor mollitia iste. Eligendi veniam officiis eum recusandae praesentium.
                        Suscipit, eius tenetur eos mollitia quia, in totam illo similique vero quibusdam distinctio, consectetur quod perferendis error maxime tempora. Optio inventore earum fugiat itaque voluptatum magni culpa voluptates distinctio dolores.
                        Aliquid, deserunt consequuntur! Enim quisquam nesciunt beatae praesentium. Ipsum magnam similique magni facere ducimus officiis, excepturi nisi fugiat deleniti inventore minus, quaerat quisquam eius perferendis fugit laborum, quibusdam repudiandae laudantium?

                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum minus nam officia nesciunt! Iste veritatis ipsam dolorum iusto, facere voluptatum impedit ex soluta officia rerum quo? Non quasi eum optio!
                        Laboriosam optio nulla minus in tempore ipsa. Voluptatum, qui consectetur at deserunt dolores quas excepturi. Aut consequuntur deserunt quis eveniet, iure vitae delectus eligendi? Ex saepe optio harum assumenda cum?
                        Nulla quo blanditiis amet, ullam neque hic aut sed consectetur. Placeat illo praesentium aspernatur unde ex culpa. Ipsum, accusamus, ratione voluptatibus nesciunt quibusdam, culpa commodi voluptatem recusandae numquam quas quae?
                        Debitis mollitia dicta animi quia harum provident nostrum doloremque, hic suscipit rem quas exercitationem omnis natus placeat laboriosam sequi maiores esse culpa iusto optio officia? Officia blanditiis repudiandae placeat quisquam!
                        Asperiores eum, perspiciatis ducimus, sequi quibusdam eius eaque fuga beatae vel accusantium praesentium illo quia, sint explicabo impedit dolores iste mollitia labore assumenda dolore unde recusandae necessitatibus sed amet? Aspernatur?</div>
                    <div className="message user">Test message from user</div>
                    <div className="message">Test message from AI</div>
                    <div className="message user">Test message from user</div>
                    <div className="message">Test message from AI</div>
                    <div className="message user">Test message from user</div>
                    <div className="message">Test message from AI</div>
                    <div className="message user">Test message from user</div>
                    <div className="message">Test message from AI</div>
                    <div className="message user">Test message from user</div>
                    <div className="message">Test message from AI</div>
                    <div ref={endRef} />
                </div>
            </div>
        </div>
    )
}

export default ChatPage