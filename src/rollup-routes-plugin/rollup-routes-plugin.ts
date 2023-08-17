import type { Plugin } from 'rollup';
import { RoutesPluginOptions } from './types';
import routesWatcher from './routes-watcher';

//
//

export default function routesPlugin(options?: RoutesPluginOptions): Plugin {
  const watcher = routesWatcher(options);
  //
  //

  return {
    name: 'routes-plugin',

    //
    //

    buildStart() {
      console.log('routes-plugin: buildStart watch');
      watcher.start();
    },

    //
    //

    buildEnd() {
      console.log('routes-plugin: buildEnd watch.close');
      watcher.stop();
    },
  };
}
