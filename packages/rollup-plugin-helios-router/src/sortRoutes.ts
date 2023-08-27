import { FileWatched } from './routes-watcher';

//
//

export function sortRoutes(filesWatched: FileWatched[]) {
  let aSegments: string[];
  let bSegments: string[];

  return filesWatched.sort((a, b) => {
    aSegments = a.segments;
    bSegments = b.segments;

    for (let i = 0; i < aSegments.length; i++) {
      if (aSegments[i] === undefined) return -1;
      if (bSegments[i] === undefined) return 1;

      if (aSegments[i] === bSegments[i]) continue;
      if (aSegments[i].startsWith('*') && !bSegments[i].startsWith('*'))
        return 1;
      if (
        aSegments[i].startsWith(':') &&
        !bSegments[i].startsWith('*') &&
        !bSegments[i].startsWith(':')
      )
        return 1;
      if (bSegments[i].startsWith('*') && !aSegments[i].startsWith('*'))
        return -1;

      if (aSegments[i] > bSegments[i]) return -1;
      if (aSegments[i] < bSegments[i]) return 1;
    }

    const aRoute = a.route;
    const bRoute = b.route;
    if (aRoute === '/') return -1;
    if (bRoute === '/') return 1;
    if (aRoute < bRoute) return 1;
    if (aRoute > bRoute) return -1;
    return 0;
  });
}
