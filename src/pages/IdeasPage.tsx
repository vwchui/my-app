import * as React from 'react';
import { IdeaItem } from '../components/IdeaItem';
import { useIdeas } from '../hooks/useIdeas';

export default function IdeasPage() {
  const { ideas, addIdea, toggleDone, removeIdea, move } = useIdeas();

  const [text, setText] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();
  const [announcement, setAnnouncement] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const open = ideas.filter((i) => !i.done);
  const done = ideas.filter((i) => i.done);

  function announce(message: string) {
    setAnnouncement(message);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Enter an idea before adding it.');
      inputRef.current?.focus();
      return;
    }
    addIdea(trimmed);
    setText('');
    setError(undefined);
    announce(`Added idea: ${trimmed}. ${open.length + 1} open.`);
  }

  function handleToggle(id: string) {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;
    toggleDone(id);
    announce(idea.done ? `Reopened: ${idea.text}` : `Crossed off: ${idea.text}`);
  }

  function handleMove(id: string, direction: -1 | 1) {
    const idx = open.findIndex((i) => i.id === id);
    const target = idx + direction;
    if (idx < 0 || target < 0 || target >= open.length) return;
    move(id, direction);
    announce(`${open[idx].text} moved to priority ${target + 1} of ${open.length}`);
  }

  function handleRemove(id: string) {
    const idea = ideas.find((i) => i.id === id);
    removeIdea(id);
    if (idea) announce(`Deleted: ${idea.text}`);
  }

  return (
    <main className="page">
      <h1 className="visually-hidden">Board</h1>
      <h2>Board</h2>

      <form onSubmit={handleSubmit} noValidate className="idea-form">
        <div className="idea-form__field">
          <label htmlFor="new-idea">New idea</label>
          <input
            id="new-idea"
            ref={inputRef}
            name="idea"
            type="text"
            autoComplete="off"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'new-idea-error' : undefined}
          />
          {error && (
            <p id="new-idea-error" className="field-error">
              {error}
            </p>
          )}
        </div>
        <button type="submit" className="button">
          + Add idea
        </button>
      </form>

      <div aria-live="polite" className="visually-hidden">
        {announcement}
      </div>

      <section aria-labelledby="open-ideas-heading" className="section">
        <h3 id="open-ideas-heading">{`Priority list (${open.length})`}</h3>
        {open.length === 0 ? (
          <p>
            {done.length > 0 ? 'Everything is crossed off. Add a new idea above.' : 'No ideas yet. Add your first one above.'}
          </p>
        ) : (
          <ol className="idea-list">
            {open.map((idea, idx) => (
              <IdeaItem
                key={idea.id}
                idea={idea}
                rank={idx + 1}
                canMoveUp={idx > 0}
                canMoveDown={idx < open.length - 1}
                onToggle={handleToggle}
                onMove={handleMove}
                onRemove={handleRemove}
              />
            ))}
          </ol>
        )}
      </section>

      {done.length > 0 && (
        <section aria-labelledby="done-ideas-heading" className="section">
          <h3 id="done-ideas-heading">{`Crossed off (${done.length})`}</h3>
          <ul className="idea-list">
            {done.map((idea) => (
              <IdeaItem
                key={idea.id}
                idea={idea}
                canMoveUp={false}
                canMoveDown={false}
                onToggle={handleToggle}
                onMove={handleMove}
                onRemove={handleRemove}
              />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
