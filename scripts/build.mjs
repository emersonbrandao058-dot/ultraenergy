import { cp, mkdir, readFile, writeFile } from "node:fs/promises";

await mkdir("dist", { recursive: true });
await cp("src", "dist", { recursive: true, force: true });

const OLD_WHATSAPP_NUMBER = "5575999312633";
const NEW_WHATSAPP_NUMBER = "557532211753";
const filesToUpdate = ["dist/index.html", "dist/assets/site.js"];

for (const file of filesToUpdate) {
  const content = await readFile(file, "utf8");
  await writeFile(file, content.replaceAll(OLD_WHATSAPP_NUMBER, NEW_WHATSAPP_NUMBER));
}

console.log("Site gerado em dist/ com o WhatsApp atualizado.");