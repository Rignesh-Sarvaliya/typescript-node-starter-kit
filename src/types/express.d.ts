declare namespace Express {
  interface Request {
    user?: {
      id: number;
      role: "user" | "admin";
    };
  }

  interface Response {
    ok: <T>(data: T, message?: string) => this;
    unauthorized: (message?: string) => this;
    fail: (message?: string, errors?: any) => this;
  }
}
