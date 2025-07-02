declare namespace Express {
  interface Request {
    user?: {
      id: number;
      role: "user" | "admin";
    };
  }
}

export {};
