import { appFrameConfigBase } from '../../components/app-frame-base';
import HomeContent from './HomeContent.svelte';
import { SolidChild } from './SolidChild';

export default {
  ...appFrameConfigBase,
  content: HomeContent,
  child: SolidChild,
};
