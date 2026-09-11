import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = here;
const output = path.join(here, "taskmanager.zip");

try {
  await import("archiver");
} catch {
  execSync("npm install --no-save archiver", { cwd: root, stdio: "inherit" });
}

const { default: archiver } = await import("archiver");
const stream = fs.createWriteStream(output);
const archive = archiver("zip", { zlib: { level: 9 } });

await new Promise((resolve, reject) => {
  stream.on("close", resolve);
  archive.on("error", reject);
  archive.pipe(stream);
  archive.glob("**/*", {
    cwd: root,
    dot: true,
    ignore: ["node_modules/**", "dist/**", ".git/**", "taskmanager.zip"]
  });
  archive.finalize();
});

console.log(`Created ${output}`);
