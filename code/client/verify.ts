import { ScriptureServerClient } from ".";



const client = new ScriptureServerClient("http://localhost:3000");

console.log(await client.health())


