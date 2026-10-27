import * as React from 'react';
import { Body, Button, Container, Heading, Icon, Page, TextField, useAnnounce } from '@walmart/ld-kit';
import { focusFirstError } from '@walmart/ld-kit/utils/focusFirstError';
import { IdeaItem } from '../components/IdeaItem';
import { useIdeas } from '../hooks/useIdeas';

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

export default function IdeasPage() {
  const { ideas, addIdea, toggleDone, removeIdea, move } = useIdeas();
  const announce = useAnnounce();

  const [text, setText] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();
  const formRef = React.useRef<HTMLFormElement>(null);
  const alertRef = React.useRef<HTMLDivElement>(null);

  const open = ideas.filter((i) => !i.done);
  const done = ideas.filter((i) => i.done);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Enter an idea before adding it.');
      focusFirstError(formRef, alertRef, new Set(['idea']));
      return;
    }
    addIdea(trimmed);
    setText('');
    setError(undefined);
    announce.polite(`Added idea: ${trimmed}. ${open.length + 1} open.`);
  }

  function handleToggle(id: string) {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;
    toggleDone(id);
    announce.polite(idea.done ? `Reopened: ${idea.text}` : `Crossed off: ${idea.text}`);
  }

  function handleMove(id: string, direction: -1 | 1) {
    const idx = open.findIndex((i) => i.id === id);
    const target = idx + direction;
    if (idx < 0 || target < 0 || target >= open.length) return;
    move(id, direction);
    announce.polite(`${open[idx].text} moved to priority ${target + 1} of ${open.length}`);
  }

  function handleRemove(id: string) {
    const idea = ideas.find((i) => i.id === id);
    removeIdea(id);
    if (idea) announce.polite(`Deleted: ${idea.text}`);
  }

  return (
    <Page title="Board" titleVisuallyHidden>
      <Container>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 0 48px' }}>
          <Heading as="h2">Board</Heading>
          {/* <Body>Capture ideas, rank them by priority, and cross them off when they are done.</Body> */}

          <form ref={formRef} onSubmit={handleSubmit} noValidate style={{ margin: '24px 0 32px' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 240px' }}>
                <TextField
                  label="New idea"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  error={error}
                  textFieldProps={{ name: 'idea', autoComplete: 'off' }}
                />
              </div>
              <div style={{ paddingTop: 24 }}>
                <Button type="submit" variant="primary" leading={<Icon name="Plus" decorative />}>
                  Add idea
                </Button>
              </div>
            </div>
            <div ref={alertRef} tabIndex={-1} aria-live="polite" style={{ outline: 'none' }} />
          </form>

          <section aria-labelledby="open-ideas-heading" style={{ marginBottom: 32 }}>
            <Heading as="h3" id="open-ideas-heading">
              {`Priority list (${open.length})`}
            </Heading>
            {open.length === 0 ? (
              <Body>
                {done.length > 0 ? 'Everything is crossed off. Add a new idea above.' : 'No ideas yet. Add your first one above.'}
              </Body>
            ) : (
              <ol style={{ ...listStyle, marginTop: 12 }}>
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
            <section aria-labelledby="done-ideas-heading">
              <Heading as="h3" id="done-ideas-heading">
                {`Crossed off (${done.length})`}
              </Heading>
              <ul style={{ ...listStyle, marginTop: 12 }}>
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
        </div>
      </Container>
    </Page>
  );
}
