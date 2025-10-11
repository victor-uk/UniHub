export function truncateHtml(html, max = 160) {
  const text = html.replace(/<[^>]*>/g, '');
  return text.length > max ? text.slice(0, max) + '…' : text;
}


