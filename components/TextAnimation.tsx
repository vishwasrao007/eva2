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
  const animatedCurrentText = useTypingEffect(currentText && currentText.trim().length > 0 ? currentText : 'Hi Good Morning! How may I help you?', 20)
  const displayedText = useTypingEffect('Click the circle to start the conversation', 20)

  const handleCircleClick = () => {
    if (aiState === 'listening' || aiState === 'speaking') {
      onStopListening?.()
    } else if (!isAudioPlaying) {
      onStartListening?.()
    }
  }

  useEffect(() => {
    if (isAudioPlaying) setAiState('speaking')
    else if (aiState === 'speaking' && currentText) setAiState('listening')
    else setAiState('idle')
  }, [isAudioPlaying, currentText])

  return (
    <div className="relative flex flex-col items-center justify-between bg-gradient-to-b from-[#5B7FFF] to-[#AEE2FF] shadow-xl h-[100vh]" style={{ minHeight: '100vh' }}>
      <div className="absolute top-5 right-2.5">
        <img src="/close.svg" alt="Close" className="h-8" />
      </div>
      {/* Top Section */}
      <div className="flex flex-col items-center w-full pt-[3.2rem]">
        <span className="text-white text-base font-medium mb-2">Welcome to HDFC Bank!</span>
        <span className="text-[52px] font-extrabold text-white leading-none mb-1" style={{ letterSpacing: '-2px' }}>
          <span className="text-[#AEE2FF]">I'm EVA</span>
        </span>
        <span className="text-white text-xl font-medium">Your all new AI Assistant</span>
        <div className="relative flex items-center justify-center">
          <div className="rounded-full p-2" onClick={handleCircleClick}>
            <img
              src={aiState === 'listening' ? '/eva.gif' : aiState === 'speaking' ? '/eva.gif' : '/eva.gif'}
              alt={aiState === 'listening' ? 'AI is listening' : aiState === 'speaking' ? 'AI is speaking' : 'AI is idle'}
              className="w-[300px] h-[300px] rounded-full object-cover"
            />
          </div>
        </div>
        {/* Animated Eva's voice text replaces greeting/help text below Eva image */}
        <div className="flex flex-col items-center w-4/5 mx-auto text-center">
          {animatedCurrentText.split(/(?<=[.?!])\s+/).map((sentence, idx) =>
            sentence.trim().endsWith('?') ? (
              <span key={idx} className="block text-2xl font-bold text-white">{sentence}</span>
            ) : (
              <span key={idx} className="block text-base font-normal text-white">{sentence}</span>
            )
          )}
        </div>
      </div>
      {/* Bottom Listening Box */}
      <div className="w-full px-2 pb-2 pt-2">
        <div className="bg-white rounded-[32px] flex flex-col items-center justify-center w-full min-h-[180px] h-[180px] p-2">
          <div className="flex items-center gap-2 mb-1">
            {aiState === 'listening' && <span className="text-[#5B7FFF] font-semibold text-lg">Listening...</span>}
          </div>
          {/* Start and End Buttons moved inside white box */}
          <div className="flex flex-col justify-center mt-auto w-full">
            <div className="flex-1 flex justify-center">
              <img
                src={
                  aiState === 'listening'
                    ? '/blob-listening.gif'
                    : aiState === 'speaking'
                    ? '/blob-answering.gif'
                    : '/blob-static.gif'
                }
                alt="Start"
                width={100}
                height={100}
                className={`cursor-pointer ${aiState === 'listening' || aiState === 'speaking' ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => {
                  if (!isAudioPlaying) {
                    onStartListening?.()
                    setAiState('listening')
                  }
                }}
              />
            </div>
            <div className="flex-1 flex justify-end pr-[6px] pb-[6px]">
              <img
                src="/end-call.svg"
                alt="End"
                width={30}
                height={30}
                className={`cursor-pointer ${aiState === 'idle' ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => {
                  if (aiState === 'listening' || aiState === 'speaking') {
                    onStopListening?.()
                    setAiState('idle')
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
