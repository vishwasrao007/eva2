'use client'

import { useTypingEffect } from '@/components/useTypingEffect'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type AIState = 'idle' | 'listening' | 'speaking'

interface Props {
  onStartListening?: () => void
  onStopListening?: () => void
  isAudioPlaying?: boolean
  currentText: string
}

export default function AiTalkingAnimation({ onStartListening, onStopListening, isAudioPlaying, currentText }: Props) {
  const [aiState, setAiState] = useState<AIState>('idle')
  const animatedCurrentText = useTypingEffect(currentText, 20)
  const displayedText = useTypingEffect('Click the circle to start the conversation', 20)

  const handleCircleClick = () => {
    if (aiState === 'listening' || aiState === 'speaking') {
      onStopListening?.()
      setAiState('idle')
    } else if (!isAudioPlaying) {
      onStartListening?.()
      setAiState('listening')
    }
  }

  useEffect(() => {
    if (isAudioPlaying) setAiState('speaking')
    else if (aiState === 'speaking' && currentText) setAiState('listening')
  }, [isAudioPlaying])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative mb-8 cursor-pointer" onClick={handleCircleClick} role="button" aria-label={aiState === 'listening' ? 'Stop listening' : 'Start listening'}>
        <motion.div
          className="w-40 h-40 rounded-full overflow-hidden flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <img
            src={aiState === 'listening' ? '/listening.gif' : aiState === 'speaking' ? '/listening.gif' : '/listening.gif'}
            alt={aiState === 'listening' ? 'AI is listening' : aiState === 'speaking' ? 'AI is speaking' : 'AI is idle'}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <p className="text-gray-800 text-lg font-mono" aria-live="polite">
          {aiState === 'listening' ? 'Listening...' : aiState === 'speaking' ? animatedCurrentText : displayedText}
        </p>
        {aiState === 'idle' && (
          <motion.div
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="h-5 w-2 bg-violet-600 mt-2"
          />
        )}
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => {
            if (!isAudioPlaying) {
              onStartListening?.()
              setAiState('listening')
            }
          }}
          disabled={aiState === 'listening' || aiState === 'speaking'}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            aiState === 'listening' || aiState === 'speaking'
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-violet-600 text-white hover:from-pink-600 hover:to-violet-700'
          }`}
        >
          Start
        </button>
        <button
          onClick={() => {
            if (aiState === 'listening' || aiState === 'speaking') {
              onStopListening?.()
              setAiState('idle')
            }
          }}
          disabled={aiState === 'idle'}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            aiState === 'idle'
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700'
          }`}
        >
          End
        </button>
      </div>
    </div>
  )
}
