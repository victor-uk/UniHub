import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSearch?.(q); }}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" />
      <button type="submit">Search</button>
    </form>
  );
}


