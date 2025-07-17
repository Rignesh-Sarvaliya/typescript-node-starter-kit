# Microservices Overview

The `services/` directory holds independent microservices. Each service is a standalone Node.js project with its own `package.json`, TypeScript config and build commands. Services can be developed and deployed separately from the main application.

```
services/
  └── user-service/
      ├── package.json
      ├── tsconfig.json
      └── src/
          └── index.ts
```

Additional services should follow the same structure. They can expose REST endpoints or communicate via messaging depending on your needs.
