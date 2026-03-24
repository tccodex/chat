import styles from './SectionItem.module.css';

export interface LineItem {
  id: number;
  prefix: string;
  label: string;
  badge?: number;
}

export interface SectionItemProps {
  item: LineItem;
  isActive: boolean;
  onSelect: () => void;
}

export function SectionItem({ item, isActive, onSelect }: SectionItemProps) {
  return (
    <button
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onClick={onSelect}
    >
      <span className={styles.itemPrefix}>{item.prefix}</span>
      <span className={styles.itemLabel}>{item.label}</span>
      {item.badge !== undefined && (
        <span className={styles.badge}>{item.badge}</span>
      )}
    </button>
  );
}
