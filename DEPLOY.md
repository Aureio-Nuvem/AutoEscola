# Publicar o Baliza

O app não tem servidor: são só arquivos estáticos. A publicação usa
**Cloudflare Workers Static Assets** (não é o Pages).

## Antes de tudo

Confira que o build passa:

```bash
npm install
npm run build
```

O `build` roda o validador de conteúdo antes de compilar. Se alguma questão
estiver sem explicação, sem citação de origem ou com alternativa duplicada, ele
para aí e diz qual é.

Para conferir o resultado no navegador antes de publicar:

```bash
npm run preview
```

## Conectar ao Cloudflare (uma vez só)

Você faz isso pelo painel, sem terminal.

1. Entre em **dash.cloudflare.com**
2. No menu da esquerda, clique em **Workers & Pages**
3. Clique em **Create** (botão azul, no topo direito)
4. Escolha a aba **Workers** e clique em **Import a repository**
   (se pedir para conectar o GitHub, autorize o acesso ao repositório
   `Aureio-Nuvem/AutoEscola`)
5. Selecione o repositório **AutoEscola**
6. Na tela de configuração, preencha:

   | Campo | O que colocar |
   | --- | --- |
   | Project name | `baliza` |
   | Production branch | a branch que você quer publicar |
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |
   | Path / Root directory | deixe em branco |

7. Clique em **Create and deploy**

A primeira publicação leva uns 2 minutos. No fim, o painel mostra o endereço,
algo como `https://baliza.<seu-usuario>.workers.dev`.

**A partir daí, todo push na branch publica sozinho.** Você não precisa mexer
em mais nada.

## Instalar no celular

1. Abra o endereço no navegador do celular
2. **Android (Chrome):** menu ⋮ → *Adicionar à tela inicial*
   **iPhone (Safari):** botão de compartilhar → *Adicionar à Tela de Início*
3. O ícone do cone laranja aparece junto com os outros apps

Depois de instalado, funciona **sem internet** — as 1.492 questões e as 146
placas ficam guardadas no aparelho.

## Onde fica o seu progresso

No próprio celular, no armazenamento do navegador. Não existe conta, servidor
nem sincronização: ninguém além de você tem acesso, e o progresso não passa de
um aparelho para outro.

Duas consequências práticas:

- Apagar os dados do site (ou desinstalar o app) **apaga o progresso**
- Estudar no computador e no celular gera dois progressos separados

## Detalhes de configuração

O `wrangler.jsonc` já está pronto. Três decisões nele que costumam dar dor de
cabeça se mudarem:

- **Não existe `main`.** Como não há backend, o deploy é só de assets. Definir
  `main` faria o Cloudflare esperar um Worker que não existe.
- **`not_found_handling: "single-page-application"`.** Sem isso, abrir o app
  direto numa rota interna daria 404.
- **Não existe `public/_redirects`.** Com Static Assets esse arquivo provoca o
  erro *"Infinite loop detected"*.

O `.node-version` fixa o Node 22, que é o que o build usa.

## Se algo der errado

**O build falha no Cloudflare mas funciona aqui**
Confira se o Node do painel é o 22. O `.node-version` deve resolver sozinho.

**O app abre em branco**
Quase sempre é cache do service worker. No celular, feche o app, limpe os dados
do site e abra de novo.

**Publiquei mas continuo vendo a versão antiga**
A PWA atualiza sozinha na segunda abertura depois do deploy. Para forçar,
feche todas as abas do app e abra de novo.
