const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let habits = [];
let logs = [];
let moods = [];
let nextHabitId = 1;

const today = () => new Date().toISOString().split("T")[0];

// Health check (útil para Jenkins)
app.get("/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date() }),
);

// Hábitos
app.get("/habits", (req, res) => res.json(habits));

app.post("/habits", (req, res) => {
  if (!req.body.name)
    return res.status(400).json({ error: "name is required" });
  const habit = {
    id: nextHabitId++,
    name: req.body.name,
    icon: req.body.icon || "✅",
  };
  habits.push(habit);
  res.status(201).json(habit);
});

app.delete("/habits/:id", (req, res) => {
  habits = habits.filter((h) => h.id !== parseInt(req.params.id));
  res.status(204).end();
});

// Logs
app.get("/logs", (req, res) => {
  const date = req.query.date || today();
  res.json(logs.filter((l) => l.date === date));
});

app.post("/logs/toggle", (req, res) => {
  const { habitId } = req.body;
  const date = today();
  const exists = logs.find((l) => l.habitId === habitId && l.date === date);
  if (exists) {
    logs = logs.filter((l) => !(l.habitId === habitId && l.date === date));
    return res.json({ done: false });
  }
  logs.push({ habitId, date });
  res.json({ done: true });
});

// Mood
app.get("/mood", (req, res) => {
  const date = req.query.date || today();
  res.json(moods.find((m) => m.date === date) || null);
});

app.post("/mood", (req, res) => {
  const date = today();
  const idx = moods.findIndex((m) => m.date === date);
  const entry = { date, emoji: req.body.emoji, note: req.body.note || "" };
  if (idx >= 0) moods[idx] = entry;
  else moods.push(entry);
  res.json(entry);
});

// Historial
app.get("/history", (req, res) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  });
  res.json(
    days.map((date) => ({
      date,
      mood: moods.find((m) => m.date === date) || null,
      completed: logs.filter((l) => l.date === date).length,
      total: habits.length,
    })),
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend en http://localhost:${PORT}`));
