import { useState } from 'react';
import { type ActiveKey, SectionList } from './SectionList';
import { type LineItem } from './SectionItem';
import styles from './SidePane.module.css';

interface IconItem {
  id: number;
  label: string;
  icon: () => React.ReactElement;
}

const CHANNELS: LineItem[] = [
  { id: 1, prefix: '#', label: 'general', badge: 3 },
  { id: 2, prefix: '#', label: 'random' },
  { id: 3, prefix: '#', label: 'design' },
  { id: 4, prefix: '#', label: 'engineering' },
  { id: 5, prefix: '#', label: 'frontend' },
  { id: 6, prefix: '#', label: 'backend' },
  { id: 7, prefix: '#', label: 'devops' },
  { id: 8, prefix: '#', label: 'announcements' },
  { id: 9, prefix: '#', label: 'off-topic' },
];

const DIRECT_MESSAGES: LineItem[] = [
  { id: 1, prefix: '●', label: 'Alice Martin', badge: 1 },
  { id: 2, prefix: '●', label: 'Bob Chen' },
  { id: 3, prefix: '●', label: 'Carol White' },
  { id: 4, prefix: '●', label: 'David Kim' },
  { id: 5, prefix: '●', label: 'Eva Rossi' },
  { id: 6, prefix: '●', label: 'Frank Osei' },
  { id: 7, prefix: '●', label: 'Grace Liu' },
  { id: 8, prefix: '●', label: 'Henry Patel' },
];

const ICONS: IconItem[] = [
  {
    id: 1,
    label: 'Profile',
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: 2,
    label: 'Notifications',
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: 3,
    label: 'Search',
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    id: 4,
    label: 'Settings',
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export function SidePane() {
  const [activeKey, setActiveKey] = useState<ActiveKey>({ section: 'channels', id: 1 });

  return (
    <div className={styles.pane}>
      <SectionList
        label="Channels"
        items={CHANNELS}
        section="channels"
        activeKey={activeKey}
        onSelect={setActiveKey}
      />

      <hr className={styles.divider} />

      <SectionList
        label="Direct Messages"
        items={DIRECT_MESSAGES}
        section="dms"
        activeKey={activeKey}
        onSelect={setActiveKey}
      />

      <div className={styles.iconSection}>
        <hr className={styles.divider} />
        <div className={styles.iconRow}>
          {ICONS.map((item) => (
            <button key={item.id} className={styles.iconButton} title={item.label}>
              {item.icon()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
