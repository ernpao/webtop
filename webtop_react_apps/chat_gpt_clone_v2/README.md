# React HeroUI Template

A modern React template using Vite, TypeScript, and [HeroUI](https://www.heroui.com/docs/guide/installation), designed for fast development with a clean setup and sensible defaults.

## 🔧 Tech Stack

- **Vite** for lightning-fast dev and build
- **TypeScript**
- **HeroUI** for base components
- **Material UI** for layout
- **@emotion/react** for styled components
- **ESLint** for linting
- **Toolpad Core** (experimental low-code tool framework)
- **Zustand** for state management

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm start
```

- Runs the app on http://localhost:3000

- Automatically opens your default browser

### 3. Run Linter

```bash
npm run lint
```

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 🎨 Compiling SASS/Adding CSS Styles

This template is setup to use the [Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=glenn2223.live-sass) plugin for VS Code to compile .scss files.

### Live Sass Compiler Settings (use in VS Code settings.json)

```json
{
    "liveSassCompile.settings.formats": [
        {
            "format": "compressed",
            "extensionName": ".min.css",
            "savePath": "/src/css",
        }
    ],
    "liveSassCompile.settings.forceBaseDirectory": "/src/components",
    "liveSassCompile.settings.watchOnLaunch": true
}
```

The **/src/components/styles.scss** file contains @use statements for all .scss partial files for the project like below:

```scss
@use './typography/_TextHero';
@use './_Card';
```

You can manually add @use statements as needed, or run **generate-main-scss.js** to generate styles.scss automatically. You can do this using the command below:

```bash
npm run styles-scss
```

### 

## 🧩 Dependencies

- @heroui/react, @mui/material – UI framework

- zustand - State management

- eslint, @vitejs/plugin-react, typescript-eslint, and more – Dev tools

## 📜 License

This project is licensed for private/internal use. Modify as needed.