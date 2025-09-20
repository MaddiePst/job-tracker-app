import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ALWAYS use the Data folder at project root
const dataDir = path.join(__dirname, "..", "Data");

// Read JSON file
export async function readJSON(filename) {
  const filePath = path.join(dataDir, filename);
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content || "[]");
  } catch (err) {
    if (err.code === "ENOENT") return []; // file doesn't exist yet
    throw err;
  }
}

// Write JSON file
export async function writeJSON(filename, data) {
  const filePath = path.join(dataDir, filename);
  const text = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, text, "utf8");
}
