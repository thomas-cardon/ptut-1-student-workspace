import ReactMarkdown from 'react-markdown';

export default function Post({ id, title, content, author, date }) {
  return (
    <article style={{ border: 'darkgrey solid 1px', borderRadius: '8px', padding: '2em', 'marginBottom': '2em' }}>
      <h1>{title}</h1><small>— #{id}</small>
      <ReactMarkdown allowDangerousHtml="true">
        {content}
      </ReactMarkdown>
    </article>
  )
}
