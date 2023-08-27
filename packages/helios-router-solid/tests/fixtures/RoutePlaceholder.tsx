import { createSolidRoutePlaceholder } from '../../dist';
import { appStateStore } from './appStateStore';

export const RoutePlaceholder = createSolidRoutePlaceholder(appStateStore);
