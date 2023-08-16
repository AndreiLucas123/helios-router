import { pageProps, type RouteConfig, loader } from '../../../../../dist';
import { appFrameConfigBase } from '../../../components/app-frame-base';
import Client from './Client.svelte';
import ClientChild from './ClientChild.svelte';

//
//

export const clientLoader = loader([], async ([]) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return 'It worked';
});
//
//

export const clientChildLoader = loader([pageProps], async ([pageProps]) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return 'It worked and I am a child, ' + pageProps.id;
});

clientLoader.nsSubscribe((value) => {
  console.log('[clientLoader]', value);
});

clientChildLoader.nsSubscribe((value) => {
  console.log('[clientChildLoader]', value);
});

//
//

export default {
  ...appFrameConfigBase,
  content: Client,
  clientChild: ClientChild,
} satisfies RouteConfig;
