import { router } from '../router';

export function NavComponent() {
  function onClick(e: Event) {
    e.preventDefault();

    router.appStateStore.produce((appState) => {
      appState.appLinkClicks++;
    });
    
    router.push((e.target as HTMLAnchorElement).getAttribute('href')!);
  }

  return (
    <nav class='NavComponent__box'>
      <a href='/' onclick={onClick}>
        Home
      </a>
      <a href='/about' onclick={onClick}>
        About
      </a>
      <a href='/create-on-effect-test' onclick={onClick}>
        CreateOnEffectTest
      </a>
      <a href='/client/1' onclick={onClick}>
        Client 1
      </a>
      <a href='/client/2' onclick={onClick}>
        Client 2
      </a>
      <a href='/client/3?search=randomstuff' onclick={onClick}>
        Client 3
      </a>
    </nav>
  );
}
