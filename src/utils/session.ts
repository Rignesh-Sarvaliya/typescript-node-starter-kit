export const generateSession = async (req: any, userId: number, role: "user" | "admin") => {
  req.session.user = {
    id: userId,
    role,
  };
};

export const destroySession = (req: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!req.session || typeof req.session.destroy !== "function") {
      // No active session to destroy
      return resolve();
    }

    req.session.destroy((err: any) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
