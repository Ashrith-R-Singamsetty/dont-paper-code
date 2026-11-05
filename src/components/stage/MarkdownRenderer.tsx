import React from 'react';

interface MarkdownRendererProps {
  markdown: string;
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={idx}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.86em',
            padding: '0.12rem 0.38rem',
            borderRadius: '5px',
            background: 'rgb(var(--accent) / 0.12)',
            color: 'rgb(var(--accent))',
            fontWeight: 600,
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push(
        <pre
          key={`code-${i}`}
          className="sketch-border-soft"
          style={{
            padding: '0.85rem 1rem',
            background: 'rgb(var(--paper))',
            fontFamily: 'var(--font-mono)',
            fontSize: '12.5px',
            lineHeight: 1.6,
            overflowX: 'auto',
            margin: '0.75rem 0',
          }}
        >
          {codeLines.join('\n')}
        </pre>
      );
      continue;
    }

    // Table block
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|/.test(lines[i + 1])) {
      const parseRow = (r: string) =>
        r
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => c.trim());
      const headers = parseRow(lines[i]);
      i += 2; // skip header and separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        rows.push(parseRow(lines[i]));
        i++;
      }
      blocks.push(
        <div key={`tbl-${i}`} style={{ overflowX: 'auto', margin: '0.9rem 0' }}>
          <table
            className="sketch-border-soft"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              background: 'rgb(var(--paper))',
            }}
          >
            <thead>
              <tr style={{ background: 'rgb(var(--surface-alt))', borderBottom: '1.5px solid rgb(var(--ink) / 0.16)' }}>
                {headers.map((h, hIdx) => (
                  <th
                    key={hIdx}
                    style={{
                      textAlign: 'left',
                      padding: '0.55rem 0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11.5px',
                    }}
                  >
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: '1px solid rgb(var(--ink) / 0.08)' }}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} style={{ padding: '0.5rem 0.75rem' }}>
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      blocks.push(
        <h2
          key={`h1-${i}`}
          style={{
            fontFamily: 'var(--font-hand)',
            fontSize: '1.45rem',
            fontWeight: 800,
            margin: '0.4rem 0 0.65rem',
          }}
        >
          {renderInline(line.slice(2))}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push(
        <h3
          key={`h2-${i}`}
          style={{
            fontFamily: 'var(--font-hand)',
            fontSize: '1.15rem',
            fontWeight: 700,
            margin: '1.1rem 0 0.45rem',
            color: 'rgb(var(--accent))',
          }}
        >
          {renderInline(line.slice(3))}
        </h3>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      blocks.push(
        <blockquote
          key={`bq-${i}`}
          style={{
            borderLeft: '3.5px solid rgb(var(--accent))',
            background: 'rgb(var(--active-bg) / 0.45)',
            padding: '0.65rem 0.95rem',
            borderRadius: '0 8px 8px 0',
            margin: '0.75rem 0',
            fontSize: '13.5px',
          }}
        >
          {renderInline(line.slice(2))}
        </blockquote>
      );
      i++;
      continue;
    }

    // Bullet or Numbered List
    if (/^(\s*[-*]|\s*\d+\.)\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^(\s*[-*]|\s*\d+\.)\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^(\s*[-*]|\s*\d+\.)\s+/, ''));
        i++;
      }
      blocks.push(
        <ul key={`ul-${i}`} style={{ paddingLeft: '1.35rem', margin: '0.5rem 0', display: 'grid', gap: '0.35rem' }}>
          {items.map((it, idx) => (
            <li key={idx} style={{ fontSize: '13.5px', lineHeight: 1.6 }}>
              {renderInline(it)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Standard Paragraph
    blocks.push(
      <p key={`p-${i}`} style={{ fontSize: '14px', lineHeight: 1.7, margin: '0.45rem 0', color: 'rgb(var(--sketch))' }}>
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div>{blocks}</div>;
};
