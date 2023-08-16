//
//

const regex = /import \w+ from ['"].+\.svelte['"];?/g;

//
//

export function svelteComponentAnyDTS() {
  return {
    name: 'svelte-component-any-dts',
    /**
     * @param {string} code
     * @param {string} id
     */
    transform(code) {
      let hasSvelte = false;

      const outputCode = code.replace(regex, (match) => {
        hasSvelte = true;
        const split = match.split(' ');
        const componentName = split[1];

        return `declare class ${componentName} extends SvelteComponent {}`;
      });

      if (!hasSvelte) return code;

      return "import { SvelteComponent } from 'svelte';\n" + outputCode;
    },
  };
}
