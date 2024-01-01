export const unAuthorizedRoutes = ["/", "/login", "/register"];

export const isInUnauthorizedRoute = (currentRoutePath) => {
  return unAuthorizedRoutes.some((route) => route === currentRoutePath);
};
