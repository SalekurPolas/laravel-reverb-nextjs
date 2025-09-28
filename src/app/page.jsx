'use client';

import { useEffect, useState } from 'react';
import { getEcho } from '@/lib/echo';
import { loginWithPhone } from '@/lib/auth';

export default function Home() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    let echo;

    const init = async () => {
      try {
        const { token, user } = await loginWithPhone('01723348519');
        setUser(user);

        echo = getEcho(token);

        echo.channel('test').listen('.test', (e) => 
          setEvents(prev => [...prev, { type: 'public', data: e }])
        );

        echo.private(`streamer.${user.branches[0].id}`).listen('.streamer', (e) => 
          setEvents(prev => [...prev, { type: 'private', data: e }])
        );

        echo.private(`App.Models.User.${user.id}`).notification((notification) => 
          setEvents(prev => [...prev, { type: 'notification', data: notification }])
        );
      } catch (err) {
        console.error('Echo Init Failed:', err);
        setError('Failed to connect to live events.');
      }
    };

    init();

    return () => {
      if (echo) echo.disconnect();
    };
  }, []);

  if (!hydrated) return null;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Live Events from Laravel Reverb</h1>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {user && (
        <div className="mb-6 text-gray-700">
          Logged in as <strong>{user.first_name} {user.last_name}</strong> (ID: {user.id})
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-gray-500">No events received yet...</div>
      ) : (
        <ul className="space-y-2">
          {events.map((ev, i) => (
            <li key={i} className="p-4 bg-gray-100 rounded shadow-sm">
              <strong>{ev.type}:</strong> <pre className="whitespace-pre-wrap">{JSON.stringify(ev.data, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
