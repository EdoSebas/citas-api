const json = (schema) => ({ 'application/json': { schema } });
const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const list = (name) => ({ type: 'array', items: ref(name) });
const res = (description, schema) => ({ description, ...(schema && { content: json(schema) }) });
const error = (description) => res(description, ref('Error'));
const body = (name) => ({ required: true, content: json(ref(name)) });
const idParam = { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } };
const STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'API de Citas Medicas',
    version: '1.0.0',
    description: 'Gestion de pacientes, medicos y citas medicas.',
  },
  tags: [{ name: 'Pacientes' }, { name: 'Medicos' }, { name: 'Citas' }, { name: 'Sistema' }],
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Datos invalidos' },
          details: { type: 'array', items: { type: 'object' } },
        },
      },
      PatientInput: {
        type: 'object',
        required: ['fullName', 'documentId', 'email', 'phone'],
        properties: {
          fullName: { type: 'string', example: 'Laura Gomez Rios' },
          documentId: { type: 'string', example: '1001234567' },
          email: { type: 'string', example: 'laura.gomez@mail.com' },
          phone: { type: 'string', example: '3001112233' },
        },
      },
      Patient: {
        allOf: [ref('PatientInput'), { type: 'object', properties: { id: { type: 'integer', example: 1 }, createdAt: { type: 'string', format: 'date-time' } } }],
      },
      DoctorInput: {
        type: 'object',
        required: ['fullName', 'specialty', 'email'],
        properties: {
          fullName: { type: 'string', example: 'Dr. Ricardo Herrera' },
          specialty: { type: 'string', example: 'Medicina General' },
          email: { type: 'string', example: 'ricardo.herrera@clinica.com' },
        },
      },
      Doctor: {
        allOf: [ref('DoctorInput'), { type: 'object', properties: { id: { type: 'integer', example: 1 }, createdAt: { type: 'string', format: 'date-time' } } }],
      },
      AppointmentInput: {
        type: 'object',
        required: ['patientId', 'doctorId', 'dateTime', 'reason'],
        properties: {
          patientId: { type: 'integer', example: 1 },
          doctorId: { type: 'integer', example: 1 },
          dateTime: { type: 'string', format: 'date-time', example: '2026-10-25T09:00:00Z' },
          reason: { type: 'string', example: 'Control general' },
        },
      },
      Appointment: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          patientId: { type: 'integer', example: 1 },
          doctorId: { type: 'integer', example: 1 },
          dateTime: { type: 'string', format: 'date-time' },
          reason: { type: 'string' },
          status: { type: 'string', enum: STATUSES },
          patient: ref('Patient'),
          doctor: ref('Doctor'),
        },
      },
      StatusInput: {
        type: 'object',
        required: ['status'],
        properties: { status: { type: 'string', enum: STATUSES, example: 'CONFIRMED' } },
      },
    },
  },
  paths: {
    '/health': {
      get: { tags: ['Sistema'], summary: 'Verificar que la API responde', responses: { 200: res('API activa') } },
    },
    '/patients': {
      get: { tags: ['Pacientes'], summary: 'Listar pacientes', responses: { 200: res('Lista de pacientes', list('Patient')) } },
      post: {
        tags: ['Pacientes'],
        summary: 'Registrar paciente',
        requestBody: body('PatientInput'),
        responses: { 201: res('Paciente creado', ref('Patient')), 400: error('Datos invalidos'), 409: error('Documento o correo ya registrado') },
      },
    },
    '/doctors': {
      get: { tags: ['Medicos'], summary: 'Listar medicos', responses: { 200: res('Lista de medicos', list('Doctor')) } },
      post: {
        tags: ['Medicos'],
        summary: 'Registrar medico',
        requestBody: body('DoctorInput'),
        responses: { 201: res('Medico creado', ref('Doctor')), 400: error('Datos invalidos'), 409: error('Correo ya registrado') },
      },
    },
    '/appointments': {
      get: {
        tags: ['Citas'],
        summary: 'Listar citas (con filtros opcionales)',
        parameters: [
          { name: 'date', in: 'query', schema: { type: 'string', example: '2026-10-25' }, description: 'Fecha en formato YYYY-MM-DD' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: STATUSES } },
          { name: 'patientId', in: 'query', schema: { type: 'integer' } },
          { name: 'doctorId', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { 200: res('Lista de citas', list('Appointment')), 400: error('Filtros invalidos') },
      },
      post: {
        tags: ['Citas'],
        summary: 'Programar cita',
        requestBody: body('AppointmentInput'),
        responses: {
          201: res('Cita creada', ref('Appointment')),
          400: error('Datos invalidos o fecha pasada'),
          404: error('Paciente o medico no existe'),
          409: error('El medico ya tiene una cita en ese horario'),
        },
      },
    },
    '/appointments/{id}': {
      get: {
        tags: ['Citas'],
        summary: 'Consultar una cita',
        parameters: [idParam],
        responses: { 200: res('Cita encontrada', ref('Appointment')), 400: error('id invalido'), 404: error('Cita no encontrada') },
      },
      delete: {
        tags: ['Citas'],
        summary: 'Cancelar cita (cancelacion logica, conserva el historial)',
        parameters: [idParam],
        responses: { 200: res('Cita cancelada', ref('Appointment')), 404: error('Cita no encontrada'), 409: error('La cita no se puede cancelar') },
      },
    },
    '/appointments/{id}/status': {
      patch: {
        tags: ['Citas'],
        summary: 'Actualizar el estado de una cita',
        parameters: [idParam],
        requestBody: body('StatusInput'),
        responses: { 200: res('Estado actualizado', ref('Appointment')), 400: error('Estado invalido'), 404: error('Cita no encontrada'), 409: error('Cambio de estado no permitido') },
      },
    },
  },
};
