# Práctica N° 2 — Monitoreo de Microservicios

**Asignatura:** Arquitectura de Microservicios  
**Carrera:** Ingeniería en Ciencia de la Computación — USFX

Este repositorio contiene el código base para la Práctica N° 2. Incluye dos entornos de monitoreo independientes:

| Carpeta | Stack | Descripción |
|---|---|---|
| `elk/` | ELK Stack | Gestión de logs con Elasticsearch, Logstash y Kibana |
| `ticks/` | TICKS Stack | Métricas y alertas con Telegraf, InfluxDB, Chronograf y Kapacitor |

## Requisitos previos

- Docker Desktop >= 24
- Docker Compose >= 2
- curl (para pruebas)

## Uso rápido

```bash
# Parte I — ELK
cd elk
docker-compose up --build

# Parte II — TICKS (en otra terminal, después de detener ELK)
cd ../ticks
docker-compose up --build
```

> **Importante:** No levantes ambos stacks al mismo tiempo. Ejecuta uno, realiza la práctica, detenlo con `docker-compose down`, luego levanta el otro.

## Estructura del repositorio

```
practica-02/
├── README.md
├── elk/
│   ├── docker-compose.yml
│   ├── logstash/
│   │   └── pipeline/
│   │       └── logstash.conf      ← pipeline de procesamiento de logs
│   └── microservicio/
│       ├── Dockerfile
│       ├── package.json
│       └── index.js               ← API REST que genera logs JSON
└── ticks/
    ├── docker-compose.yml
    ├── telegraf.conf               ← configuración del recolector de métricas
    ├── kapacitor.tick              ← regla de alerta para errorCount
    └── microservicio/
        ├── Dockerfile
        ├── package.json
        └── index.js               ← API REST que expone /metrics
```
