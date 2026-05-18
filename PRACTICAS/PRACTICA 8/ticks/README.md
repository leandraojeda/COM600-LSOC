# TICKS Stack — Métricas y Alertas

## Levantar el entorno

```bash
docker-compose up --build
```

## Verificar servicios

| URL | Descripción |
|---|---|
| http://localhost:4000/personas | Lista de personas |
| http://localhost:4000/metrics | Métricas en texto plano |
| http://localhost:4000/error | Simula error (incrementa errorCount) |
| http://localhost:4000/reset | Reinicia contadores a cero |
| http://localhost:8888 | Chronograf |
| http://localhost:8086 | InfluxDB API |

## Generar tráfico y disparar la alerta

```bash
# Solicitudes normales
curl http://localhost:4000/personas

# Generar 4+ errores para activar la alerta de Kapacitor
curl http://localhost:4000/error
curl http://localhost:4000/error
curl http://localhost:4000/error
curl http://localhost:4000/error
```

Espera 15-20 segundos y revisa: Chronograf → Alerts → Alert History

## Métricas disponibles

| Métrica | Descripción |
|---|---|
| `requests_total` | Total de solicitudes recibidas |
| `errorCount` | Total de errores generados |
| `avg_response_ms` | Promedio de tiempo de respuesta en ms |

## Detener

```bash
# Solo detener contenedores
docker-compose down

# Detener y eliminar volúmenes (borra datos de InfluxDB)
docker-compose down -v
```

## Estructura

```
ticks/
├── docker-compose.yml
├── telegraf.conf       ← recolector: HTTP listener → InfluxDB
├── kapacitor.tick      ← regla de alerta: errorCount > 3
└── microservicio/
    ├── Dockerfile
    ├── package.json
    └── index.js        ← API REST con métricas y envío a Telegraf
```
