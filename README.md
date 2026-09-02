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

## Pipeline

```bash
python3 tools/extrair-placas.py   # requer pdfplumber, pypdfium2, pillow
```

Lê o PDF do mosaico e gera:

- `public/placas/<CODIGO>.webp` — 146 imagens (~1,2 MB no total, cabem no
  precache offline da PWA)
- `src/content/placas.gerado.json` — código, nome, categoria e origem

O script aborta se a contagem de imagens não bater com a de códigos, para que
um PDF diferente do esperado não passe despercebido.
