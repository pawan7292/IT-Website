import { useState, useEffect } from 'react';
import { getNPTTime } from '../utils/nptTime';

export default function useNPTClock() {
  const [time, setTime] = useState(getNPTTime());

  useEffect(() => {
    const interval = setInterval(() => setTime(getNPTTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}
