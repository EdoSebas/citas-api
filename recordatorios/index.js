const API_URL = process.env.API_URL || 'http://backend:3000';
const INTERVALO_MS = Number(process.env.INTERVALO_SEGUNDOS || 30) * 1000;
const VENTANA_MS = Number(process.env.VENTANA_HORAS || 24) * 60 * 60 * 1000;
const avisadas = new Set();

async function revisar() {
  try {
    const respuesta = await fetch(`${API_URL}/appointments`);
    const citas = await respuesta.json();
    const ahora = Date.now();

    for (const c of citas) {
      const hora = new Date(c.dateTime).getTime();
      const activa = c.status === 'PENDING' || c.status === 'CONFIRMED';
      if (activa && hora > ahora && hora <= ahora + VENTANA_MS && !avisadas.has(c.id)) {
        avisadas.add(c.id);
        const fecha = new Date(c.dateTime).toLocaleString('es-CO', { timeZone: 'America/Bogota' });
        console.log(`[RECORDATORIO] ${c.patient.fullName}: cita con ${c.doctor.fullName} (${c.doctor.specialty}) el ${fecha}. Motivo: ${c.reason}`);
      }
    }
  } catch (error) {
    console.log('No se pudo consultar la API:', error.message);
  }
}

console.log('Servicio de recordatorios iniciado');
revisar();
setInterval(revisar, INTERVALO_MS);
