import { dbManager } from "./src/database/connection.ts";
import { fetch } from "./src/fetch.ts"
import { parseArgs } from "util";
import { jsonResponse } from "./src/utils/jsonResponse.ts";
import { help } from "./docs/help.ts";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    port: {
      type: 'string'
    },
  },
  strict: true,
  allowPositionals: true,
});

const PORT = values.port || 3000 

Bun.serve({
    port: PORT,
    routes: {
        '/': () => new Response(help),
        '/health': () => {
            if (dbManager.isHealthy()){
                return jsonResponse({
                    status: "healthy", 
                    timestamp: new Date().toISOString(),
                });
            }
            return jsonResponse({
                status: "unhealthy",
                timestamp: new Date().toISOString(),
            });
        }
    },
    fetch,
});

console.log(`Server listening on PORT: ${PORT}`)
