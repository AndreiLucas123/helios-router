# helios-router

Router simples com `state management`

O router precisa de um arquivo de rotas que pode ser gerado manualmente ou automaticamente

## `__DEV__` e `__SERVER__`

Como no `schemas-lib` as variáveis `__DEV__` e `__SERVER__` devem estar declaradas antes de iniciar esse pacote e os pacotes relacionados

## Criando o `router`

Exemplo de criação sem o arquivo `routes.ts`

```ts
import { createHeliosRouter } from 'helios-router';
import { appStateStore } from './appStateStore';

export const router = createHeliosRouter({
  appStateStore,
  routes: {
    '/': () => import('./routes/home'),
    '/home': () => import('./routes/home'),
    '/about': () => import('./routes/about'),
    '/client/:id': () => import('./routes/client'),
    '/*': () => import('./routes/not-found'),
  },
});
```

Normalmente o `appStateStore` deve estar em um outro arquivo

## O arquivo `appStateStore.ts`

Normalmente será criado a tipagem separada do `createAppState` para que ela possa ser reutilizada na aplicação

```ts
import { RouterAppState, createAppState } from 'helios-router';

export interface AppStateStore extends RouterAppState {
  appLinkClicks: number;
}

export const appStateStore = createAppState<AppStateStore>({
  router: {},
  appLinkClicks: 0,
});
```

## Gerando o arquivo `routes.ts` automaticamente

Você provavelmente usará o `rollup-plugin-helios-router` para gerar automaticamente o arquivo de rotas

O `rollup-plugin-helios-router` não precisa do `rollup` para funcionar, ele pode ser chamado com `routesWatcher` diretamente

Exemplo de geração sem o `rollup`:

```ts
import { routesWatcher } from 'rollup-plugin-helios-router';

if (__DEV__) {
  routesWatcher({ baseUrl: '/app' }).start();
}
```
