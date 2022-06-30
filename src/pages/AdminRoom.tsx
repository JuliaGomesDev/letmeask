import { useNavigate, useParams } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
// import { useAuth } from '../hooks/useAuth'
import { ref, remove, update } from 'firebase/database'
import { database } from '../services/firebase'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

import '../styles/room.scss'

type RoomParams = {
  id: any
}

export function AdminRoom() {
  // const { user } = useAuth()
  const navigate = useNavigate()
  const params = useParams<RoomParams>()
  const roomId = params.id
  const { questions, title, active } = useRoom(roomId)

  async function handleEndRoom() {
    await update(ref(database, `/rooms/${roomId}`), {
      endedAt: new Date()
    })

    navigate('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await remove(ref(database, `/rooms/${roomId}/questions/${questionId}`))
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await update(ref(database, `/rooms/${roomId}/questions/${questionId}`), {
      isAnswered: true
    })
  }

  async function handleHighLightQuestion(questionId: string) {
    await update(ref(database, `/rooms/${roomId}/questions/${questionId}`), {
      isHighLighted: true
    })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighLighted={question.isHighLighted}
              >
                {!question.isAnswered && (
                  <>
                    {question.likeCount > 0 && (
                      <span>{question.likeCount} like(s)</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighLightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}
