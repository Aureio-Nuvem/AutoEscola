# Baliza

App de estudo para a prova teórica do Detran. Sessões curtas, hábito diário,
repetição espaçada nos erros. Um usuário, sem contas e sem servidor.

> **Em construção.** Por enquanto o repositório tem só o pipeline de conteúdo.
> O app ainda não foi montado.

## Princípio da arquitetura

Conteúdo é **dado**, nunca código. Tudo vive em `src/content/`, tipado. Somar
matéria é editar dado — nenhum componente conhece pergunta nenhuma.

Toda pergunta cita a origem (documento + página), para conferência contra o
material.

## Fontes

Os PDFs em `fontes/` são a única fonte de verdade do conteúdo.

| Arquivo | O que traz |
| --- | --- |
| `mosaico-placas-sinalizacao.pdf` | 146 placas do Manual Brasileiro de Sinalização de Trânsito |
| `banco-nacional-questoes.pdf` | 1.492 questões do Banco Nacional de Questões (SENATRAN) |

O currículo vem do próprio material: **quatro módulos**, não as cinco matérias
clássicas.

| Módulo | Questões |
| --- | ---: |
| 1 — Placas, Cores e Caminhos | 412 |
| 2 — Escolhas e Consequências | 204 |
| 3 — Na Direção da Segurança | 616 |
| 4 — Cuidar, Agir e Preservar | 260 |

## Pipeline

```bash
python3 tools/extrair-placas.py    # requer pdfplumber, pypdfium2, pillow
python3 tools/extrair-questoes.py  # requer pdfplumber; usa a saída do anterior
```

`extrair-placas.py` lê o mosaico e gera:

- `public/placas/<CODIGO>.webp` — 146 imagens (~1,2 MB no total, cabem no
  precache offline da PWA)
- `src/content/placas.gerado.json` — código, nome, categoria e origem

`extrair-questoes.py` lê o banco de questões e gera
`src/content/questoes.gerado.json` — enunciado, quatro alternativas,
explicação, módulo, dificuldade, placa citada e página de origem.

Ambos abortam ao encontrar qualquer coisa fora do formato esperado (contagem
de imagens que não bate, questão sem explicação, número de distratores
diferente de 3), para um PDF diferente não passar despercebido.

As alternativas são embaralhadas com semente derivada do id da questão: a
ordem é estável entre execuções e a resposta certa não cai sempre na mesma
posição.
