## @ functionality:

-   Paste this into **tsconfig.app.json**:

```ts
...
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]
        },
    }
...
```

## Install libraries and modules:

-   Tanstack Query:

```bash
npm install @tanstack/react-query
```

-   Redux Toolkit:

```bash
npm install @reduxjs/toolkit react-redux
```
