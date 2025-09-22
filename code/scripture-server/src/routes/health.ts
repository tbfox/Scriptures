import { dbManager } from "../database/connection";
import { jsonResponse } from "../utils/jsonResponse";

export async function health() {
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
