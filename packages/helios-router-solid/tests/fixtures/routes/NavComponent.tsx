export function NavComponent() {
  return (
    <nav class='NavComponent__box'>
      <a href='/'>Home</a>
      <a href='/about'>About</a>
      <a href='/client/1'>Client 1</a>
      <a href='/client/2'>Client 2</a>
      <a href='/client/3?search=randomstuff'>Client 3</a>
    </nav>
  );
}
