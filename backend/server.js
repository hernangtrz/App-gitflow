const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Base de datos en memoria
let habits = [];
let logs = [];   // { date, habitId, done }
let moods = [];  // { date, emoji, note }
let nextHabitId = 1;

const today = () => new Date().toISOString().split('T')[0];

// --- HÁBITOS ---
app.get('/habits', (req, res) => res.json(habits));

app.post('/habits', (req, res) => {
  const habit = { id: nextHabitId++, name: req.body.name, icon: req.body.icon || '✅' };
  habits.push(habit);
  res.status(201).json(habit);
});

app.delete('/habits/:id', (req, res) => {
  habits = habits.filter(h => h.id !== parseInt(req.params.id));
  res.status(204).end();
});

// --- LOGS (marcar hábito como hecho hoy) ---
app.get('/logs', (req, res) => {
  const date = req.query.date || today();
  res.json(logs.filter(l => l.date === date));
});

app.post('/logs/toggle', (req, res) => {
  const { habitId } = req.body;
  const date = today();
  const existing = logs.find(l => l.habitId === habitId && l.date === date);
  if (existing) {
    logs = logs.filter(l => !(l.habitId === habitId && l.date === date));
    return res.json({ done: false });
  }
  logs.push({ habitId, date });
  res.json({ done: true });
});

// --- MOOD ---
app.get('/mood', (req, res) => {
  const date = req.query.date || today();
  res.json(moods.find(m => m.date === date) || null);
});

app.post('/mood', (req, res) => {
  const date = today();
  const idx = moods.findIndex(m => m.date === date);
  const entry = { date, emoji: req.body.emoji, note: req.body.note || '' };
  if (idx >= 0) moods[idx] = entry; else moods.push(entry);
  res.json(entry);
});

// --- HISTORIAL (últimos 7 días) ---
app.get('/history', (req, res) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  });
  const result = days.map(date => ({
    date,
    mood: moods.find(m => m.date === date) || null,
    completed: logs.filter(l => l.date === date).length,
    total: habits.length
  }));
  res.json(result);
});

app.listen(3000, () => console.log('✅ Backend en http://localhost:3000'));