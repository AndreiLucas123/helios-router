import { pageProps, setRoutes, routeAppFrameConfig } from '../../dist';
import AppRoot from './app/AppRoot.svelte';
import routes from './routes';

//
//

pageProps.subscribe((props) => {
  console.log('pageProps', props);
});

routeAppFrameConfig.subscribe((config) => {
  console.log('routeAppFrameConfig changed to new config:', config);
});

setRoutes(routes);

new AppRoot({
  target: document.getElementById('app')!,
});
