import fs from "fs";
// import path from "path";

// reads the data passed(name)
function readJSON(name, defaultValue = []) {
  const p = filePath(name);
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  const raw = fs.readFileSync(p, "utf8");
  try {
    return JSON.parse(raw || "[]");
  } catch (err) {
    fs.writeFileSync(p, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
}
// writes the given data
function writeJSON(name, data) {
  const p = filePath(name);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf8");
}
