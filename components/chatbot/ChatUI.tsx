'use client';

import React, { useRef, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'bot' | 'user';
}

interface ChatUIProps {
  isOpen: boolean;
  messages: Message[];
  input: string;
  quickReplies: string[];
  onSend: () => void;
  onInputChange: (text: string) => void;
  onQuickReply: (text: string) => void;
}

export const ChatUI = ({
  isOpen,
  messages,
  input,
  quickReplies,
  onSend,
  onInputChange,
  onQuickReply
}: ChatUIProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="min-h-[350px] h-auto max-h-[60vh] w-[300px] bg-card rounded-lg shadow-lg overflow-hidden border border-border">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto p-3 space-y-2 text-sm">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-md max-w-[90%] ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground self-end text-right'
                  : 'bg-secondary self-start text-secondary-foreground'
              }`}
            >
              {msg.text}
            </div>
          ))}

          {quickReplies.length > 0 && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">¿En qué puedo ayudarte?</p>
              <ul className="space-y-1">
                {quickReplies.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => onQuickReply(option)}
                    className="cursor-pointer text-primary hover:underline hover-vibrate"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-2 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSend();
            }}
            className="flex"
          >
            <input
              type="text"
              className="flex-1 px-2 py-1 text-sm border border-input rounded-l-md focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
            />
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};