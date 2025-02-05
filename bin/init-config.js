const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT_DIR = process.cwd();
const NODE_MODULES_DIR = path.join(ROOT_DIR, "node_modules", "@nugget-dev", "code-standards");

const FILES_TO_COPY = [
    { src: path.join(NODE_MODULES_DIR, "prettier-rules", ".prettierignore"), dest: ".prettierignore" },
    { src: path.join(NODE_MODULES_DIR, "commit-rules", "commitlint.config.cjs"), dest: "commitlint.config.cjs" },
    { src: path.join(NODE_MODULES_DIR, "editorconfig-rules", ".editorconfig"), dest: ".editorconfig" }
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

// 5. Agregar bin a package.json
console.log("📜 Adding bin to package.json...");
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

console.log("✅ Setup complete! 🎉");
