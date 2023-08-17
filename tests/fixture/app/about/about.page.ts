import { pageProps, loader } from '../../../../dist';
import { appFrameConfigBase } from '../../components/app-frame-base';
import About from './About.svelte';

//
//

export const aboutLoader = loader([pageProps], async ([{ error }]) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (error) {
    throw new Error('Error in about');
  }
});

export default {
  ...appFrameConfigBase,
  content: About,
};
