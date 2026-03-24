import { useEffect, useRef, useState } from 'react';
import { type Message, MessageBubble } from './MessageBubble';
import styles from './MessageContainer.module.css';

const INITIAL_MESSAGES: Message[] = [
  { id: 1, content: 'Hey, are you there?', direction: 'incoming', timestamp: '9:01 AM' },
  { id: 2, content: "Yeah, what's up?", direction: 'outgoing', timestamp: '9:02 AM' },
  { id: 3, content: 'Just checking in on the project timeline.', direction: 'incoming', timestamp: '9:02 AM' },
  { id: 4, content: "It's coming along. I finished the layout yesterday.", direction: 'outgoing', timestamp: '9:03 AM' },
  { id: 5, content: "Nice! Does it handle long messages well? I want to make sure the bubbles don't stretch all the way across the screen.", direction: 'incoming', timestamp: '9:04 AM' },
  { id: 6, content: 'Yep, max-width is capped at 60% of the container so they stay readable.', direction: 'outgoing', timestamp: '9:05 AM' },
  { id: 7, content: "Perfect. Let's sync up later this week.", direction: 'incoming', timestamp: '9:06 AM' },
];

function formatTimestamp(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function MessageContainer() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    const content = input.trim();
    if (!content) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, content, direction: 'outgoing', timestamp: formatTimestamp() },
    ]);
    setInput('');
  }

  return (
    <div className={styles.container}>
      <div className={styles.messageList}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={listEndRef} />
      </div>

      <div className={styles.inputArea}>
        <textarea
          className={styles.textarea}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className={styles.sendButton} onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
