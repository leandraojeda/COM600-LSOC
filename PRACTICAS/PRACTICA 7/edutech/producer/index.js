require('dotenv').config();
const express = require('express');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const QUEUE = process.env.QUEUE_NOMBRE || 'edutech_queue';
const students = []; // REQUERIMIENTO 4: Arreglo en memoria

let channel;

async function connectRabbit() {
    try {
        const conn = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await conn.createChannel();
        await channel.assertQueue(QUEUE, { durable: true }); // Restricción: Cola durable
        console.log(`[Producer] Conectado a RabbitMQ | Cola: ${QUEUE}`);
    } catch (error) {
        console.error("[Producer] Error RabbitMQ:", error.message);
    }
}

app.post('/register', async (req, res) => {
    const { nombre, email, celular, curso } = req.body;

    // REQUERIMIENTO 1: Validación de campos con mensaje personalizado
    if (!nombre || !email || !celular || !curso) {
        return res.status(400).json({ 
            "400 error": "Faltan campos" 
        });
    }

    const student = { 
        id: Date.now(), 
        nombre, 
        email, 
        celular, 
        curso,
        createdAt: new Date().toISOString() 
    };
    students.push(student);

    // REQUERIMIENTO 2: Lógica de eventos (Pista 1)
    let type = curso.toLowerCase().includes('lleno') ? 'WAITLIST' : 'NEW_STUDENT';

    const payload = { type, student };
    
    // Publicación con persistencia
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(payload)), { persistent: true });

    console.log(`[Producer] Evento ${type} publicado`);
    res.status(201).json({ ok: true, type, student });
});

// REQUERIMIENTO 4: Endpoint GET /students
app.get('/students', (req, res) => {
    res.json(students);
});

connectRabbit().then(() => {
    app.listen(PORT, () => console.log(`[Producer] API en http://localhost:${PORT}`));
});