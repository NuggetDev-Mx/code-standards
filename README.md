# @nugget-dev/code-standards

Este paquete proporciona una configuración mínima de linting y styling de código, además de convenciones para commits con **Conventional Commits**, **Prettier**, **ESLint**, y **Husky**.

## 🚀 Instalación

Puedes instalar este paquete en tu proyecto con npm:
```sh
npm i -D @nugget-dev/code-standards
```

O ejecutarlo directamente con NPX:
```sh
npx @nd:scd
```
O bien:
```sh
npx @nugget-dev:setup-code-standards
```

## 🛠️ Desarrollo Local

Si deseas desarrollar o modificar este paquete localmente, sigue estos pasos:

1. **Clona el repositorio:**
    ```sh
    git clone <URL_DEL_REPO>
    cd code-standards
    ```
2. **Publica el paquete con `yalc`**:
    ```sh
    yalc publish
    ```
3. **En el repositorio donde deseas usarlo:**
    ```sh
    yalc add @nugget-dev/code-standards
    yalc link @nugget-dev/code-standards
    ```

## 📖 Detalles del Script

El script ejecutado por este paquete realiza los siguientes pasos:

1. **Configura Prettier**:
    - Agrega el archivo `.prettierrc` con las reglas del estándar.
    - Copia `.prettierignore` a la raíz del proyecto.

2. **Configura Commitlint**:
    - Copia `commitlint.config.cjs` para seguir el estándar de commits convencionales.
    - Instala `commitlint` y `husky`.

3. **Configura ESLint**:
    - Modifica `eslint.config.js` (o sus variantes `mjs`, `cjs`, `ts`, `mts`, `cts`) para agregar las reglas de linting del estándar.
    - Asegura que las reglas del paquete sean incluidas si no están presentes.

4. **Configura Husky**:
    - Inicializa Husky si no está presente.
    - Agrega hooks `pre-commit` y `commit-msg` con validaciones automáticas.

5. **Actualiza `.gitignore`**:
    - Asegura que `.idea/`, `.yalc/`, `public/`, `yalc.lock` y `package-lock.json` estén ignorados por Git.

## 🏗️ Contribuir
Si deseas contribuir, abre un issue o haz un pull request con mejoras y correcciones. ¡Tu ayuda es bienvenida! 🎉

