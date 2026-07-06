//carrega variáveis arquivo .env
import "dotenv/config";
//carrega
import { defineConfig, env } from "prisma/config";
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Define a conexão do banco de dados de forma segura
    url: env("DATABASE_URL"),
  },
});