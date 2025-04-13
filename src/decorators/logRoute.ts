export const logRoute = (routeName: string) => {
  return function (req: any, res: any, next: () => void) {
    console.log(`[${routeName}] Hit at: ${new Date().toISOString()}`);
    next();
  };
};
