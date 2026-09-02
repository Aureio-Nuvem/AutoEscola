#!/usr/bin/env python3
"""
Extrai as placas do "Mosaico de Placas de Sinalização" (Manual Brasileiro de
Sinalização de Trânsito) para dados tipados + imagens WebP.

Entrada : fontes/mosaico-placas-sinalizacao.pdf
Saída   : public/placas/<CODIGO>.webp   — uma imagem por placa
          src/content/placas.gerado.json — código, nome, categoria e origem

O PDF é uma tabela regular: cada célula tem a imagem da placa, o código em
negrito logo abaixo e o nome em seguida. O pareamento imagem→código é
geométrico (mesma coluna, imagem imediatamente acima do código), e o script
falha se a contagem de imagens não bater com a de códigos — assim um PDF
diferente do esperado não passa silenciosamente.

Uso: python3 tools/extrair-placas.py
Requer: pdfplumber, pypdfium2, pillow
"""

from __future__ import annotations

import json
import os
import re
import sys
import unicodedata

import pdfplumber
import pypdfium2 as pdfium
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(RAIZ, "fontes", "mosaico-placas-sinalizacao.pdf")
DIR_IMG = os.path.join(RAIZ, "public", "placas")
SAIDA = os.path.join(RAIZ, "src", "content", "placas.gerado.json")

DOC = "Mosaico de Placas de Sinalização (Manual Brasileiro de Sinalização de Trânsito)"

# Códigos do manual: R-1, R-4a (regulamentação), A-1a (advertência),
# SAU-06/THC-05/DEF-01 (pictogramas de indicação).
CODIGO = re.compile(r"^(R-\d+[a-z]?|A-\d+[a-z]?|[A-Z]{3}-\d+)$")

# Cada página do mosaico corresponde a um volume do manual.
CATEGORIA_POR_PAGINA = {
    1: ("regulamentacao", "Placas de regulamentação"),
    2: ("advertencia", "Placas de advertência"),
    3: ("advertencia", "Placas de advertência"),
    4: ("indicacao", "Placas de indicação (pictogramas)"),
}

ESCALA = 6.0  # renderização; ~350px por placa antes do downscale
LADO = 256  # lado máximo da imagem final
QUALIDADE = 88


def limpar(texto: str) -> str:
    return re.sub(r"\s+", " ", texto).strip()


def sem_acento(texto: str) -> str:
    return unicodedata.normalize("NFD", texto.lower()).encode("ascii", "ignore").decode()


def extrair() -> tuple[list[dict], int]:
    if not os.path.exists(PDF):
        sys.exit(f"PDF não encontrado: {PDF}")

    os.makedirs(DIR_IMG, exist_ok=True)
    doc = pdfium.PdfDocument(PDF)
    placas: list[dict] = []
    total_paginas = 0

    with pdfplumber.open(PDF) as pdf:
        total_paginas = len(pdf.pages)
        for indice, pagina in enumerate(pdf.pages):
            numero = indice + 1
            if numero not in CATEGORIA_POR_PAGINA:
                sys.exit(f"Página {numero} inesperada — o PDF mudou de formato.")
            slug, rotulo = CATEGORIA_POR_PAGINA[numero]

            render = doc[indice].render(scale=ESCALA).to_pil()
            palavras = pagina.extract_words(extra_attrs=["fontname", "size"])
            bordas = sorted({round(b["top"], 1) for b in pagina.edges if b["orientation"] == "h"})

            codigos = sorted(
                (p for p in palavras if CODIGO.match(p["text"]) and "Bold" in p["fontname"]),
                key=lambda p: (round(p["top"]), p["x0"]),
            )
            if len(codigos) != len(pagina.images):
                sys.exit(
                    f"Página {numero}: {len(codigos)} códigos para "
                    f"{len(pagina.images)} imagens — pareamento não é confiável."
                )

            for codigo in codigos:
                centro = (codigo["x0"] + codigo["x1"]) / 2

                # A imagem da placa é a que está na mesma coluna e termina logo
                # acima do código.
                acima = [
                    img
                    for img in pagina.images
                    if abs((img["x0"] + img["x1"]) / 2 - centro) < 25
                    and img["bottom"] <= codigo["top"] + 2
                    and codigo["top"] - img["bottom"] < 40
                ]
                if not acima:
                    sys.exit(f"Sem imagem para a placa {codigo['text']} (página {numero}).")
                img = min(acima, key=lambda i: codigo["top"] - i["bottom"])

                celula = sorted(
                    (
                        p
                        for p in palavras
                        if abs((p["x0"] + p["x1"]) / 2 - centro) < 33
                        and codigo["bottom"] - 1 < p["top"] < codigo["bottom"] + 60
                    ),
                    key=lambda p: (round(p["top"], 1), p["x0"]),
                )

                # Só a página de indicação traz descrição, separada do nome por
                # uma borda da tabela. Nas demais, tudo é o nome (quebrado em
                # várias linhas).
                if slug == "indicacao":
                    seguintes = [b for b in bordas if b > codigo["bottom"] + 1.5]
                    corte = seguintes[0] if seguintes else float("inf")
                    nome = limpar(" ".join(p["text"] for p in celula if p["top"] < corte - 0.5))
                    descricao = limpar(
                        " ".join(p["text"] for p in celula if p["top"] >= corte - 0.5)
                    )
                else:
                    nome = limpar(" ".join(p["text"] for p in celula))
                    descricao = ""

                if not nome:
                    sys.exit(f"Placa {codigo['text']} ficou sem nome (página {numero}).")

                arquivo = f"{codigo['text']}.webp"
                recorte = render.crop(
                    (
                        round(img["x0"] * ESCALA),
                        round(img["top"] * ESCALA),
                        round(img["x1"] * ESCALA),
                        round(img["bottom"] * ESCALA),
                    )
                ).convert("RGB")
                recorte.thumbnail((LADO, LADO), Image.LANCZOS)
                recorte.save(os.path.join(DIR_IMG, arquivo), "WEBP", quality=QUALIDADE, method=6)

                placas.append(
                    {
                        "codigo": codigo["text"],
                        "nome": nome,
                        "descricao": descricao,
                        "categoria": slug,
                        "categoriaRotulo": rotulo,
                        "imagem": f"/placas/{arquivo}",
                        "origem": {"documento": DOC, "pagina": numero},
                    }
                )

    return placas, total_paginas


def main() -> None:
    placas, paginas = extrair()

    # Ordena por categoria e depois pelo número do código (R-4a antes de R-10).
    ordem = {"regulamentacao": 0, "advertencia": 1, "indicacao": 2}

    def chave(p: dict):
        prefixo, resto = p["codigo"].split("-", 1)
        numero = int(re.match(r"\d+", resto).group())
        return (ordem[p["categoria"]], prefixo, numero, resto)

    placas.sort(key=chave)

    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    manifesto = {
        "documento": DOC,
        "arquivo": os.path.relpath(PDF, RAIZ),
        "paginas": paginas,
        "itens": placas,
    }
    with open(SAIDA, "w", encoding="utf-8") as arquivo:
        json.dump(manifesto, arquivo, ensure_ascii=False, indent=1)
        arquivo.write("\n")

    por_categoria: dict[str, int] = {}
    for placa in placas:
        por_categoria[placa["categoria"]] = por_categoria.get(placa["categoria"], 0) + 1

    print(f"{len(placas)} placas extraídas de {PDF}")
    for slug, total in por_categoria.items():
        print(f"  {slug}: {total}")
    print(f"imagens -> {DIR_IMG}")
    print(f"dados   -> {SAIDA}")


if __name__ == "__main__":
    main()
