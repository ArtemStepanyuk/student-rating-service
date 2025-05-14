export const routes = [];

export function addRoute(pattern, handler) {
  routes.push({ pattern, handler });
}

export function router() {
  const hash = location.hash || '#home';
  for (const { pattern, handler } of routes) {
    const match = hash.match(pattern);
    if (match) {
      handler(...match.slice(1));
      return;
    }
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
