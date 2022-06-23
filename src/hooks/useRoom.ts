import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { off, onValue, ref } from 'firebase/database'
import { database } from '../services/firebase'

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
    likes: Record<
      string,
      {
        authorId: string
      }
    >
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
  likeCount: number
  likeId: string | undefined
}

export function useRoom(roomId: string) {
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
              isAnswered: value.isAnswered,
              likeCount: Object.values(value.likes ?? {}).length,
              likeId: Object.entries(value.likes ?? {}).find(
                ([key, like]) => like.authorId === user?.id
              )?.[0]
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

    return () => {
      off(roomRef)
    }
  }, [roomId, user?.id])

  return { questions, title }
}
