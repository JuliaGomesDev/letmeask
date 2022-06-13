import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useParams } from 'react-router-dom'
import { database } from '../services/firebase'
import { push, ref } from 'firebase/database'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'

import '../styles/room.scss'

type RoomParams = {
  id: any
}

export function Room() {
  const params = useParams<RoomParams>()
  const roomId = params.id
  const [newQuestion, setNewQuestion] = useState('')
  const { user } = useAuth()

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === '') {
      return
    }

    if (!user) {
      throw new Error('You must be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighLighted: false,
      isAnswered: false
    }

    await push(ref(database, `/rooms/${roomId}/questions`), question)
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala React</h1>
          <span>4 perguntas</span>
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={event => {
              setNewQuestion(event.target.value)
            }}
            value={newQuestion}
          ></textarea>

          <div className="form-footer">
            <span>
              Para enviar uma pergunta, <button>faça seu login</button>.
            </span>
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
