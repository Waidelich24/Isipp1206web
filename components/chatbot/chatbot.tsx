'use client';

import { useState } from 'react';
import { ChatBubble } from './ChatBubble';
import { ChatUI } from './ChatUI';
import { useChatLogic } from './hooks/useChatlogic';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    input,
    setInput,
    quickReplies,
    handleSend,
    handleQuickReply
  } = useChatLogic();

  return (
    <div className="fixed bottom-6 right-[96px] z-50">
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-0 right-14">
            <ChatUI
              isOpen={isOpen}
              messages={messages}
              input={input}
              quickReplies={quickReplies}
              onSend={handleSend}
              onInputChange={setInput}
              onQuickReply={handleQuickReply}
            />
          </div>
        )}
        <ChatBubble onToggle={() => setIsOpen(prev => !prev)} />
      </div>
    </div>
  );
};