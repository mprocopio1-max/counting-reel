import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const backendDir = path.join(rootDir, "backend");
const frontendDir = path.join(rootDir, "frontend");

const ensureEnvFile = (projectDir) => {
  const envPath = path.join(projectDir, ".env");
  const envExamplePath = path.join(projectDir, ".env.example");

  if (fs.existsSync(envPath)) {
    return;
  }

  if (!fs.existsSync(envExamplePath)) {
    throw new Error(`Missing .env.example in ${projectDir}`);
  }

  fs.copyFileSync(envExamplePath, envPath);
  console.log(`[setup] Created ${path.relative(rootDir, envPath)} from .env.example`);
};

const warnAboutBackendConfig = () => {
  const envPath = path.join(backendDir, ".env");
  const envContent = fs.readFileSync(envPath, "utf-8");

  if (/^SAMPLE_VIDEO_PATH\s*=\s*$/m.test(envContent)) {
    console.warn(
      "[warning] backend/.env has empty SAMPLE_VIDEO_PATH. " +
        "Set it to a local .mp4 path when using REEL_ADAPTER=mock."
    );
  }
};

const runCommand = (name, cwd, command, args, colorCode) => {
  const child = spawn(command, args, {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    shell: true
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`\x1b[${colorCode}m[${name}]\x1b[0m ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`\x1b[${colorCode}m[${name}]\x1b[0m ${chunk}`);
  });

  return child;
};

ensureEnvFile(backendDir);
ensureEnvFile(frontendDir);
warnAboutBackendConfig();

console.log("[start] Starting backend and frontend in parallel...");

const backend = runCommand("backend", backendDir, "npm", ["run", "dev"], "36");
const frontend = runCommand("frontend", frontendDir, "npm", ["run", "dev"], "35");

let shuttingDown = false;

const shutdown = (signal) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`\n[stop] Received ${signal}. Stopping processes...`);

  backend.kill("SIGINT");
  frontend.kill("SIGINT");

  setTimeout(() => process.exit(0), 300);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

backend.on("exit", (code) => {
  if (!shuttingDown && code !== 0) {
    console.error(`[backend] exited with code ${code}`);
    shutdown("backend-exit");
  }
});

frontend.on("exit", (code) => {
  if (!shuttingDown && code !== 0) {
    console.error(`[frontend] exited with code ${code}`);
    shutdown("frontend-exit");
  }
});
