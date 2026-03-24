import styles from './MessageBubble.module.css';

export type MessageDirection = 'incoming' | 'outgoing';

export interface Message {
  id: number;
  content: string;
  direction: MessageDirection;
  timestamp: string;
}

const DIRECTION_STYLES: Record<MessageDirection, string> = {
  incoming: styles.incoming,
  outgoing: styles.outgoing,
};

export function MessageBubble({ message }: { message: Message }) {
  const directionClass = DIRECTION_STYLES[message.direction];

  return (
    <div className={`${styles.messageRow} ${directionClass}`}>
      <div className={`${styles.bubble} ${directionClass}`}>
        {message.content}
        <span className={styles.timestamp}>{message.timestamp}</span>
      </div>
    </div>
  );
}
