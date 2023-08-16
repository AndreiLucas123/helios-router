import { pageMatched } from '../router';
import { pushRoute, replaceRoute } from '../pushRoute';

//
//

export function activeLink(node: HTMLElement) {
  if (!node.hasAttribute('href')) {
    throw new Error('activeLink must have an href attribute');
  }

  const unsub = pageMatched.subscribe((matched) => {
    if (matched) {
      if (matched === node.getAttribute('href')) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    }
  });

  //
  return {
    destroy: unsub,
  };
}

//
//

export function pushLink(node: HTMLElement) {
  if (!node.hasAttribute('href')) {
    throw new Error('pushLink must have an href attribute');
  }

  function listener(e: Event) {
    e.preventDefault();
    pushRoute(node.getAttribute('href')!);
  }

  node.addEventListener('click', listener);

  //
  return {
    destroy() {
      node.removeEventListener('click', listener);
    },
  };
}

//
//

export function replaceLink(node: HTMLElement) {
  if (!node.hasAttribute('href')) {
    throw new Error('replaceLink must have an href attribute');
  }

  function listener(e: Event) {
    e.preventDefault();
    replaceRoute(node.getAttribute('href')!);
  }

  node.addEventListener('click', listener);

  //
  return {
    destroy() {
      node.removeEventListener('click', listener);
    },
  };
}
