const request = require("supertest");
const app = require("../app");

describe("Health Check", () => {
  test("GET /health debe retornar status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.app).toBe("habit-tracker");
  });
});

describe("Hábitos", () => {
  test("GET /habits debe retornar un array", async () => {
    const res = await request(app).get("/habits");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /habits debe crear un hábito", async () => {
    const res = await request(app)
      .post("/habits")
      .send({ name: "Tomar agua", icon: "💧" });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Tomar agua");
    expect(res.body.icon).toBe("💧");
    expect(res.body.id).toBeDefined();
  });

  test("POST /habits sin nombre debe retornar 400", async () => {
    const res = await request(app).post("/habits").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("name is required");
  });

  test("DELETE /habits/:id debe eliminar el hábito", async () => {
    const created = await request(app)
      .post("/habits")
      .send({ name: "Leer", icon: "📚" });
    const id = created.body.id;

    const res = await request(app).delete(`/habits/${id}`);
    expect(res.statusCode).toBe(204);
  });
});

describe("Mood", () => {
  test("GET /mood debe retornar null si no hay mood hoy", async () => {
    const res = await request(app).get("/mood");
    expect(res.statusCode).toBe(200);
  });

  test("POST /mood debe guardar el mood del día", async () => {
    const res = await request(app)
      .post("/mood")
      .send({ emoji: "😄", note: "Buen día" });
    expect(res.statusCode).toBe(200);
    expect(res.body.emoji).toBe("😄");
    expect(res.body.note).toBe("Buen día");
  });
});

describe("Logs", () => {
  test("GET /logs debe retornar array", async () => {
    const res = await request(app).get("/logs");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /logs/toggle debe marcar hábito como hecho", async () => {
    const res = await request(app).post("/logs/toggle").send({ habitId: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.done).toBeDefined();
  });
});

describe("Historial", () => {
  test("GET /history debe retornar 7 días", async () => {
    const res = await request(app).get("/history");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(7);
  });
});
