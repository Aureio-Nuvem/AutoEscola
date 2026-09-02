/**
 * Cartões de resumo, lidos antes de praticar.
 *
 * O conteúdo é resumido dos módulos didáticos do material — cada cartão cita a
 * seção de onde saiu, para conferência. Nada aqui é escrito de cabeça.
 */
import type { Cartao } from './schema'

const M1 = 'Módulo 1 — Placas, Cores e Caminhos'
const M2 = 'Módulo 2 — Escolhas e Consequências'

export const CARTOES: Cartao[] = [
  // ── Módulo 1 ────────────────────────────────────────────────────────────
  {
    id: 'm1c01',
    modulo: 1,
    titulo: 'As três famílias de placas',
    paragrafos: [
      'Toda placa pertence a uma família, e a família já entrega a intenção dela antes mesmo de você ler o símbolo.',
      'Regulamentação é ordem: impõe o que pode e o que não pode. Desobedecer é infração. São as vermelhas e circulares.',
      'Advertência é aviso: alerta sobre algo que vem à frente, para você ter tempo de reagir. São as amarelas em losango.',
      'Indicação é informação: orienta, mostra serviços e distâncias. Não dá ordem nem alerta perigo.',
    ],
    fonte: { documento: M1, secao: 'AS FAMÍLIAS DE PLACAS' },
  },
  {
    id: 'm1c02',
    modulo: 1,
    titulo: 'A hierarquia da sinalização',
    paragrafos: [
      'Quando dois sinais se contradizem, existe uma ordem de prioridade definida pelo Código de Trânsito Brasileiro.',
      '1º Agente de trânsito — a ordem dele supera tudo, inclusive o semáforo.\n2º Semáforo.\n3º Placas verticais.\n4º Marcações no chão.\n5º Regras gerais de circulação.',
      'O material resume assim: pessoa manda mais que luz, luz manda mais que placa, placa manda mais que chão.',
      'Esse é um dos pontos que mais aparecem na prova. Se o agente mandar avançar com o sinal vermelho, você avança.',
    ],
    fonte: { documento: M1, secao: 'A HIERARQUIA DA SINALIZAÇÃO: QUEM MANDA QUANDO TODOS FALAM JUNTOS?' },
  },
  {
    id: 'm1c03',
    modulo: 1,
    titulo: 'As cores das placas de indicação',
    paragrafos: [
      'Dentro da família de indicação, a cor diz qual é o tipo de informação.',
      'Azul — identificação e serviços: hospital, restaurante, posto, telefone.',
      'Verde — orientação de destino: cidades, distâncias, saídas e retornos. É o seu GPS nas estradas.',
      'Branca — educativa: mensagens curtas como "USE O CINTO". Não dá ordem, reforça comportamento.',
      'Marrom — turismo: cachoeiras, parques, museus e pontos históricos.',
    ],
    fonte: { documento: M1, secao: 'GUIA DAS PLACAS DE INDICAÇÃO NO TRÂNSITO BRASILEIRO' },
  },
  {
    id: 'm1c04',
    modulo: 1,
    titulo: 'O chão também fala',
    paragrafos: [
      'A sinalização horizontal são as marcas pintadas no asfalto. Ela está sempre no seu campo de visão, mas é a que os motoristas mais esquecem.',
      'A faixa de pedestres é o ponto onde o pedestre tem prioridade absoluta. Nunca pare sobre ela: além de infração, atrapalha quem tem mobilidade reduzida ou deficiência visual.',
      'Faixas vermelhas no pavimento marcam espaço exclusivo ou preferencial de ciclistas — ciclovia ou ciclofaixa.',
      'Na hierarquia, o chão fica abaixo das placas: em caso de conflito entre placa e pintura, vale a placa.',
    ],
    fonte: { documento: M1, secao: 'SINALIZAÇÃO HORIZONTAL: O CHÃO TAMBÉM FALA COM VOCÊ' },
  },
  {
    id: 'm1c05',
    modulo: 1,
    titulo: 'Semáforo: as três luzes',
    paragrafos: [
      'Vermelho é parada obrigatória até o sinal mudar. Avançar o vermelho é uma das infrações mais graves que existem.',
      'Amarelo é atenção e preparação para parar — não é convite para acelerar. Se você já estiver muito próximo do cruzamento, prossiga com cautela.',
      'Verde libera a passagem, mas não dispensa atenção: pode haver pedestre terminando a travessia.',
      'Há semáforos próprios para pedestres e para ciclistas, cada um com seu tempo de travessia.',
    ],
    fonte: { documento: M1, secao: 'SINALIZAÇÃO SEMAFÓRICA: OS MAESTROS DO TRÂNSITO' },
  },
  {
    id: 'm1c06',
    modulo: 1,
    titulo: 'Laranja significa provisório',
    paragrafos: [
      'Placa laranja é sinalização temporária: obra, desvio, interdição parcial ou evento.',
      'A cor foi escolhida justamente por não se confundir com nenhuma sinalização permanente.',
      'Por ser temporária, ela pode aparecer da noite para o dia — mesmo num trajeto que você faz todos os dias.',
      'Sinalização temporária merece a mesma obediência que qualquer outra.',
    ],
    fonte: { documento: M1, secao: 'SINALIZAÇÃO TEMPORÁRIA QUANDO ALGO DIFERENTE ESTÁ ACONTECENDO' },
  },

  // ── Módulo 2 ────────────────────────────────────────────────────────────
  {
    id: 'm2c01',
    modulo: 2,
    titulo: 'Infração, penalidade, medida e crime',
    paragrafos: [
      'Errar no trânsito aciona respostas diferentes, e a prova cobra a diferença entre elas.',
      'A infração é o ato em si. A penalidade é a punição administrativa — advertência, multa, suspensão, cassação.',
      'A medida administrativa é a providência imediata sobre o veículo ou o condutor, como retenção ou remoção.',
      'O crime de trânsito é outra esfera: processo criminal, com possibilidade de prisão e antecedentes na ficha.',
      'Exemplo do material: avançar o sinal vermelho é infração gravíssima com 7 pontos. Se causar sinistro com feridos ou mortos, vira crime de trânsito.',
    ],
    fonte: { documento: M2, secao: 'QUATRO TIPOS DE CONSEQUÊNCIAS QUANDO VOCÊ ERRA' },
  },
  {
    id: 'm2c02',
    modulo: 2,
    titulo: 'Nem toda infração pesa igual',
    paragrafos: [
      'As infrações são classificadas em quatro níveis de gravidade: leve, média, grave e gravíssima.',
      'O nível reflete o tamanho do risco que o comportamento oferece — não é arbitrário, vem de estatísticas de sinistros.',
      'O material compara: esquecer o farol à noite é bem mais perigoso que estacionar um pouco longe da guia. Por isso a primeira é média e a segunda, leve.',
      'Quanto maior a gravidade, maior a multa e a pontuação na CNH. Acúmulo de pontos pode levar a suspensão ou cassação.',
    ],
    fonte: { documento: M2, secao: 'NEM TODA INFRAÇÃO TEM O MESMO PESO' },
  },
  {
    id: 'm2c03',
    modulo: 2,
    titulo: 'Celular ao volante',
    paragrafos: [
      'É uma das infrações mais cometidas no Brasil e das que mais causam sinistros.',
      'A conta do material: desviar o olhar por dois segundos a 60 km/h significa percorrer 33 metros sem estar prestando atenção. É atravessar um campo de futebol de olhos fechados.',
      'Infração gravíssima: 7 pontos na CNH e multa de R$ 293,47.',
    ],
    fonte: { documento: M2, secao: 'SAINDO DE CASA: QUANDO A PRESSA VIRA PERIGO' },
  },
  {
    id: 'm2c04',
    modulo: 2,
    titulo: 'Preferência do pedestre na faixa',
    paragrafos: [
      'Ao se aproximar de uma faixa, o condutor deve reduzir e estar pronto para parar.',
      'Se houver pedestre atravessando ou demonstrando intenção de atravessar, a preferência é dele. Não importa a pressa nem a distância.',
      'Deixar de dar preferência é infração gravíssima: 7 pontos e multa de R$ 293,47.',
    ],
    fonte: { documento: M2, secao: 'NO CRUZAMENTO: RESPEITO AO PEDESTRE' },
  },
  {
    id: 'm2c05',
    modulo: 2,
    titulo: 'Veículo de emergência tem prioridade absoluta',
    paragrafos: [
      'Ambulância, viatura policial, bombeiros e órgãos de trânsito com sirene ou luzes acionadas têm prioridade sobre todo mundo.',
      'Ao perceber, o condutor deve agir imediatamente: reduzir, encostar e parar se necessário para liberar a passagem.',
      'Dar passagem não é gentileza, é obrigação legal.',
      'Seguir atrás do veículo de emergência para aproveitar o caminho livre também é infração.',
    ],
    fonte: { documento: M2, secao: 'DANDO PASSAGEM: QUANDO CADA SEGUNDO CONTA' },
  },
  {
    id: 'm2c06',
    modulo: 2,
    titulo: 'Recebeu multa: o que fazer',
    paragrafos: [
      'Leia a notificação e confira os dados: quem autuou, data, hora, local, placa e modelo do veículo.',
      'Se não reconhece a infração ou os dados estão errados, você pode contestar junto ao órgão responsável antes da penalidade ser confirmada.',
      'Se não era você ao volante, é possível indicar o condutor — com a anuência dele.',
      'Respeite os prazos: perder o prazo é perder o direito de defesa. Reconhecendo a infração e pagando no início do processo, o desconto pode chegar a 40%.',
      'Multa não paga gera restrição no licenciamento, juros e pode ser cobrada judicialmente.',
    ],
    fonte: { documento: M2, secao: 'O QUE FAZER QUANDO VOCÊ RECEBE UMA MULTA' },
  },
]
