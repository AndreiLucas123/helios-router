import { LoggerRoutes } from './logger';
import { FileWatched } from './routes-watcher';

//
//

export function detectConflicts(
  filesWatched: FileWatched[],
  logger: LoggerRoutes,
) {
  function segmentsSemanticallyEqual(
    aSegments: string[],
    bSegments: string[],
  ): boolean {
    if (aSegments.length !== bSegments.length) return false;

    for (let i = 0; i < aSegments.length; i++) {
      if (aSegments[i] === undefined && bSegments[i] !== undefined)
        return false;
      if (aSegments[i] !== undefined && bSegments[i] === undefined)
        return false;

      if (aSegments[i] === bSegments[i]) continue;

      if (aSegments[i].startsWith('*') && !bSegments[i].startsWith('*'))
        return false;
      if (!aSegments[i].startsWith('*') && bSegments[i].startsWith('*'))
        return false;

      if (aSegments[i].startsWith(':') && bSegments[i].startsWith(':'))
        continue;
      if (aSegments[i].startsWith(':') && !bSegments[i].startsWith(':'))
        return false;
      if (!aSegments[i].startsWith(':') && bSegments[i].startsWith(':'))
        return false;

      if (aSegments[i] !== bSegments[i]) return false;
    }

    return true;
  }

  for (let i = 0; i < filesWatched.length; i++) {
    for (let j = i + 1; j < filesWatched.length; j++) {
      if (
        segmentsSemanticallyEqual(
          filesWatched[i].segments,
          filesWatched[j].segments,
        )
      ) {
        logger.warn(
          `Conflict detected between '${filesWatched[i].path}' and '${filesWatched[j].path}'`,
        );
      }
    }
  }
}
