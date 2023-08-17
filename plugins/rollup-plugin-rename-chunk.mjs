/**
 * Cria um plugin Rollup que renomeia um chunk após a build.
 *
 * @param {Object} options - Opções de configuração do plugin.
 * @param {string} options.oldName - O nome antigo do chunk a ser renomeado.
 * @param {string} options.newName - O novo nome para o chunk renomeado.
 * @returns {Object} Um objeto de plugin Rollup.
 *
 * @example
 * import renameChunkPlugin from './path/to/rename-chunk-plugin';
 *
 * export default {
 *   // ... outras configurações ...
 *   plugins: [
 *     // ... outros plugins ...
 *     renameChunkPlugin({
 *       oldName: 'nome_do_chunk_antigo',
 *       newName: 'nome_do_chunk_novo',
 *     }),
 *   ],
 * };
 */
export default function renameChunkPlugin(options = {}) {
  return {
    /**
     * Função chamada após a geração dos bundles.
     *
     * @param {Object} _ - Informações do bundle.
     * @param {Object} bundle - Um objeto contendo informações sobre os chunks gerados.
     */
    generateBundle(_, bundle) {
      const { oldName, newName } = options;
      if (oldName && newName) {
        if (bundle[oldName]) {
          bundle[newName] = bundle[oldName];
          delete bundle[oldName];
          bundle[newName].fileName = newName;
        }
      }
    },
  };
}
