import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dataDir = path.dirname(__filename);

// Read JSON file
export async function readJSON(filename) {
  const filePath = path.join(dataDir, filename);
  console.log("readJSON filePath:", filePath);
  try {
    const content = await fs.readFile(filePath, "utf8"); // await needed
    return JSON.parse(content || "[]"); // parse JSON or return empty array
  } catch (err) {
    if (err.code === "ENOENT") return []; // file doesn't exist
    throw err;
  }
}

// Write JSON file
export async function writeJSON(filename, data) {
  const filePath = path.join(dataDir, filename);
  const text = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, text, "utf8"); // await to finish writing
}
