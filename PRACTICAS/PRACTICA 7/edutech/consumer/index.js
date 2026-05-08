require('dotenv').config();
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE = process.env.QUEUE_NOMBRE || 'edutech_queue';

async function startConsumer() {
    try {
        const conn = await amqp.connect(RABBITMQ_URL);
        const channel = await conn.createChannel();
        await channel.assertQueue(QUEUE, { durable: true });

        // RESTRICCIÓN: Consumo manual y prefetch(1)
        channel.prefetch(1);

        console.log(`[Consumer] Escuchando en la cola: ${QUEUE}`);

        channel.consume(QUEUE, async (msg) => {
            if (!msg) return;

            const content = JSON.parse(msg.content.toString());
            const { type, student } = content;

            // REQUERIMIENTO 3: Mensajes de consola diferentes (Pista 2)
            switch (type) {
                case 'NEW_STUDENT':
                    console.log(`[Consumer] BIENVENIDA: Enviando correo a ${student.email} por inscripción al curso ${student.curso}`);
                    break;
                case 'WAITLIST':
                    console.log(`[Consumer] LISTA DE ESPERA: El curso ${student.curso} está lleno. Notificando a ${student.email}`);
                    break;
                default:
                    console.log(`[Consumer] Tipo desconocido: ${type}`);
            }

            // Confirmación manual
            channel.ack(msg);
        }, { noAck: false });

    } catch (error) {
        console.error("[Consumer] Error:", error.message);
    }
}

startConsumer();