import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import authRoutes from './routes/auth.route.js';
import usuariosRoutes from './routes/Usuario.route.js';
import receitasRoutes from './routes/Receita.route.js';
import rotulosRoutes from './routes/Rotulo.route.js';
import ingredientesRoutes from './routes/Ingrediente.route.js';
import fichasTecnicasRoutes from './routes/Fichatecnica.route.js';
import fontesReferenciaRoutes from './routes/fonteReferencia.route.js';
import medidasCaseirasRoutes from './routes/medidaCaseira.route.js';
import microNutrientesRoutes from './routes/microNutriente.route.js';
import tabelasNutricionaisRoutes from './routes/tabelaNutricional.route.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: (origin, cb) => {
    if (
      !origin ||
      origin === "http://localhost:5173" ||
      origin === "http://localhost:3000"
    ) {
      cb(null, true);
      return;
    }
    cb(new Error("Not allowed"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

await app.register(fastifySwagger, {
  
  openapi: {
    info: {
      title: 'NutriStack API',
      description: 'API REST para gerenciamento de fichas técnicas nutricionais',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
});

await app.register(fastifySwaggerUi, { routePrefix: '/docs' });

app.register(authRoutes,                { prefix: '/auth' });
app.register(usuariosRoutes,            { prefix: '/usuarios' });
app.register(receitasRoutes,            { prefix: '/receitas' });
app.register(rotulosRoutes,             { prefix: '/rotulos' });
app.register(ingredientesRoutes,        { prefix: '/ingredientes' });
app.register(fichasTecnicasRoutes,      { prefix: '/fichas' });
app.register(fontesReferenciaRoutes,    { prefix: '/fontes' });
app.register(medidasCaseirasRoutes,     { prefix: '/medidas' });
app.register(microNutrientesRoutes,     { prefix: '/micronutrientes' });
app.register(tabelasNutricionaisRoutes, { prefix: '/tabelas' });

const PUBLIC_ROUTES = ['/auth/login', '/docs', '/docs/'];

app.addHook('onRequest', async (request, reply) => {
  if (!request.url) {
    reply.code(400).send({ error: 'Bad Request' });
    return;
  }
  const url = request.url.split('?')[0] ?? request.url;

  const isPublic =
    PUBLIC_ROUTES.includes(url) ||
    url.startsWith('/docs') ||
    (url === '/usuarios' && request.method === 'POST');

  if (isPublic) {
    return;
  }

  await authMiddleware(request, reply);
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();