import * as React from 'react';
import type { Idea } from '../hooks/useIdeas';

interface IdeaItemProps {
  idea: Idea;
  rank?: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onToggle: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onRemove: (id: string) => void;
}

export function IdeaItem({ idea, rank, canMoveUp, canMoveDown, onToggle, onMove, onRemove }: IdeaItemProps) {
  const checkboxId = `idea-${idea.id}`;

  return (
    <li className="idea">
      <span className="idea__rank" aria-hidden="true">
        {rank !== undefined ? `#${rank}` : ''}
      </span>

      <div className="idea__body">
        <input
          id={checkboxId}
          type="checkbox"
          checked={idea.done}
          onChange={() => onToggle(idea.id)}
        />
        <label htmlFor={checkboxId} className={idea.done ? 'idea__label idea__label--done' : 'idea__label'}>
          {rank !== undefined && <span className="visually-hidden">{`Priority ${rank}: `}</span>}
          {idea.text}
        </label>
      </div>

      {idea.done && <span className="tag">✓ Done</span>}

      <div className="idea__actions">
        {!idea.done && (
          <>
            <button
              type="button"
              className="icon-button"
              aria-label={`Raise priority of ${idea.text}`}
              disabled={!canMoveUp}
              onClick={() => onMove(idea.id, -1)}
            >
              <span aria-hidden="true">↑</span>
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label={`Lower priority of ${idea.text}`}
              disabled={!canMoveDown}
              onClick={() => onMove(idea.id, 1)}
            >
              <span aria-hidden="true">↓</span>
            </button>
          </>
        )}
        <button
          type="button"
          className="icon-button"
          aria-label={`Delete ${idea.text}`}
          onClick={() => onRemove(idea.id)}
        >
          <span aria-hidden="true">🗑</span>
        </button>
      </div>
    </li>
  );
}
