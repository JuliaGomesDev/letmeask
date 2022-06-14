import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useParams } from 'react-router-dom'
import { database } from '../services/firebase'
import { onValue, push, ref } from 'firebase/database'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'

import '../styles/room.scss'

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string
      avatar: string
    }
    content: string
    isAnswered: boolean
    isHighLighted: boolean
  }
>

type Question = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighLighted: boolean
}

type RoomParams = {
  id: any
}

export function Room() {
  const params = useParams<RoomParams>()
  const roomId = params.id
  const [newQuestion, setNewQuestion] = useState('')
  const { user } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    const roomRef = ref(database, `/rooms/${roomId}`)

    onValue(
      roomRef,
      room => {
        const databaseRoom = room.val()
        const FirebaseQuestions: FirebaseQuestions =
          databaseRoom.questions ?? {}

        const parsedQuestions = Object.entries(FirebaseQuestions).map(
          ([key, value]) => {
            return {
              id: key,
              content: value.content,
              author: value.author,
              isHighLighted: value.isHighLighted,
              isAnswered: value.isAnswered
            }
          }
        )

        setTitle(databaseRoom.title)
        setQuestions(parsedQuestions)
      },
      {
        onlyOnce: false
      }
    )
  }, [roomId])

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

    setNewQuestion('')
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
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
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
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>

          {JSON.stringify(questions)}
        </form>
      </main>
    </div>
  )
}
