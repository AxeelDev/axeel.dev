import { mkdir, writeFile } from "node:fs/promises";
import * as icons from "simple-icons";

const directory = new URL("../public/icons/", import.meta.url);
await mkdir(directory, { recursive: true });
const catalogue = Object.values(icons)
  .filter((icon) => icon && typeof icon === "object" && "slug" in icon && "svg" in icon)
  .sort((a, b) => a.title.localeCompare(b.title));
// Keep the entire catalogue out of the application/Worker JavaScript bundle.
for (let i = 0; i < catalogue.length; i += 64) {
  await Promise.all(catalogue.slice(i, i + 64).map((icon) =>
    writeFile(new URL(`${icon.slug}.svg`, directory), icon.svg.replace("<svg ", `<svg fill="#${icon.hex}" `))
  ));
}
await writeFile(new URL("catalogue.json", directory), JSON.stringify(catalogue.map(({ title, slug }) => ({ title, slug }))));
console.log(`Prepared ${catalogue.length} local tool icons.`);
