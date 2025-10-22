// src/vercel-build-node-bun.ts
import { $ } from "bun";
import { promises as fs } from "node:fs";
import path from "node:path";

const outDir = ".vercel";
const funcDir = path.join(outDir, "functions", "index.func");
const staticDir = path.join(outDir, "static");
const entryJs = path.join(funcDir, "index.js");
const entryTs = "src/server.ts";

async function main() {
  console.log("🏗️  Starting custom Vercel Bun build...");

  // Pastikan entry file ada
  try {
    await fs.access(entryTs);
    console.log(`✅ Found entry file: ${entryTs}`);
  } catch {
    console.error(`❌ Entry file not found: ${entryTs}`);
    console.log(`Cek apakah file ${entryTs} ada dan tidak diabaikan .gitignore`);
    process.exit(1);
  }

  // Bersihkan output lama
  await fs.rm(outDir, { recursive: true, force: true });

  // Buat ulang folder fungsi & statik
  await fs.mkdir(funcDir, { recursive: true });
  await fs.mkdir(staticDir, { recursive: true });

  // Bundle dengan Bun ke format Node.js ESM
  console.log("📦 Bundling entrypoint using Bun...");
  await $`bun build ${entryTs} --target=node --format=esm --minify --outfile ${entryJs}`;

  // Tambahkan konfigurasi agar runtime Node di Vercel mengenali ESM
  await fs.writeFile(
    path.join(funcDir, "package.json"),
    JSON.stringify({ type: "module" }, null, 2)
  );

  // Vercel Function config
  const vcConfig = {
    runtime: "nodejs22.x",
    handler: "index.js",
    launcherType: "Nodejs",
    shouldAddHelpers: true,
  };
  await fs.writeFile(
    path.join(funcDir, ".vc-config.json"),
    JSON.stringify(vcConfig, null, 2)
  );

  // Routing config
  const routesConfig = {
    version: 3,
    routes: [{ handle: "filesystem" }, { src: "/(.*)", dest: "/index" }],
  };
  await fs.writeFile(
    path.join(outDir, "config.json"),
    JSON.stringify(routesConfig, null, 2)
  );

  console.log("✅ Build ready! Output available in .vercel/output");
}

main().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
