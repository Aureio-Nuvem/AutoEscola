# Baliza

App de estudo para a prova teórica de habilitação. Sessões curtas, hábito
diário e repetição espaçada nos erros. Um usuário, sem contas e sem servidor.

O nome vem da manobra que todo mundo teme e que se vence na repetição — e a cor
é o laranja da sinalização temporária, que no trânsito quer dizer "algo está
acontecendo aqui". É o estado de quem está aprendendo.

## Como rodar

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # valida o conteúdo, checa tipos e compila
npm run preview   # confere o build no navegador
```

Publicação: veja [DEPLOY.md](DEPLOY.md).

## Princípio da arquitetura

**Conteúdo é dado, nunca código.** Tudo vive em `src/content/`, tipado em
`schema.ts` e gerado dos PDFs por scripts. Nenhum componente conhece pergunta,
placa ou matéria: somar conteúdo é editar dado.

Toda questão carrega o documento e a página de onde saiu, e o app mostra isso
junto da explicação — dá para conferir contra o PDF original em segundos.

## O material

Os PDFs em `fontes/` são a única fonte de verdade.

| Arquivo | O que traz |
| --- | --- |
| `banco-nacional-questoes.pdf` | 1.492 questões (SENATRAN / Ministério dos Transportes), 313 páginas |
| `mosaico-placas-sinalizacao.pdf` | 146 placas do Manual Brasileiro de Sinalização de Trânsito |

O currículo vem do próprio material: são **quatro módulos**, não as cinco
matérias clássicas do Detran. É o programa federal "CNH do Brasil".

| Módulo | Treino | Reservadas |
| --- | ---: | ---: |
| 1 — Placas, Cores e Caminhos | 371 | 41 |
| 2 — Escolhas e Consequências | 170 | 34 |
| 3 — Na Direção da Segurança | 569 | 47 |
| 4 — Cuidar, Agir e Preservar | 224 | 36 |

A parte 2 do banco ("Teste seus conhecimentos") fica **reservada só para o
simulado** e nunca aparece no treino — assim o simulado mede conhecimento, e
não memória de questão já vista.

## O que o app faz

- **Sessão do dia** — 12 questões (ajustável), metade delas revisões vencidas
- **Meus erros** — repetição espaçada em caixas de Leitner: errou volta no mesmo
  dia, depois em 1, 3, 7, 16 e 35 dias. Três acertos espaçados = dominada
- **Blocos por matéria** — cada módulo dividido em blocos de ~20 questões, com
  progresso próprio e a faixa de páginas do material que cobre
- **Simulado** — cronometrado, sem gabarito durante a prova, com revisão no fim
- **Cartões de estudo** — resumos do material didático, interrompíveis
- **Placas** — as 146 placas navegáveis, mais treino com as questões reais do
  banco que mostram placa
- **Contagem regressiva** — aparece só depois que você informa a data da prova

Toda sessão é interrompível: sair no meio e voltar depois não perde nada.

## Pipeline de conteúdo

```bash
python3 tools/extrair-placas.py    # requer pdfplumber, pypdfium2, pillow
python3 tools/extrair-questoes.py  # requer pdfplumber; usa a saída do anterior
```

Geram `src/content/*.gerado.json` e as 146 imagens em `public/placas/`
(~1,2 MB, cabem no precache offline). Ambos abortam ao encontrar qualquer coisa
fora do formato esperado, para um PDF diferente não passar despercebido.

## Validador

`npm run validar` roda sozinho antes de todo build e reprova:

- questão sem matéria, sem explicação ou sem citação de origem
- citação apontando para página que não existe no PDF
- alternativa duplicada, ou distrator que entrega a resposta
- placa citada sem imagem no disco
- cartão sem texto ou sem citação
- bloco que perde ou repete questão

O que ele **não** faz é julgar se a resposta é factualmente correta — nenhum
script determinístico faz isso. O que dá para garantir é rastreabilidade, e
isso ele garante.

### Um aviso que ele imprime a cada build

No material, **a resposta certa é a alternativa mais longa em 80% das
questões** (+25 caracteres em média). Isso vem da fonte e não dá para corrigir
sem reescrever conteúdo.

Fica registrado aqui porque importa para quem estuda: dá para acertar muita
coisa pelo tamanho da alternativa e achar que aprendeu. Na prova real, esse
atalho pode não existir.
