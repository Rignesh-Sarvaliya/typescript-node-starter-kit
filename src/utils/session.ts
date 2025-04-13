export const generateSession = async (req: any, userId: number, role: "user" | "admin") => {
  req.session.user = {
    id: userId,
    role,
  };
};

export const destroySession = (req: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err: any) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
