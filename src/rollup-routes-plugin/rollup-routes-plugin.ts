import type { Plugin, PluginContext } from 'rollup';
import { RoutesPluginOptions } from './types';
import routesWatcher from './routes-watcher';
import { LoggerRoutes } from './logger';

//
//

export function routesPlugin(options?: RoutesPluginOptions): Plugin {
  let pluginContext: PluginContext | null = null;

  let logger: LoggerRoutes = {
    info: (message: string) => pluginContext?.info(message),
    warn: (message: string) => pluginContext?.warn(message),
    error: (message: string) => pluginContext?.error(message),
  };

  const watcher = routesWatcher(options, logger);
  //
  //

  return {
    name: 'routes-plugin',

    //
    //

    buildStart() {
      pluginContext = this;
      pluginContext.info('buildStart watch.start()');
      watcher.start();
    },

    //
    //

    buildEnd() {
      pluginContext = null;
      this.info('buildEnd watch.close()');
      watcher.stop();
    },
  };
}
