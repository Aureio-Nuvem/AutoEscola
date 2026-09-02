#!/usr/bin/env python3
"""
Extrai o Banco Nacional de Questões (SENATRAN) para dados tipados.

Entrada : fontes/banco-nacional-questoes.pdf
Saída   : src/content/questoes.gerado.json

O PDF tem formato regular. Cada questão é:

    l (Fácil) 12. <enunciado, podendo quebrar linhas>
    Código da placa: A-33a               <- opcional
    Alternativa correta: <texto> 3       <- "3" é o glifo ✓ na fonte Wingdings
    Comentário: <explicação>
    Respostas incorretas:
    7 <distrator>                        <- "7" é o glifo ✗
    7 <distrator>
    7 <distrator>

As alternativas são embaralhadas de forma determinística (semente derivada do
id), para a resposta certa não cair sempre na mesma posição e o resultado ser
idêntico a cada execução.

O script aborta se qualquer questão sair sem enunciado, sem resposta, sem
explicação ou sem exatamente 3 distratores — um PDF fora do formato não passa
em silêncio.

Uso: python3 tools/extrair-questoes.py
Requer: pdfplumber
"""

from __future__ import annotations

import hashlib
import json
import os
import random
import re
import sys
import unicodedata

import pdfplumber

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(RAIZ, "fontes", "banco-nacional-questoes.pdf")
PLACAS = os.path.join(RAIZ, "src", "content", "placas.gerado.json")
SAIDA = os.path.join(RAIZ, "src", "content", "questoes.gerado.json")

DOC = "Banco Nacional de Questões v1.0 (SENATRAN / Ministério dos Transportes)"
CABECALHO = "CNH do Brasil - Ministério dos Transportes - Secretaria Nacional de Trânsito"

INICIO = re.compile(r'^l \((Fácil|Intermediário|Difícil)\) (\d+)\. ', re.M)
SECAO = re.compile(r'^(PARTE\s+(\d+)[^\n]*|MÓDULO\s+(\d+)[^\n]*)$', re.M)

DIFICULDADE = {"Fácil": "facil", "Intermediário": "media", "Difícil": "dificil"}

# Os títulos vêm do próprio documento; o app não inventa divisão de matéria.
MODULOS = {
    1: "Placas, Cores e Caminhos",
    2: "Escolhas e Consequências",
    3: "Na Direção da Segurança",
    4: "Cuidar, Agir e Preservar",
}


def limpar(texto: str) -> str:
    return re.sub(r'\s+', ' ', texto).strip()


def chave(texto: str) -> str:
    """Forma normalizada para comparar textos (acento, caixa e pontuação fora)."""
    sem = unicodedata.normalize("NFD", texto.lower()).encode("ascii", "ignore").decode()
    return re.sub(r'[^a-z0-9 ]', '', sem).strip()


def paginas_do_pdf() -> list[str]:
    if not os.path.exists(PDF):
        sys.exit(f"PDF não encontrado: {PDF}")
    with pdfplumber.open(PDF) as pdf:
        return [pagina.extract_text() or "" for pagina in pdf.pages]


def montar_texto(paginas: list[str]) -> tuple[str, list[tuple[int, int]]]:
    """Junta as páginas sem o cabeçalho, guardando onde cada uma começa."""
    pedacos, mapa, posicao = [], [], 0
    for numero, bruto in enumerate(paginas, 1):
        limpo = "\n".join(l for l in bruto.split("\n") if l.strip() != CABECALHO)
        pedacos.append(limpo)
        mapa.append((posicao, numero))
        posicao += len(limpo) + 1
    return "\n".join(pedacos), mapa


def pagina_em(offset: int, mapa: list[tuple[int, int]]) -> int:
    atual = 1
    for inicio, numero in mapa:
        if inicio > offset:
            break
        atual = numero
    return atual


def marcos_de_secao(texto: str) -> list[tuple[int, int, int]]:
    marcos, parte, modulo = [], None, None
    for m in SECAO.finditer(texto):
        if m.group(2):
            parte, modulo = int(m.group(2)), None
        else:
            modulo = int(m.group(3))
        marcos.append((m.start(), parte, modulo))
    return marcos


def secao_em(offset: int, marcos) -> tuple[int | None, int | None]:
    parte = modulo = None
    for inicio, p, mo in marcos:
        if inicio > offset:
            break
        parte, modulo = p, mo
    return parte, modulo


def trecho(inicio_re: str, fim_re: str, onde: str) -> str | None:
    """Texto entre dois marcadores, já normalizado."""
    abre = re.search(inicio_re, onde, re.M)
    if not abre:
        return None
    fecha = re.search(fim_re, onde[abre.end():], re.M)
    bruto = onde[abre.end(): abre.end() + fecha.start()] if fecha else onde[abre.end():]
    return limpar(bruto)


def extrair() -> tuple[list[dict], list[str], int]:
    paginas = paginas_do_pdf()
    texto, mapa = montar_texto(paginas)
    marcos = marcos_de_secao(texto)
    inicios = list(INICIO.finditer(texto))
    if not inicios:
        sys.exit("Nenhuma questão encontrada — o PDF mudou de formato.")

    codigos_de_placa = {p["codigo"] for p in json.load(open(PLACAS, encoding="utf-8"))["itens"]}
    questoes: list[dict] = []
    avisos: list[str] = []
    vistas: dict[tuple[str, str], str] = {}

    for i, m in enumerate(inicios):
        fim = inicios[i + 1].start() if i + 1 < len(inicios) else len(texto)
        corpo = texto[m.end(): fim]
        parte, modulo = secao_em(m.start(), marcos)
        pagina = pagina_em(m.start(), mapa)
        onde = f"parte {parte}, módulo {modulo}, questão {m.group(2)} (p. {pagina})"

        if parte is None or modulo not in MODULOS:
            sys.exit(f"Questão fora de qualquer módulo conhecido: {onde}")

        enunciado = trecho(r'\A', r'^(Código da placa:|Alternativa correta:)', corpo)
        correta = trecho(r'^Alternativa correta:', r'^(Comentário:|Respostas incorretas:)', corpo)
        explicacao = trecho(r'^Comentário:', r'^Respostas incorretas:', corpo)
        if correta:
            correta = re.sub(r'\s*3\s*$', '', correta).strip()

        erradas = []
        marca = re.search(r'^Respostas incorretas:\s*$', corpo, re.M)
        if marca:
            erradas = [limpar(p) for p in re.split(r'^7 ', corpo[marca.end():], flags=re.M)[1:]]

        if not enunciado:
            sys.exit(f"Questão sem enunciado: {onde}")
        if not correta:
            sys.exit(f"Questão sem resposta correta: {onde}")
        if not explicacao:
            sys.exit(f"Questão sem explicação: {onde}")
        if len(erradas) != 3:
            sys.exit(f"Questão com {len(erradas)} distratores (esperado 3): {onde}")

        identidade = (chave(enunciado), chave(correta))
        if identidade in vistas:
            avisos.append(f"duplicata de {vistas[identidade]} descartada: {onde}")
            continue

        placa = None
        achou = re.search(r'^Código da placa:\s*(\S+)\s*$', corpo, re.M)
        if achou:
            codigo = achou.group(1)
            if codigo in codigos_de_placa:
                placa = codigo
            else:
                avisos.append(f"código de placa '{codigo}' não existe no mosaico: {onde}")

        ident = f"p{parte}m{modulo}q{int(m.group(2)):03d}"
        vistas[identidade] = ident

        # Embaralha de forma estável: a mesma questão cai sempre na mesma ordem.
        semente = int(hashlib.sha256(ident.encode()).hexdigest()[:8], 16)
        alternativas = [correta] + erradas
        random.Random(semente).shuffle(alternativas)

        questoes.append({
            "id": ident,
            "modulo": modulo,
            "parte": parte,
            "dificuldade": DIFICULDADE[m.group(1)],
            "enunciado": enunciado,
            "alternativas": alternativas,
            "correta": alternativas.index(correta),
            "explicacao": explicacao,
            "placa": placa,
            "origem": {"documento": DOC, "pagina": pagina},
        })

    return questoes, avisos, len(paginas)


def main() -> None:
    questoes, avisos, paginas = extrair()

    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    manifesto = {
        "documento": DOC,
        "arquivo": os.path.relpath(PDF, RAIZ),
        "paginas": paginas,
        "itens": questoes,
    }
    with open(SAIDA, "w", encoding="utf-8") as arquivo:
        json.dump(manifesto, arquivo, ensure_ascii=False, indent=1)
        arquivo.write("\n")

    print(f"{len(questoes)} questões extraídas de {PDF}")
    for numero, titulo in MODULOS.items():
        do_modulo = [q for q in questoes if q["modulo"] == numero]
        com_placa = sum(1 for q in do_modulo if q["placa"])
        print(f"  Módulo {numero} — {titulo}: {len(do_modulo)} ({com_placa} com placa)")

    posicoes = [0, 0, 0, 0]
    for questao in questoes:
        posicoes[questao["correta"]] += 1
    print(f"  posição da resposta certa: {posicoes} (bem distribuída = sem viés)")

    if avisos:
        print(f"\n{len(avisos)} aviso(s):")
        for aviso in avisos:
            print(f"  - {aviso}")
    print(f"\ndados -> {SAIDA}")


if __name__ == "__main__":
    main()
