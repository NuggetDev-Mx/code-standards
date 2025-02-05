#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = process.cwd();
const NODE_MODULES_DIR = path.join(ROOT_DIR, "node_modules", "@nugget-dev", "code-standards");
const YALC_DIR = path.join(ROOT_DIR, ".yalc", "@nugget-dev", "code-standards");

// Verificar si la dependencia está en .yalc o en node_modules
const DEPENDENCY_DIR = fs.existsSync(YALC_DIR) ? YALC_DIR : NODE_MODULES_DIR;

const FILES_TO_COPY = [
    { src: path.join(DEPENDENCY_DIR, "prettier-rules", ".prettierignore"), dest: ".prettierignore" },
    { src: path.join(DEPENDENCY_DIR, "commit-rules", "commitlint.config.cjs"), dest: "commitlint.config.cjs" },
    { src: path.join(DEPENDENCY_DIR, "editorconfig-rules", ".editorconfig"), dest: ".editorconfig" }
];

const SCRIPTS_TO_ADD = {
    "lint:fix": "eslint \"src/**/*.{js,ts,jsx,tsx}\" --fix",
    "format:write": "npx prettier --write \"src/**/*.{js,ts,jsx,tsx}\""
};

console.log("🔧 Setting up project with nugget-dev standards...\n");

// 1. Crear .prettierrc
console.log("📄 Adding .prettierrc...");
fs.writeFileSync(
    path.join(ROOT_DIR, ".prettierrc"),
    JSON.stringify("@nugget-dev/code-standards/prettier-rules/.prettierrc.json", null, 2)
);

// 2. Copiar archivos necesarios
FILES_TO_COPY.forEach(({ src, dest }) => {
    const destPath = path.join(ROOT_DIR, dest);
    console.log(`📂 Copying ${src} ➜ ${dest}...`);
    fs.copyFileSync(src, destPath);
});

// 3. Instalar dependencias
console.log("📦 Installing dependencies...");
execSync("npm install -D husky @commitlint/cli @commitlint/config-conventional", { stdio: "inherit" });

// 4. Inicializar Husky y configurar hooks
console.log("⚙️ Setting up Husky hooks...");
execSync("npx husky init", { stdio: "inherit" });
fs.writeFileSync(
    path.join(ROOT_DIR, ".husky/pre-commit"),
    "npm run lint:fix && npm run format:write && git add .\n"
);
fs.chmodSync(path.join(ROOT_DIR, ".husky/pre-commit"), "755");

fs.writeFileSync(
    path.join(ROOT_DIR, ".husky/commit-msg"),
    "npx --no -- commitlint --edit $1\n"
);
fs.chmodSync(path.join(ROOT_DIR, ".husky/commit-msg"), "755");

execSync("git add .husky/pre-commit .husky/commit-msg", { stdio: "inherit" });

// 5. Agregar scripts a package.json
console.log("📜 Adding scripts to package.json...");
const packageJsonPath = path.join(ROOT_DIR, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
packageJson.scripts = { ...packageJson.scripts, ...SCRIPTS_TO_ADD };
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// 6. Crear commitlint.config.js
console.log("📝 Creating commitlint.config.js...");
fs.writeFileSync(
    path.join(ROOT_DIR, "commitlint.config.js"),
    "module.exports = { extends: ['@commitlint/config-conventional'] }\n"
);

// 7. Agregar configuración de ESLint
console.log("🔍 Updating ESLint configuration...");
const eslintConfigExtensions = ["eslint.config.js", "eslint.config.mjs", "eslint.config.cjs", "eslint.config.ts", "eslint.config.mts", "eslint.config.cts"];
let eslintConfigPath = null;
for (const ext of eslintConfigExtensions) {
    const configPath = path.join(ROOT_DIR, ext);
    if (fs.existsSync(configPath)) {
        eslintConfigPath = configPath;
        break;
    }
}

if (fs.existsSync(eslintConfigPath)) {
    let eslintConfigImport = fs.readFileSync(eslintConfigPath, "utf-8");
    if (!eslintConfigImport.includes("import nuggetDev from '@nugget-dev/code-standards'")) {
        eslintConfigImport = `import nuggetDev from '@nugget-dev/code-standards';\n` + eslintConfigImport;
        fs.writeFileSync(eslintConfigPath, eslintConfigImport);
    }
    let eslintConfig = fs.readFileSync(eslintConfigPath, "utf-8");
    if (!eslintConfig.includes("nuggetDev.eslintConfig")) {
        eslintConfig = eslintConfig.replace(
            "const eslintConfig = [",
            "const eslintConfig = [\n    ...nuggetDev.eslintConfig,"
        );
        fs.writeFileSync(eslintConfigPath, eslintConfig);
        console.log("✅ ESLint configuration updated successfully!");
    } else {
        console.log("✅ ESLint configuration already contains nuggetDev standards.");
    }
} else {
    console.warn("⚠️ eslint.config.js not found. Please add the nuggetDev ESLint config manually.");
}

// 8. Modificar .gitignore
console.log("🛠️ Updating .gitignore...");
const gitignorePath = path.join(ROOT_DIR, ".gitignore");
const gitignoreEntries = [".idea/", ".yalc/", "public/", "yalc.lock", "package-lock.json"];

if (fs.existsSync(gitignorePath)) {
    let gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    let updated = false;

    gitignoreEntries.forEach(entry => {
        if (!gitignoreContent.includes(entry)) {
            gitignoreContent += `
${entry}\n`;
            updated = true;
        }
    });

    if (updated) {
        fs.writeFileSync(gitignorePath, gitignoreContent);
        console.log("✅ .gitignore updated successfully!");
    } else {
        console.log("✅ .gitignore already contains the required entries.");
    }
} else {
    console.warn("⚠️ .gitignore not found. Please add the following entries manually:");
    console.warn(gitignoreEntries.join(""));
}

console.log("✅ Setup complete! 🎉");
