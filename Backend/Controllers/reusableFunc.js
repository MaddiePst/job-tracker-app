import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// The absolute path to the current file
const __filename = fileURLToPath(import.meta.url);
// The absolute path to the current directory
const __dirname = path.dirname(__filename);

//use the Data folder at project root
const dataDir = path.join(__dirname, "..", "Data");

// Read JSON file
export async function readJSON(filename) {
  // Connect path (data w/ current file )
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
  // Connect path (data w/ current file )
  const filePath = path.join(dataDir, filename);
  const text = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, text, "utf8");
}
