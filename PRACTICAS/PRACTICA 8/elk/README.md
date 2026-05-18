# ELK Stack — Gestión de Logs

## Levantar el entorno

```bash
docker-compose up --build
```

## Verificar servicios

| URL | Descripción |
|---|---|
| http://localhost:3000/personas | Lista de personas (log INFO) |
| http://localhost:3000/health | Health check |
| http://localhost:3000/error | Simula error (log ERROR) |
| http://localhost:5601 | Kibana |
| http://localhost:9200 | Elasticsearch API |

## Generar logs

```bash
# Logs INFO
curl http://localhost:3000/personas

# Log ERROR
curl http://localhost:3000/error
```

## Configurar Kibana (primera vez)

1. Abre http://localhost:5601
2. Analytics → Discover
3. Crear Index Pattern: `microservicio-*`
4. Campo de tiempo: `@timestamp`

## Detener

```bash
docker-compose down
```

## Estructura

```
elk/
├── docker-compose.yml
├── logstash/
│   └── pipeline/
│       └── logstash.conf   ← pipeline UDP → Elasticsearch
└── microservicio/
    ├── Dockerfile
    ├── package.json
    └── index.js            ← API REST con logger UDP a Logstash
```
