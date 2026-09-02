/**
 * Cartões de resumo, lidos antes de praticar.
 *
 * O conteúdo é resumido dos módulos didáticos do material — cada cartão cita a
 * seção de onde saiu, para conferência. Nada aqui é escrito de cabeça.
 */
import type { Cartao } from './schema'

const M1 = 'Módulo 1 — Placas, Cores e Caminhos'
const M2 = 'Módulo 2 — Escolhas e Consequências'
const M3 = 'Módulo 3 — Na Direção da Segurança'
const M4 = 'Módulo 4 — Cuidar, Agir e Preservar'

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

  // ── Módulo 3 ────────────────────────────────────────────────────────────
  {
    id: 'm3c01',
    modulo: 3,
    titulo: 'Categorias A e B',
    paragrafos: [
      'Na primeira habilitação você escolhe entre a categoria A (motos), a B (carros) ou as duas juntas, a AB.',
      'Categoria A: motocicletas de qualquer cilindrada, motonetas, ciclomotores (até 50 cilindradas) e triciclos motorizados. Se tem duas ou três rodas e motor, entra aqui.',
      'Categoria B: automóveis de passeio e utilitários leves, com dois limites que caem em prova — no máximo 8 lugares além do motorista, e peso bruto total de até 3.500 kg.',
    ],
    fonte: { documento: M3, secao: 'O QUE VOCÊ PODE DIRIGIR COM A PRIMEIRA HABILITAÇÃO?' },
  },
  {
    id: 'm3c02',
    modulo: 3,
    titulo: 'Os quatro tipos de via urbana',
    paragrafos: [
      'Cada tipo de via da cidade tem uma velocidade máxima própria. Decorar esta escada resolve muita questão.',
      'Trânsito rápido — 80 km/h. Grandes eixos expressos, sem semáforos a toda hora e sem cruzamentos diretos.',
      'Arterial — 60 km/h. Avenidas que ligam bairros, com semáforos e faixas de pedestres.',
      'Coletora — 40 km/h. Faz a ponte entre as ruas do bairro e as avenidas.',
      'Local — 30 km/h. Rua residencial, com crianças, pedestres e ciclistas. Área de convivência.',
      'A regra por trás: quanto maior a velocidade permitida, maior a distância que você precisa manter do carro da frente.',
    ],
    fonte: { documento: M3, secao: 'CONHECENDO OS TIPOS DE RUAS DA CIDADE' },
  },
  {
    id: 'm3c03',
    modulo: 3,
    titulo: 'Quem passa primeiro',
    paragrafos: [
      'Em cruzamento SEM sinalização, a ordem é esta:',
      '1. Rodovia tem prioridade — vale quando só um dos fluxos vem de rodovia.\n2. Na rotatória, quem já está dentro passa primeiro.\n3. Nos demais casos, quem vem pela direita.',
      'Acima de tudo isso: se houver placa, semáforo ou qualquer sinalização, ela manda. A sinalização é a lei máxima no cruzamento.',
    ],
    fonte: { documento: M3, secao: 'ENTENDENDO A PREFERÊNCIA: QUEM PASSA PRIMEIRO?' },
  },
  {
    id: 'm3c04',
    modulo: 3,
    titulo: 'Os cinco pilares da direção defensiva',
    paragrafos: [
      'Direção defensiva não é dirigir com medo nem devagar. É prever o perigo antes que ele aconteça — porque mesmo fazendo tudo certo, os outros podem errar.',
      'Conhecimento — saber as regras, o veículo e as condições da via.\nAtenção — eliminar distrações; o celular é o principal inimigo.\nPrevisão — imaginar o que pode acontecer antes que aconteça.\nDecisão — escolher sempre a ação mais segura, mesmo que custe tempo.\nHabilidade — controlar o veículo com suavidade.',
      'Os cinco trabalham juntos: habilidade sem atenção não adianta, e conhecimento sem previsão fica incompleto.',
    ],
    fonte: { documento: M3, secao: 'OS CINCO PILARES DA DIREÇÃO DEFENSIVA' },
  },
  {
    id: 'm3c05',
    modulo: 3,
    titulo: 'Ultrapassagem segura',
    paragrafos: [
      'Sinalize com antecedência, verifique retrovisores e ponto cego, confirme que há espaço, execute e retorne para a direita.',
      'A faixa da esquerda é para ultrapassar, não para circular.',
      'Nunca ultrapasse em: curvas e aclives sem visibilidade, cruzamentos e entroncamentos, pontes e viadutos, faixas de pedestres, e onde houver linha contínua.',
      'Quando for você o ultrapassado: mantenha a velocidade, não acelere, fique à direita e facilite a manobra.',
    ],
    fonte: { documento: M3, secao: 'COMO ULTRAPASSAR COM SEGURANÇA' },
  },
  {
    id: 'm3c06',
    modulo: 3,
    titulo: 'Cadeirinha: a regra por idade',
    paragrafos: [
      'Bebê conforto — até 1 ano ou até 13 kg. De costas para o movimento, no banco traseiro.',
      'Cadeirinha — de 1 a 4 anos, ou 9 a 18 kg. Voltada para frente, no banco traseiro, presa pelo cinto ou ISOFIX.',
      'Assento de elevação — de 4 a 7 anos e meio, ou até 1,45 m e entre 15 e 36 kg.',
      'Cinto direto no banco — acima de 7 anos e meio até 10 anos, desde que tenha mais de 1,45 m. Se não tiver a altura, continua no assento de elevação.',
      'Transportar criança sem o dispositivo correto é infração gravíssima: 7 pontos, multa e retenção do veículo.',
    ],
    fonte: { documento: M3, secao: 'SEGURANÇA INFANTIL NO TRÂNSITO: PROTEGENDO NOSSOS PEQUENOS' },
  },
  {
    id: 'm3c07',
    modulo: 3,
    titulo: 'Airbag só funciona com cinto',
    paragrafos: [
      'O airbag é complemento do cinto, nunca substituto. Sem o cinto afivelado, o corpo chega ao airbag na posição e na velocidade erradas, e a proteção vira risco.',
      'Mantenha distância adequada do volante, não cubra o compartimento do airbag com objetos e verifique a luz indicadora no painel.',
      'Criança vai no banco traseiro — inclusive por causa do airbag dianteiro.',
    ],
    fonte: { documento: M3, secao: 'AIRBAG: UMA PROTEÇÃO ESSENCIAL QUE COMPLEMENTA O CINTO DE SEGURANÇA' },
  },
  {
    id: 'm3c08',
    modulo: 3,
    titulo: 'Dividindo a via',
    paragrafos: [
      'Ciclistas: ao ultrapassar, mantenha 1,5 metro de distância lateral. Evite a buzina perto deles — o susto desequilibra.',
      'Pedestres: atenção redobrada com idosos e pessoas com mobilidade reduzida, nas conversões à direita e em áreas escolares.',
      'Motociclistas: verifique o ponto cego antes de mudar de faixa, cuidado nos cruzamentos e respeite o corredor.',
      'Todos esses são usuários vulneráveis: numa colisão, quem está sem carroceria leva a pior.',
    ],
    fonte: { documento: M3, secao: 'CONVIVENDO COM PEDESTRES' },
  },

  // ── Módulo 4 ────────────────────────────────────────────────────────────
  {
    id: 'm4c01',
    modulo: 4,
    titulo: 'Dirigir com sono',
    paragrafos: [
      'Dirigir com sono é tão perigoso quanto dirigir alcoolizado — e o material diz isso com todas as letras.',
      'A conta: um cochilo de 3 ou 4 segundos a 80 km/h faz o carro percorrer quase 100 metros sem controle nenhum.',
      'Sinais de alerta: bocejos frequentes, pálpebras pesadas, pensamentos dispersos, dificuldade de focar e o carro oscilando entre as faixas.',
      'O que fazer: parar em local seguro, sair do carro, alongar, respirar ar fresco e se hidratar. Café e música não substituem descanso.',
    ],
    fonte: { documento: M4, secao: 'O PERIGO INVISÍVEL: QUANDO O SONO TOMA O VOLANTE' },
  },
  {
    id: 'm4c02',
    modulo: 4,
    titulo: 'Emoção também dirige',
    paragrafos: [
      'Raiva, ansiedade, tristeza e medo entram no carro junto com você. Um motorista alterado perde a noção de risco e reage por impulso.',
      'O caminho que o material propõe: reconheça a emoção, respire fundo três vezes, observe sem se julgar, e só então aja com calma.',
      'Não é frase de efeito: é o que separa uma decisão consciente de uma reação impulsiva a 60 km/h.',
    ],
    fonte: { documento: M4, secao: 'RISCOS AO VOLANTE: O INIMIGO QUE VEM DE DENTRO' },
  },
  {
    id: 'm4c03',
    modulo: 4,
    titulo: 'Sinistro: a ordem dos passos',
    paragrafos: [
      '1. Garanta a sua segurança primeiro. Pare longe do fluxo e acione o pisca-alerta.',
      '2. Sinalize o local com o triângulo a no mínimo 30 metros — mais, se for curva, à noite ou em via rápida.',
      '3. Avalie a situação: há vazamento de combustível, fumaça, fios soltos, risco de incêndio?',
      '4. Acione o socorro com informações claras: local exato, número de vítimas, estado delas e riscos no local.',
      '5. Preste assistência com responsabilidade: converse com a vítima, cubra se estiver com frio, e aguarde o socorro.',
      'Nem sempre ajudar significa tocar na vítima. Muitas vezes a melhor ajuda é proteger o local e chamar quem sabe.',
    ],
    fonte: { documento: M4, secao: 'OS PASSOS ESSENCIAIS: O QUE FAZER PRIMEIRO' },
  },
  {
    id: 'm4c04',
    modulo: 4,
    titulo: 'Os quatro números',
    paragrafos: [
      '192 — SAMU. Emergências médicas.',
      '193 — Bombeiros. Incêndios, resgates, risco com cabos elétricos ou produtos perigosos.',
      '190 — Polícia Militar. Ocorrências de segurança pública e apoio no local.',
      '191 — PRF. Sinistros em rodovias federais.',
    ],
    fonte: { documento: M4, secao: 'NÚMEROS QUE SALVAM VIDAS: TENHA SEMPRE EM MENTE' },
  },
  {
    id: 'm4c05',
    modulo: 4,
    titulo: 'O que NÃO fazer com uma vítima',
    paragrafos: [
      'Esta lista cai bastante na prova, e cada item tem um porquê concreto.',
      'Nunca retire o capacete de um motociclista — pode haver lesão na coluna cervical, e tirar sem técnica pode causar paralisia ou morte.',
      'Não movimente a vítima, a menos que haja risco iminente de fogo ou explosão. A regra é: não remova, não movimente, não transporte.',
      'Não ofereça água, comida ou remédio — ela pode precisar de cirurgia.',
      'Não toque em ferimentos com a mão desprotegida, não tente recolocar ossos, não faça manobras de reanimação sem treino, e não fotografe nem filme.',
    ],
    fonte: { documento: M4, secao: 'O QUE VOCÊ NÃO DEVE FAZER: ERROS QUE PODEM CUSTAR VIDAS' },
  },
  {
    id: 'm4c06',
    modulo: 4,
    titulo: 'Com vítima e sem vítima são casos diferentes',
    paragrafos: [
      'Sem vítimas: mantenha a calma, troque informações com o outro condutor (nome, CPF, CNH, telefone, placa e modelo), retire os veículos da via, sinalize com o triângulo, fotografe tudo e registre a ocorrência.',
      'Com vítimas: sinalize e proteja o local, desligue o motor dos veículos se der, chame o socorro sem demora, fale com a vítima com calma e aguarde. Não mova ninguém.',
      'Fugir de um sinistro com vítimas é infração grave e pode configurar crime de omissão de socorro (art. 304 do CTB e art. 135 do Código Penal).',
      'Carga perigosa (painel laranja): afaste-se pelo menos 50 metros, fique com o vento nas costas e informe o número da placa laranja aos bombeiros.',
    ],
    fonte: { documento: M4, secao: 'TIPOS DE SINISTROS E COMO PROCEDER' },
  },
  {
    id: 'm4c07',
    modulo: 4,
    titulo: 'Manutenção preventiva',
    paragrafos: [
      'Pneus — único ponto de contato com o chão. Calibre uma vez por semana, com os pneus frios, e não esqueça o estepe. Pneu careca não expulsa a água da pista e causa aquaplanagem. Rodízio a cada 10 mil km.',
      'Freios — revisão completa a cada 5 a 10 mil km. Pedal muito alto ou muito baixo, ruído ao frear, carro puxando para um lado ou vibração no pedal são avisos sérios.',
      'Luzes — teste faróis, setas e luz de freio antes de sair. Farol baixo aceso mesmo de dia; farol alto só em via sem iluminação e sem tráfego em sentido contrário.',
      'Óleo — verifique uma vez por mês, com o motor frio e em terreno plano. Troque conforme o manual, sempre junto com o filtro.',
      'Visibilidade — reservatório cheio, palhetas trocadas ao menos uma vez por ano, vidros limpos por dentro e por fora.',
    ],
    fonte: { documento: M4, secao: 'MANUTENÇÃO PREVENTIVA' },
  },
  {
    id: 'm4c08',
    modulo: 4,
    titulo: 'Dirigir pensando no planeta',
    paragrafos: [
      'O veículo impacta o ambiente de três formas: poluição do ar (CO₂ e material particulado), poluição sonora (escapamento alterado, buzina sem necessidade, som alto) e resíduos tóxicos (óleo, fluido de freio, bateria, pneu).',
      'O que evitar: retirar o silenciador ou usar escapamento esportivo (infração grave), jogar lixo pela janela (infração média e crime ambiental), circular soltando fumaça preta (infração grave) e fazer modificações não autorizadas.',
      'O etanol é combustível renovável, feito de cana e outras plantas, e reduz emissões na frota leve — o motor flex deixa você escolher sem adaptar nada.',
      'A atitude mais sustentável às vezes é não usar o carro: transporte público, bicicleta, caminhada para até 2 km, carona compartilhada.',
    ],
    fonte: { documento: M4, secao: 'O QUE VOCÊ DEVE EVITAR PARA PROTEGER O MEIO AMBIENTE' },
  },
]
