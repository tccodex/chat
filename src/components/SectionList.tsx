import { useEffect, useRef } from 'react';
import { type LineItem, SectionItem } from './SectionItem';
import styles from './SectionList.module.css';

export type SectionId = 'channels' | 'dms';

export interface ActiveKey {
  section: SectionId;
  id: number;
}

export interface SectionListProps {
  label: string;
  items: LineItem[];
  section: SectionId;
  activeKey: ActiveKey;
  onSelect: (key: ActiveKey) => void;
}

function useScrollBounce(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const atTop = el.scrollTop === 0 && e.deltaY < 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight && e.deltaY > 0;

      if (!atTop && !atBottom) return;

      const cls = atTop ? styles.bounceTop : styles.bounceBottom;
      el.classList.remove(styles.bounceTop, styles.bounceBottom);
      void el.offsetWidth;
      el.classList.add(cls);
      el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [ref]);
}

export function SectionList({ label, items, section, activeKey, onSelect }: SectionListProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollBounce(ref);

  return (
    <div ref={ref} className={styles.section}>
      <span className={styles.sectionLabel}>{label}</span>
      {items.map((item) => (
        <SectionItem
          key={item.id}
          item={item}
          isActive={activeKey.section === section && activeKey.id === item.id}
          onSelect={() => onSelect({ section, id: item.id })}
        />
      ))}
    </div>
  );
}
