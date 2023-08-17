import { AppFrameSolid } from '../../../../dist/solid';
import { render } from 'solid-js/web';

//
//

export function renderSolid(solidDiv: HTMLDivElement) {
  console.log('rendering in solid');
  render(() => <AppFrameSolid id='child' />, solidDiv);
}

//
//

export function SolidChild() {
  return <div>I am solid child!</div>;
}
