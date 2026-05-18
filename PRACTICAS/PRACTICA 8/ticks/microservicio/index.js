'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// Microservicio TICKS — expone /metrics y envía métricas a Telegraf.
//
// Endpoints disponibles:
//   GET /personas   → devuelve lista de personas (incrementa requests_total)
//   GET /metrics    → expone métricas en formato InfluxDB line protocol
//   GET /error      → simula error (incrementa errorCount)
//
// Las métricas se envían a Telegraf vía HTTP POST cada 5 segundos
// y también están disponibles en GET /metrics para inspección manual.
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const http    = require('http');

const PORT           = parseInt(process.env.PORT           || '4000');
const TELEGRAF_HOST  = process.env.TELEGRAF_HOST           || 'localhost';
const TELEGRAF_PORT  = parseInt(process.env.TELEGRAF_PORT  || '8094');

const app = express();

// ── Datos de ejemplo ──────────────────────────────────────────────────────────
const personas = [
  { id: 1, nombre: 'Ana Gutierrez',  email: 'ana@usfx.edu.bo',    ciudad: 'Sucre'  },
  { id: 2, nombre: 'Carlos Mamani',  email: 'carlos@usfx.edu.bo', ciudad: 'Potosi' },
  { id: 3, nombre: 'Maria Flores',   email: 'maria@usfx.edu.bo',  ciudad: 'Sucre'  },
  { id: 4, nombre: 'Luis Quispe',    email: 'luis@usfx.edu.bo',   ciudad: 'Oruro'  },
  { id: 5, nombre: 'Sofia Choque',   email: 'sofia@usfx.edu.bo',  ciudad: 'Sucre'  },
];

// ── Contadores de métricas (en memoria) ──────────────────────────────────────
const metrics = {
  requests_total:   0,   // total de solicitudes recibidas
  errorCount:       0,   // total de errores generados
  avg_response_ms:  0,   // promedio de tiempo de respuesta (ms)
  _responseSum:     0,   // acumulador para calcular el promedio
  _responseCount:   0,   // cantidad de respuestas registradas
};

// ── Middleware: medir tiempo de respuesta ─────────────────────────────────────
app.use((req, _res, next) => {
  req._startTime = Date.now();
  next();
});

// ── Función: actualizar promedio de respuesta ─────────────────────────────────
function registrarRespuesta(durationMs) {
  metrics._responseSum   += durationMs;
  metrics._responseCount += 1;
  metrics.avg_response_ms = Math.round(metrics._responseSum / metrics._responseCount);
}

// ── Función: enviar métricas a Telegraf (InfluxDB line protocol) ──────────────
function enviarMetricasATelegraf() {
  // InfluxDB line protocol:
  //   measurement,tag1=val1 field1=val1,field2=val2 timestamp
  const lines = [
    `microservicio_metrics,service=microservicio-ticks requests_total=${metrics.requests_total}`,
    `microservicio_metrics,service=microservicio-ticks errorCount=${metrics.errorCount}`,
    `microservicio_metrics,service=microservicio-ticks avg_response_ms=${metrics.avg_response_ms}`,
  ].join('\n');

  const options = {
    hostname: TELEGRAF_HOST,
    port:     TELEGRAF_PORT,
    path:     '/metrics',
    method:   'POST',
    headers:  { 'Content-Type': 'text/plain', 'Content-Length': Buffer.byteLength(lines) },
  };

  const req = http.request(options, (res) => {
    if (res.statusCode !== 204 && res.statusCode !== 200) {
      console.warn(`[metrics] Telegraf respondió con status ${res.statusCode}`);
    }
  });

  req.on('error', (err) => {
    // No fatal: Telegraf puede estar iniciando
    console.warn(`[metrics] No se pudo enviar a Telegraf: ${err.message}`);
  });

  req.write(lines);
  req.end();
}

// Enviar métricas cada 5 segundos
setInterval(enviarMetricasATelegraf, 5000);

// ── Endpoints ─────────────────────────────────────────────────────────────────

// GET /personas — devuelve lista de personas
app.get('/personas', (req, res) => {
  metrics.requests_total++;
  const duration = Date.now() - req._startTime;
  registrarRespuesta(duration);

  console.log(`[${new Date().toISOString()}] GET /personas 200 (${duration}ms)`);
  res.json(personas);
});

// GET /metrics — exposición de métricas en InfluxDB line protocol
app.get('/metrics', (_req, res) => {
  const lines = [
    `# Métricas del microservicio-ticks`,
    `# Formato: nombre,tags campo=valor`,
    ``,
    `microservicio_metrics,service=microservicio-ticks requests_total=${metrics.requests_total}`,
    `microservicio_metrics,service=microservicio-ticks errorCount=${metrics.errorCount}`,
    `microservicio_metrics,service=microservicio-ticks avg_response_ms=${metrics.avg_response_ms}`,
  ].join('\n');

  res.setHeader('Content-Type', 'text/plain');
  res.send(lines);
});

// GET /error — simula un error (incrementa errorCount)
app.get('/error', (req, res) => {
  metrics.requests_total++;
  metrics.errorCount++;
  const duration = Date.now() - req._startTime;
  registrarRespuesta(duration);

  console.log(`[${new Date().toISOString()}] GET /error 500 — errorCount: ${metrics.errorCount}`);
  res.status(500).json({
    error:      'Error interno simulado',
    errorCount: metrics.errorCount,
    mensaje:    'Este endpoint simula un fallo para activar alertas en Kapacitor.',
  });
});

// GET /reset — reinicia los contadores (útil para reiniciar la demo)
app.get('/reset', (_req, res) => {
  metrics.requests_total  = 0;
  metrics.errorCount      = 0;
  metrics.avg_response_ms = 0;
  metrics._responseSum    = 0;
  metrics._responseCount  = 0;
  console.log(`[${new Date().toISOString()}] Métricas reiniciadas`);
  res.json({ ok: true, mensaje: 'Métricas reiniciadas a cero' });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  metrics.requests_total++;
  res.status(404).json({ error: 'Ruta no encontrada', path: req.path });
});

// ── Inicio ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[microservicio-ticks] Escuchando en http://localhost:${PORT}`);
  console.log(`[microservicio-ticks] Métricas → http://localhost:${PORT}/metrics`);
  console.log(`[microservicio-ticks] Enviando a Telegraf → ${TELEGRAF_HOST}:${TELEGRAF_PORT}`);
});
