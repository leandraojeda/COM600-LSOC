require('dotenv').config();
const amqp = require('amqplib');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE = process.env.QUEUE_NOMBRE || 'email_queue';
async function simulateEmailSending(user) {
console.log(`[Consumer] Enviando correo a: ${user.email}
(${user.nombre})...`);
await new Promise(r => setTimeout(r, 1500));
console.log(`[Consumer] Correo enviado a ${user.email}`);
}
async function startConsumer() {
const conn = await amqp.connect(RABBITMQ_URL);
const channel = await conn.createChannel();
await channel.assertQueue(QUEUE, { durable: true });
channel.prefetch(1);
console.log(`[Consumer] Esperando mensajes en la cola "${QUEUE}"...`);
channel.consume(QUEUE, async (msg) => {
if (msg === null) return;
try {
const content = JSON.parse(msg.content.toString());
console.log('[Consumer] Mensaje recibido:', content);
if (content.type === 'NEW_USER' && content.user) {
await simulateEmailSending(content.user);
channel.ack(msg);
} else {
console.warn('[Consumer] Tipo desconocido. Descartando.');
channel.ack(msg);
}
} catch (err) {
console.error('[Consumer] Error:', err.message);
channel.nack(msg, false, false);
}
}, { noAck: false });
}
startConsumer().catch(err => {
console.error('[Consumer] Error al iniciar:', err.message);
process.exit(1);
});