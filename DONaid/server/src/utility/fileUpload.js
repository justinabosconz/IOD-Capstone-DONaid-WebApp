const fs = require("fs");
const path = require("path");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function saveDataUrlImage(dataUrl, uploadRoot) {
  if (!dataUrl) return null;

  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match)
    throw new Error("Invalid image format. Please upload a valid image.");

  const mime = match[1]; // image/png
  const base64 = match[2];
  const ext = mime.split("/")[1]; // png, jpeg, etc.

  const fileName = `item_${Date.now()}_${Math.random().toString(16).slice(2)}.${ext}`;
  ensureDir(uploadRoot);

  const filePath = path.join(uploadRoot, fileName);
  fs.writeFileSync(filePath, Buffer.from(base64, "base64"));

  return fileName; // storing only filename; serve via /uploads route
}

module.exports = { saveDataUrlImage };
