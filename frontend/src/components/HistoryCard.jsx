export default function HistoryCard({ history }) {
  return (
    <div style={card}>
      <h2 style={cardTitle}>Últimos 7 días</h2>
      {history.map((day) => {
        const pct = day.total
          ? Math.round((day.completed / day.total) * 100)
          : 0;
        const label = new Date(day.date + "T12:00:00").toLocaleDateString(
          "es-CO",
          { weekday: "short", day: "numeric", month: "short" },
        );
        return (
          <div
            key={day.date}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderBottom: "1px solid #f0f0eb",
              fontSize: 14,
            }}
          >
            <span style={{ width: 90, color: "#888" }}>{label}</span>
            <div
              style={{
                flex: 1,
                height: 8,
                background: "#eee",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: "#2d2d2a",
                  borderRadius: 4,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                color: "#888",
                width: 32,
                textAlign: "right",
              }}
            >
              {pct}%
            </span>
            <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>
              {day.mood ? day.mood.emoji : "—"}
            </span>
          </div>
        );
      })}
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
