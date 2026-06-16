import { createCorsair } from "corsair";
import { github } from "@corsair-dev/github";
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";
import { Pool } from "pg";

// Initialize the PostgreSQL connection pool for Corsair internal storage
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create and export the Corsair instance configured with Gmail, Google Calendar, and GitHub plugins
export const corsair = createCorsair({
  plugins: [
    github(),
    gmail(),
    googlecalendar(),
  ],
  database: pool,
  kek: process.env.CORSAIR_KEK!,
  multiTenancy: true,
});
