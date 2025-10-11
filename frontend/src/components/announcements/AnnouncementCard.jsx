export default function AnnouncementCard({ title, content, department, priority, authorName, createdAt }) {
  return (
    <article>
      <h3>{title}</h3>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <p>
        <strong>Department:</strong> {department} · <strong>Priority:</strong> {priority}
      </p>
      {authorName && <p><em>By {authorName}</em></p>}
      {createdAt && <p><small>{new Date(createdAt).toLocaleString()}</small></p>}
    </article>
  );
}


