export const unAutherizedRoutes = ["/", "/login", "/register"];

export const isInUnautherizedRoute = (currentRoutePath) => {
  return unAutherizedRoutes.some((route) => route === currentRoutePath);
};
