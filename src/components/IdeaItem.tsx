import * as React from 'react';
import { Checkbox, Icon, IconButton, Tag, VisuallyHidden } from '@walmart/ld-kit';
import type { Idea } from '../hooks/useIdeas';

interface IdeaItemProps {
  idea: Idea;
  /** 1-based priority rank; undefined for crossed-off ideas. */
  rank?: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onToggle: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onRemove: (id: string) => void;
}

export function IdeaItem({ idea, rank, canMoveUp, canMoveDown, onToggle, onMove, onRemove }: IdeaItemProps) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        padding: '12px 16px',
        border: '1px solid var(--ld-semantic-color-stroke-default, #c8c9cc)',
        borderRadius: 8,
        background: 'var(--ld-semantic-color-surface-default, #fff)',
      }}
    >
      <span
        style={{ minWidth: 28, fontWeight: 700, color: 'var(--ld-semantic-color-text-subtle, #505050)' }}
        aria-hidden="true"
      >
        {rank !== undefined ? `#${rank}` : ''}
      </span>

      <div style={{ flex: '1 1 200px', minWidth: 0 }}>
        <Checkbox
          checked={idea.done}
          onChange={() => onToggle(idea.id)}
          label={
            <span style={idea.done ? { textDecoration: 'line-through' } : undefined}>
              {rank !== undefined && <VisuallyHidden>{`Priority ${rank}: `}</VisuallyHidden>}
              {idea.text}
            </span>
          }
        />
      </div>

      {idea.done && (
        <Tag color="positive" leading={<Icon name="Check" decorative />}>
          Done
        </Tag>
      )}

      <div style={{ display: 'flex', gap: 4 }}>
        {!idea.done && (
          <>
            <IconButton
              a11yLabel={`Raise priority of ${idea.text}`}
              size="small"
              disabled={!canMoveUp}
              onClick={() => onMove(idea.id, -1)}
            >
              <Icon name="ArrowUp" decorative />
            </IconButton>
            <IconButton
              a11yLabel={`Lower priority of ${idea.text}`}
              size="small"
              disabled={!canMoveDown}
              onClick={() => onMove(idea.id, 1)}
            >
              <Icon name="ArrowDown" decorative />
            </IconButton>
          </>
        )}
        <IconButton a11yLabel={`Delete ${idea.text}`} size="small" onClick={() => onRemove(idea.id)}>
          <Icon name="Trash" decorative />
        </IconButton>
      </div>
    </li>
  );
}
