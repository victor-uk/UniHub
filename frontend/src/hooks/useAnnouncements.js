import { useEffect, useState } from 'react';

export default function useAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/announcements');
      const data = await res.json();
      setAnnouncements(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  return { announcements, loading, reload };
}


