import { useState, useEffect } from "react";

const MOODS = ["😄", "🙂", "😐", "😔", "😤"];

export default function MoodCard({ mood, api, onSave }) {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (mood) {
      setSelected(mood.emoji);
      setNote(mood.note || "");
    }
  }, [mood]);

  const save = async () => {
    if (!selected) return alert("Selecciona un emoji primero");
    await fetch(`${api}/mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji: selected, note }),
    });
    onSave();
  };

  return (
    <div style={card}>
      <h2 style={cardTitle}>¿Cómo te sientes hoy?</h2>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {MOODS.map((e) => (
          <button
            key={e}
            onClick={() => setSelected(e)}
            style={{
              fontSize: 28,
              background: "none",
              border: `2px solid ${selected === e ? "#2d2d2a" : "transparent"}`,
              borderRadius: 10,
              padding: "6px 10px",
              cursor: "pointer",
              background: selected === e ? "#f0f0eb" : "none",
            }}
          >
            {e}
          </button>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Nota opcional..."
        rows={2}
        style={{
          marginTop: 10,
          width: "100%",
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 14,
          resize: "none",
          fontFamily: "sans-serif",
        }}
      />
      <button onClick={save} style={saveBtn}>
        Guardar mood
      </button>
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
const saveBtn = {
  marginTop: 10,
  background: "#2d2d2a",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "8px 18px",
  cursor: "pointer",
  fontSize: 14,
};
