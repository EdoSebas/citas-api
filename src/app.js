const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./docs/openapi');
const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.redirect('/docs'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.use(routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
