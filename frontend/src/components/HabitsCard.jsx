import { useState } from "react";

const ICONS = ["💧", "📚", "🏃", "🧘", "🥗", "😴", "✍️"];

export default function HabitsCard({ habits, logs, api, onUpdate }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("💧");

  const add = async () => {
    if (!name.trim()) return;
    await fetch(`${api}/habits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), icon }),
    });
    setName("");
    onUpdate();
  };

  const toggle = async (id) => {
    await fetch(`${api}/logs/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId: id }),
    });
    onUpdate();
  };

  const remove = async (id) => {
    await fetch(`${api}/habits/${id}`, { method: "DELETE" });
    onUpdate();
  };

  return (
    <div style={card}>
      <h2 style={cardTitle}>Hábitos de hoy</h2>
      {!habits.length && (
        <p style={{ color: "#aaa", fontSize: 14 }}>
          Aún no tienes hábitos. ¡Agrega uno!
        </p>
      )}
      {habits.map((h) => {
        const done = logs.some((l) => l.habitId === h.id);
        return (
          <div
            key={h.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 0",
              borderBottom: "1px solid #f0f0eb",
            }}
          >
            <button
              onClick={() => toggle(h.id)}
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                border: `2px solid ${done ? "#2d2d2a" : "#ccc"}`,
                background: done ? "#2d2d2a" : "none",
                color: "white",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {done ? "✓" : ""}
            </button>
            <span style={{ fontSize: 20 }}>{h.icon}</span>
            <span
              style={{
                flex: 1,
                fontSize: 15,
                textDecoration: done ? "line-through" : "none",
                color: done ? "#aaa" : "#222",
              }}
            >
              {h.name}
            </span>
            <button
              onClick={() => remove(h.id)}
              style={{
                background: "none",
                border: "none",
                color: "#ccc",
                cursor: "pointer",
                fontSize: 18,
              }}
            >
              ×
            </button>
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <select
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 8,
            fontSize: 18,
          }}
        >
          {ICONS.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Nuevo hábito..."
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 14,
          }}
        />
        <button
          onClick={add}
          style={{
            background: "#2d2d2a",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            cursor: "pointer",
          }}
        >
          + Agregar
        </button>
      </div>
    </div>
  );
}

const card = {
  background: "white",
  borderRadius: 12,
  padding: 20,
  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
};
const cardTitle = {
  fontSize: 14,
  fontWeight: 600,
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 14,
};
