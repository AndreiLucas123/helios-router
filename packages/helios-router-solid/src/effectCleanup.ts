export function effectCleanup() {
  let lastCleanup: () => void;

  return (cleanup: () => void) => {
    if (lastCleanup) lastCleanup();
    cleanup();
  };
}
