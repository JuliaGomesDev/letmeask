import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { get, ref } from 'firebase/database'
import { database } from '../services/firebase'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleImg from '../assets/images/google-icon.svg'

import { Button } from '../components/Button'

import '../styles/auth.scss'

export function Home() {
  const navigate = useNavigate()
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('')

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === '') {
      return
    }

    const roomRef = await get(ref(database, `rooms/${roomCode}`))

    if (!roomRef.exists()) {
      alert('Room does not exists.')
      return
    }

    navigate(`/rooms/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Toda pergunta tem uma resposta.</strong>
        <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />

          <button
            onClick={async event => {
              if (!user) {
                await signInWithGoogle()
              }

              event.preventDefault()
              navigate('/rooms/new')
            }}
            className="create-room"
          >
            <img src={googleImg} alt="Logo do Google" />
            Crie a sua sala com o Google
          </button>

          <div className="separator">Ou entre em uma sala </div>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => {
                setRoomCode(event.target.value)
              }}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
