'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// Microservicio ELK — genera logs JSON estructurados y los envía a Logstash.
//
// Endpoints disponibles:
//   GET /personas   → devuelve lista de personas (log INFO)
//   GET /health     → health check (log INFO)
//   GET /error      → simula un error interno (log ERROR)
// ─────────────────────────────────────────────────────────────────────────────

const express  = require('express');
const dgram    = require('dgram');          // UDP nativo de Node.js

const PORT           = process.env.PORT           || 3000;
const LOGSTASH_HOST  = process.env.LOGSTASH_HOST  || 'localhost';
const LOGSTASH_PORT  = parseInt(process.env.LOGSTASH_PORT || '5000');

const app    = express();
const udpClient = dgram.createSocket('udp4');

// ── Datos de ejemplo ──────────────────────────────────────────────────────────
const personas = [
  { id: 1, nombre: 'Ana Gutierrez',   email: 'ana@usfx.edu.bo',    ciudad: 'Sucre'  },
  { id: 2, nombre: 'Carlos Mamani',   email: 'carlos@usfx.edu.bo', ciudad: 'Potosi' },
  { id: 3, nombre: 'Maria Flores',    email: 'maria@usfx.edu.bo',  ciudad: 'Sucre'  },
  { id: 4, nombre: 'Luis Quispe',     email: 'luis@usfx.edu.bo',   ciudad: 'Oruro'  },
  { id: 5, nombre: 'Sofia Choque',    email: 'sofia@usfx.edu.bo',  ciudad: 'Sucre'  },
];

// ── Logger: envía JSON por UDP a Logstash ─────────────────────────────────────
function log(level, message, extra = {}) {
  const entry = {
    timestamp:  new Date().toISOString(),
    level,
    message,
    service:    'microservicio-elk',
    ...extra,
  };

  const payload = Buffer.from(JSON.stringify(entry));

  udpClient.send(payload, LOGSTASH_PORT, LOGSTASH_HOST, (err) => {
    if (err) {
      // fallback a consola si Logstash no está disponible
      console.error('[logger] Error enviando a Logstash:', err.message);
    }
  });

  // Siempre imprimir en consola también (visible en docker logs)
  console.log(JSON.stringify(entry));
}

// ── Middleware: log de cada request ──────────────────────────────────────────
app.use((req, _res, next) => {
  req._startTime = Date.now();
  next();
});

// ── Endpoints ─────────────────────────────────────────────────────────────────

// GET /personas — devuelve la lista de personas
app.get('/personas', (req, res) => {
  const duration = Date.now() - req._startTime;

  log('INFO', 'Solicitud a /personas procesada correctamente', {
    route:      '/personas',
    method:     'GET',
    statusCode: 200,
    duration_ms: duration,
  });

  res.json(personas);
});

// GET /health — health check del microservicio
app.get('/health', (req, res) => {
  log('INFO', 'Health check OK', {
    route:      '/health',
    method:     'GET',
    statusCode: 200,
  });

  res.json({ status: 'ok', service: 'microservicio-elk', uptime: process.uptime() });
});

// GET /error — simula un error interno (para generar logs ERROR)
app.get('/error', (req, res) => {
  const duration = Date.now() - req._startTime;

  log('ERROR', 'Error interno simulado en /error', {
    route:       '/error',
    method:      'GET',
    statusCode:  500,
    duration_ms: duration,
    errorDetail: 'Excepción simulada para propósitos de laboratorio',
  });

  res.status(500).json({ error: 'Error interno simulado', statusCode: 500 });
});

// ── 404 para rutas no definidas ───────────────────────────────────────────────
app.use((req, res) => {
  log('WARN', `Ruta no encontrada: ${req.path}`, {
    route:      req.path,
    method:     req.method,
    statusCode: 404,
  });
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ── Inicio del servidor ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[microservicio-elk] Escuchando en http://localhost:${PORT}`);
  console.log(`[microservicio-elk] Logs → ${LOGSTASH_HOST}:${LOGSTASH_PORT} (UDP)`);

  log('INFO', 'Microservicio ELK iniciado', {
    route:   '/',
    port:    PORT,
    logstash: `${LOGSTASH_HOST}:${LOGSTASH_PORT}`,
  });
});
