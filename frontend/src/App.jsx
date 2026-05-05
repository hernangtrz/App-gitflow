import { useState, useEffect } from "react";
import MoodCard from "./components/MoodCard";
import HabitsCard from "./components/HabitsCard";
import HistoryCard from "./components/HistoryCard";

const API = "http://localhost:3000";

export default function App() {
  const [habits, setHabits] = useState([]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [history, setHistory] = useState([]);
  const [mood, setMood] = useState(null);

  const load = async () => {
    const [h, l, hi, m] = await Promise.all([
      fetch(`${API}/habits`).then((r) => r.json()),
      fetch(`${API}/logs`).then((r) => r.json()),
      fetch(`${API}/history`).then((r) => r.json()),
      fetch(`${API}/mood`).then((r) => r.json()),
    ]);
    setHabits(h);
    setTodayLogs(l);
    setHistory(hi);
    setMood(m);
  };

  useEffect(() => {
    load();
  }, []);

  const todayStr = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <header
        style={{
          background: "#2d2d2a",
          color: "white",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 22 }}>🌱</span>
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>Habit & Mood Tracker</h1>
        <span style={{ marginLeft: "auto", fontSize: 13, opacity: 0.6 }}>
          {todayStr}
        </span>
      </header>
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <MoodCard mood={mood} api={API} onSave={load} />
        <HabitsCard
          habits={habits}
          logs={todayLogs}
          api={API}
          onUpdate={load}
        />
        <HistoryCard history={history} />
      </div>
    </div>
  );
}
