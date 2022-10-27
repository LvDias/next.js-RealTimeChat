import { uuid } from "uuidv4"
import { setCookie, getCookie } from 'cookies-next'

import { useEffect } from 'react'
import io from 'Socket.IO-client'
let socket

export default function Room(props){

    useEffect(() => {

        if(getCookie('user-nickname')){
            
            document.getElementById('modal-nickname').classList.remove('d-flex')
            document.getElementById('modal-nickname').classList.add('d-none')

        }else{
            
            document.getElementById('button-nickname').addEventListener('click', () => {
    
                const nickname = document.getElementById('input-nickname').value
    
                setCookie('user-nickname', nickname)
                setCookie('user-id', uuid())

                document.getElementById('modal-nickname').classList.remove('d-flex')
                document.getElementById('modal-nickname').classList.add('d-none')
    
            })
    
        }

    }, [])

    useEffect(() => socketInitializer(), [])

    const socketInitializer = async () => {
        await fetch('/api/socket');
        socket = io()
        
        socket.on('connect', () => {
            console.log('connected')
        })

        socket.emit('join-room', props.room)

        socket.on('response-message', msg => {

            const divMyMessage = document.createElement('div')
                divMyMessage.classList.add('d-flex')
                divMyMessage.classList.add('flex-column')
                divMyMessage.classList.add('align-items-start')

            const myName = document.createElement('p')
                myName.classList.add('text-start')
                myName.appendChild(document.createTextNode(msg.nickname))

            const myMessage = document.createElement('p')
                myMessage.appendChild(document.createTextNode(msg.message))

            divMyMessage.appendChild(myName)
            divMyMessage.appendChild(myMessage)

            document.getElementById('messages-area').appendChild(divMyMessage)

        })

    }
    
    const onClickButtonMessage = () => {

        const inputMessage = document.getElementById('input-message').value

        if(inputMessage.trim()){

            socket.emit('input-message', {
                id: getCookie('user-id'),
                nickname: getCookie('user-nickname'),
                message: inputMessage,
                room: props.room
            })

            const divMyMessage = document.createElement('div')
                divMyMessage.classList.add('d-flex')
                divMyMessage.classList.add('flex-column')
                divMyMessage.classList.add('align-items-end')

            const myName = document.createElement('p')
                myName.classList.add('text-end')
                myName.appendChild(document.createTextNode(getCookie('user-nickname')))

            const myMessage = document.createElement('p')
                myMessage.appendChild(document.createTextNode(inputMessage))

            divMyMessage.appendChild(myName)
            divMyMessage.appendChild(myMessage)

            document.getElementById('messages-area').appendChild(divMyMessage)
            
        }

        document.getElementById('input-message').value = ''

    }

    return(

        <>
        
            <div className='d-flex flex-column vh-100'>

                <div id='messages-area' className='d-flex flex-column col py-3 px-5 gap-4' />

                <div className='d-flex'>

                    <input id='input-message' className='px-3 py-2 col' type='text' placeholder='Write the message...' style={{ outline: 'none' }} />
                    <button onClick={onClickButtonMessage} className='px-5 py-2'>Send</button>

                </div>

            </div>

            <div id='modal-nickname' className='d-flex justify-content-center align-items-center position-absolute w-100 h-100 bg-dark top-0 start-0' style={{ zIndex: 2 }}>

                <div className='d-flex flex-column gap-2'>

                    <input id='input-nickname' className='px-3 py-2 col' type='text' placeholder='Nickname*' style={{ outline: 'none' }} />
                    <button id='button-nickname' className='px-5 py-2'>Continue</button>

                </div>

            </div>
        
        </>

    )

}

export async function getServerSideProps(ctx){

    return{

        props: {
            room: ctx.params.room
        }

    }

}