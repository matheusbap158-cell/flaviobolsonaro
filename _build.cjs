// Gera index.html a partir dos dados abaixo (conteúdo real do site oficial, coletado em 11/10/2026).
// Uso: node _build.cjs
const fs = require('fs');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const ico = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4l14 8-14 8Z"/></svg>';
const ZAP = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11 11 0 0 0 3.2 17.2L2 22l4.9-1.2A11 11 0 1 0 20.5 3.5Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.9.7.8-2.8-.2-.3A9 9 0 1 1 12 20.5Zm5-6.7c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1a7.4 7.4 0 0 1-3.7-3.2c-.3-.5.3-.4.8-1.4.1-.2 0-.3 0-.5l-.9-2c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.8 11.8 0 0 0 4.5 4c2.2.9 2.2.6 2.6.6a2.2 2.2 0 0 0 1.5-1.1 1.8 1.8 0 0 0 .1-1.1c-.1-.1-.2-.2-.5-.3Z"/></svg>';

/* ---------- dados ---------- */
const propostas = [
  ['#FFCB05', ico('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6Z"/>'), 'Segurança', 'Sem ordem não há progresso. Pacificar o Brasil e libertar as famílias de bem.'],
  ['#12B24B', ico('<path d="M3 20h18M6 16V9M12 16V4M18 16v-5"/>'), 'Economia', 'Vamos tirar o Brasil do vermelho, com propostas contra os obstáculos que pesam na vida do brasileiro.'],
  ['#FFCB05', ico('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7"/>'), 'Mulher', 'Liberdade e autonomia: escolha, autonomia e liberdade para a mulher.'],
  ['#12B24B', ico('<path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z"/>'), 'Terceira idade', 'Cuidar de quem construiu o caminho: aposentadoria protegida e acesso à saúde.'],
  ['#FFCB05', ico('<path d="M3 9l1-5h16l1 5M4 9v11h16V9M9 20v-6h6v6"/>'), 'Empreendedorismo', 'Simplificar para prosperar: menos burocracia, menos impostos, crédito e capacitação.'],
  ['#12B24B', ico('<path d="M12 5v14M5 12h14"/>'), 'Saúde', 'Mortalidade zero na fila. O Plano Real do SUS.'],
  ['#FFCB05', ico('<path d="M5 21c0-9 5-15 15-16-1 10-7 15-15 16ZM5 21l8-8"/>'), 'Agro', 'Campo forte, Brasil forte: infraestrutura logística, tecnologia e segurança jurídica.'],
];

const temas = [
  ['Brasil sem Medo', 'para sua família voltar para casa em paz', 'Nenhuma família vive, trabalha ou prospera sob o domínio do medo.', ['A segurança é direito do cidadão de bem']],
  ['Brasil por Elas', 'fortalecer as mulheres é fortalecer a família', 'Mais da metade das famílias brasileiras é chefiada por uma mulher. Quando ela é protegida, capacitada e tem renda própria, não é só a vida dela que muda: é a da família inteira.', ['Central da Mulher', 'Aplicativo', 'Bônus de internet', 'ClarIA', 'Denúncia facilitada', 'Orientação financeira', 'Ganha, Ganha']],
  ['Brasil sem Fila', 'seu tempo é seu', 'Poucas coisas revelam tanto o descaso de um governo quanto a fila.', ['Internet como infraestrutura', 'Inteligência artificial a serviço do cidadão', 'Prontuário eletrônico único', 'INSS sem fila', 'Desburocratização para quem empreende', 'Menos burocracia no campo']],
  ['Brasil Mais Barato', 'para sobrar dinheiro no fim do mês', 'O povo se sente humilhado ao frequentar os supermercados. De nada adiantam promessas de picanha e cervejinha quando, na hora de passar no caixa, o carrinho está cada vez mais vazio e a conta, cada vez mais alta.', ['Menos imposto no que você consome', 'Comida mais barata na prateleira']],
  ['Brasil que Prepara', 'para sua família ter as ferramentas para vencer', 'Toda família brasileira quer a mesma coisa: que o filho tenha uma vida melhor do que a sua.', ['Ensinar de verdade', 'Esporte que forma', 'Cultura que valoriza nossas raízes']],
  ['Brasil que Prospera', 'para você conquistar o que é seu', 'Todo brasileiro quer a mesma coisa: crescer pelo próprio esforço e ter algo que seja seu. A casa própria, o negócio próprio, o carro na garagem, o nome limpo. Não é caridade que o povo pede, é oportunidade.', ['Da proteção à autonomia', 'Trabalho que compensa', 'Negócio próprio', 'A casa própria']],
  ['Brasil que Cresce', 'o país que dá condições a quem quer trabalhar e produzir', 'Este capítulo trata do país que cresce por baixo da vida de cada família.', ['Logística e transporte', 'Mobilidade urbana', 'Segurança hídrica', 'Energia', 'Minerais críticos', 'Meio ambiente', 'Desenvolvimento regional']],
  ['Brasil que Cumpre a Constituição', 'regras que valem para todos e não mudam no meio do jogo', 'Um país só prospera quando as regras são claras, valem para todos e não mudam ao sabor de quem está no poder.', []],
  ['Brasil que Não Volta Atrás', 'para que tudo isso seja permanente, e não uma bolha que estoura', 'Um plano de governo não vale pelo que promete, mas pelo que consegue sustentar.', []],
];

const elas = [
  ['Central da Mulher', 'um único lugar para resolver tudo'],
  ['Aplicativo Central da Mulher', 'tudo na palma da mão'],
  ['Bônus de internet', 'conectar pessoas é conectar oportunidades'],
  ['ClarIA', 'a amiga virtual que acompanha cada etapa da jornada'],
  ['Denúncia facilitada', 'a tecnologia vai impedir que a violência aconteça'],
  ['Orientação financeira', 'da proteção ao patrimônio'],
  ['Ganha, Ganha', 'atitude que vira benefício'],
];

const checagens = [
  ['Flávio Bolsonaro não vai desvincular ou acabar com o salário mínimo', 'O Plano de Governo não apresenta nenhuma proposta para extinguir o piso nacional.'],
  ['Flávio Bolsonaro vai manter e proteger a sua aposentadoria', 'Pagar a aposentadoria dos brasileiros é uma das primeiras obrigações do governo. É um direito garantido por lei.'],
  ['Flávio Bolsonaro vai garantir o Bolsa Família e a comida na sua mesa', 'Foi no governo do pai de Flávio que o Bolsa Família teve o maior aumento da história do programa.'],
  ['Flávio Bolsonaro vai ampliar o Minha Casa Minha Vida com um novo nome: Casa Verde e Amarela', 'O Plano de Governo propõe retomar o programa Casa Verde e Amarela.'],
  ['Flávio Bolsonaro não vai entregar as terras raras aos EUA', 'O Plano propõe desenvolver a cadeia produtiva desses minerais no Brasil.'],
  ['Flávio Bolsonaro vai cortar benefícios como o BPC/LOAS?', 'Flávio Bolsonaro afirmou que não fará economia em cima dos mais pobres e dos aposentados.'],
];

const destaques = [
  ['Propostas', 'Flávio Bolsonaro vai manter o Bolsa Família, garantir as aposentadorias e ampliar o Minha Casa Minha Vida', 'amarelo'],
  ['Geral', 'Flávio Bolsonaro decreta o fim da era Lula durante moto-carreata em São Gonçalo: “Vamos tirar o PT do poder dia 25 de outubro!”', ''],
  ['Geral', '“A gente vai resgatar a credibilidade do Brasil e do Rio”, afirma Flávio Bolsonaro em encontro ao lado do governador eleito Douglas Ruas', ''],
];
const pauta = [
  ['Segurança', '22 de setembro de 2026', '“Vocês estão olhando para o próximo presidente do Brasil”, diz Flávio Bolsonaro diante de uma multidão no Maranhão'],
  ['Economia', '22 de agosto de 2026', 'Fim da reeleição e suspensão da reforma tributária serão os primeiros atos do senador Flávio Bolsonaro, ao ser eleito Presidente da República'],
  ['Segurança', '21 de agosto de 2026', 'Segurança Pública: proposta de tolerância zero e endurecimento penal contra o crime organizado'],
  ['Segurança', '19 de agosto de 2026', '“Metam o pé enquanto tem um presidente da República que passa a mão na cabeça de vocês”, avisa Flávio Bolsonaro em discurso em Nova Iguaçu'],
  ['Geral', '11 de agosto de 2026', '“Juntos com este time para resgatar o Brasil”, diz Flávio Bolsonaro ao lado dos candidatos conservadores ao Senado'],
];

const capitulos = [
  ['Origens', 'Nasceu dentro dos muros da Academia Militar das Agulhas Negras, em Resende (RJ). Cresceu vendo o pai, Jair Bolsonaro, dedicar quase três décadas da vida à política antes de chegar à Presidência da República.'],
  ['Primeira eleição', 'Aos 21 anos, foi às urnas pela primeira vez e ouviu o Rio de Janeiro responder: 31.293 votos e o título de deputado estadual mais jovem já eleito na história do estado.'],
  ['Formação e segurança', 'Formou-se advogado, com especialização em Políticas Públicas (IUPERJ) e em Empreendedorismo (FGV). Presidiu a Comissão de Segurança Pública e foi autor da Lei 7.809/2017.'],
  ['Projeto coletivo', 'Em 2016, disputou a Prefeitura do Rio e ficou em 4º lugar. Anos depois, abriu mão do próprio palanque para construir 92 outros, um em cada município fluminense.'],
  ['Senado Federal', 'Em 2018, o Rio de Janeiro o levou ao Senado com mais de 4 milhões de votos. Autor da PEC 32/2019 e de projetos sobre registro de armas e o fim das saidinhas.'],
  ['Coragem', 'No Senado, presidiu a Comissão de Segurança Pública. É autor do livro “Jair Messias Bolsonaro — Mito ou Verdade”, um retrato de filho sobre pai.'],
  ['Família', 'Marido e pai de duas filhas. É por elas, e por cada família brasileira, que continua de pé, defendendo o direito de acreditar, de ter, de se proteger e de ver o Brasil crescer.'],
];

const ufs = { ac: 'Acre', al: 'Alagoas', am: 'Amazonas', ap: 'Amapá', ba: 'Bahia', ce: 'Ceará', df: 'Distrito Federal', es: 'Espírito Santo', go: 'Goiás', ma: 'Maranhão', mg: 'Minas Gerais', ms: 'Mato Grosso do Sul', mt: 'Mato Grosso', pa: 'Pará', pb: 'Paraíba', pe: 'Pernambuco', pi: 'Piauí', pr: 'Paraná', rj: 'Rio de Janeiro', rn: 'Rio Grande do Norte', ro: 'Rondônia', rr: 'Roraima', rs: 'Rio Grande do Sul', sc: 'Santa Catarina', se: 'Sergipe', sp: 'São Paulo', to: 'Tocantins' };

const jingles = [
  ['O Brasil Vai Vencer', 'Jingle oficial'], ['O Brasil Vai Vencer - Refrão', 'Versão refrão'], ['Faz o 22 - Piseiro', 'Jingle'], ['22 é Brasil', 'Vinheta'],
  ['Vota 22', 'Vinheta legal'], ['Vota 22 para Rádio', 'Vinheta de rádio'], ['Bloquinho não adianta chorar', 'Jingle'], ['Toma 22', 'Fabio DUB'],
  ['Neymar Original', 'Jingle oficial'], ['Lambadão', 'Jingle oficial'], ['Bloquinho – Vem Amiga, Vem Votar', 'Jingle oficial'], ['Só dá 22', 'Jingle'],
  ['Funk do 01', 'Jingle'], ['Com o pé direito!', 'Jingle'], ['Professora é 22', 'Maria Dj, Tiago Doidão'], ['Flávio virou virou', 'Jingle'],
  ['É de norte ao sul, é de leste a oeste', 'Música nordestina'], ['Fi do Bolsonaro - 22', 'Jingle'], ['Meu pai é o Jair Bolsonaro - 22', 'Jingle'], ['Pagodão do Vira Voto - 22', 'Jingle'],
  ['Vota 22 pro Lula aposentar', 'Jingle'], ['Sabor Picanha', 'Jingle'], ['Tô do lado do Flávio', 'Jingle'],
];

const videos = [['Lula perguntou, né? Eu vou responder!!', '11 de out. de 2026'], ['Bolsa Família vai ficar melhor!', '10 de out. de 2026'], ['Aposentadorias serão reajustadas acima da inflação', '10 de out. de 2026'], ['O povo será o centro do nosso governo!', '10 de out. de 2026']];
const programas = ['Programa eleitoral 01.10.2026', 'Programa eleitoral 26.09.2026', 'Programa eleitoral 22.09.2026', 'Programa eleitoral 17.09.2026', 'Pronunciamento oficial de Flávio Bolsonaro · 15.09.2026', 'Independência só existe com liberdade · 10.09.2026', 'A soberania começa pela Segurança Pública · 05.09.2026', 'Tesouraço nos impostos para o Brasil voltar a prosperar! · 05.09.2026'];

const materiais = [
  ['Plano de Governo', 'PDF · 458 KB', 'assets/capa-plano.webp', 'https://www.flaviobolsonaro.com.br/plano-integracao/plano-de-governo.pdf'],
  ['Logos', 'PNG · vetor', 'assets/materiais/prancha-01-g.webp', 'https://www.flaviobolsonaro.com.br/materiais'],
  ['Fotos oficiais', 'PNG recortado · PSD (Flávio e vice)', 'assets/alfredo-corte.webp', 'https://www.flaviobolsonaro.com.br/materiais'],
  ['Material de rua', 'Bandeira, adesivos, fly banner', 'assets/materiais/camp-bandeira-bandeira-200x140cm.webp', 'https://www.flaviobolsonaro.com.br/materiais'],
];

const faq = [
  ['O BolsoZap é de graça?', 'É de graça. É rápido. E é o primeiro passo para tirarmos o Brasil do vermelho.'],
  ['Meu número aparece para os outros?', 'Segundo a Meta, seguir o canal não revela o seu número.'],
  ['O site pede meus dados?', 'O site não solicita dados pessoais nesta etapa, conforme a LGPD (Lei nº 13.709/2018).'],
  ['Onde baixo o Plano de Governo?', 'Em PDF, pelo botão “Baixar Plano de Governo” desta página.'],
  ['Posso usar logos e fotos oficiais?', 'Sim. Na Central de Materiais estão logos em PNG e vetor e fotos em PNG recortado e PSD.'],
];

const secoes = [['inicio', 'Início'], ['manifesto', 'Manifesto'], ['compromisso', 'Compromisso'], ['propostas', 'Propostas'], ['plano', 'Plano por tema'], ['elas', 'Brasil por Elas'], ['checagem', 'Checagem'], ['agenda', 'Agenda'], ['tv', 'TV Celular'], ['noticias', 'Notícias'], ['trajetoria', 'Trajetória'], ['senado', 'Senado'], ['multimidia', 'Jingles'], ['materiais', 'Materiais'], ['faq', 'Perguntas'], ['participe', 'Participe']];

const pad = (n) => String(n).padStart(2, '0');

/* ---------- blocos ---------- */
const dots = secoes.map(([id, n]) => `<a href="#${id}" data-nome="${n}" aria-label="${n}"></a>`).join('');

const propsHtml = propostas.map((p, i) => `
    <article class="card p-card tilt" style="--c:${p[0]}"><div><div class="ico" style="--c:${p[0]}">${p[1]}</div><div class="n" style="margin-top:22px">${pad(i + 1)}</div><h3>${p[2]}</h3><p>${p[3]}</p></div><div class="tag">PLANO DE GOVERNO · ${p[2].toUpperCase()}</div></article>`).join('');

const temasBtns = temas.map((t, i) => `<button class="tema-btn" role="tab" id="tb${i}" aria-selected="${i === 0}" aria-controls="tema-painel" data-i="${i}"><b>${pad(i + 1)}</b>${esc(t[0])}</button>`).join('');
const temasJson = JSON.stringify(temas.map((t) => ({ t: t[0], s: t[1], i: t[2], it: t[3] })));

const elasHtml = elas.map((e, i) => `
      <article class="elas-card" data-reveal><div class="n">${pad(i + 1)}</div><h3>${esc(e[0])}</h3><p>${esc(e[1])}</p></article>`).join('');

const checaHtml = checagens.map((c) => `
      <article class="checa-card" data-reveal><span class="sel">CHECAGEM DA CAMPANHA</span><h3>${esc(c[0])}</h3><p>${esc(c[1])}</p></article>`).join('');

const destHtml = destaques.map((d) => `
        <article class="not-card ${d[2]}" data-reveal><span class="cat">${d[0]}</span><h3>${esc(d[1])}</h3></article>`).join('');
const pautaHtml = pauta.map((p) => `<li><span class="m">${p[0]} · ${p[1]}</span><p>${esc(p[2])}</p></li>`).join('');

const vidsHtml = videos.map((v) => `
      <article class="vid" data-reveal><div class="th"><b>${PLAY}</b></div><p>${esc(v[0])}</p><small>${v[1]}</small></article>`).join('');
const progHtml = programas.map((p, i) => `<li><b>${pad(i + 1)}</b><span>${esc(p)}</span></li>`).join('');

const capsHtml = capitulos.map((c, i) => `
      <article class="cap ${i === capitulos.length - 1 ? 'final' : ''}" data-reveal><div class="k">${pad(i + 1)}</div><div><h3>${esc(c[0])}</h3><p>${esc(c[1])}</p></div></article>`).join('');

const ufHtml = Object.keys(ufs).map((k) => `<div class="uf" data-reveal><img src="assets/flags/${k}.svg" alt="Bandeira de ${ufs[k]}" loading="lazy"><span>${ufs[k]}</span></div>`).join('');

const jgHtml = jingles.map((j, i) => `
      <button class="jg" type="button" aria-pressed="false"><span class="pl">${PLAY}</span><span class="t">${pad(i + 1)}. ${esc(j[0])}<small>${esc(j[1])}</small></span><span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span></button>`).join('');

const matHtml = materiais.map((m) => `
      <a class="mat-card" href="${m[3]}" target="_blank" rel="noopener" data-reveal><div class="vis"><img src="${m[2]}" alt="" loading="lazy"></div><h3>${m[0]}</h3><p>${m[1]}</p><span class="btn-link">Acessar</span></a>`).join('');

const faqHtml = faq.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f[0])}</summary><div class="acc-body">${esc(f[1])}</div></details>`).join('');

const marqTxt = ['O Brasil vai vencer', 'Deus, Pátria, Família e Liberdade', 'Presidente 22', 'Vamos tirar o país do vermelho'];
const marq = (arr) => `<div class="trilho">${[...arr, ...arr].map((t) => `<span>${t}</span>`).join('')}</div>`;

/* ---------- página ---------- */
const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Flávio Bolsonaro | Conceito de redesign</title>
<meta name="description" content="Estudo de redesign interativo feito pela Connect Alpha a partir de materiais públicos do site oficial. Não é o site oficial.">
<meta name="theme-color" content="#005BAA">
<meta name="robots" content="noindex">
<link rel="icon" href="assets/favicon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&display=swap">
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/components.css">
<link rel="stylesheet" href="assets/css/site.css">
</head>
<body>
<div class="progresso" id="prog"></div>
<div class="cursor" id="cursor" aria-hidden="true"></div>

<div class="pre" id="pre" aria-hidden="true"><div><img id="pre-logo" src="assets/logo-horizontal-negativa.png" alt=""><div class="pre-b"><i id="pre-bar"></i></div></div></div>

<div class="acess" role="region" aria-label="Acessibilidade">
  <div class="wrap">
    <span>CONCEITO DE REDESIGN · CONNECT ALPHA · NÃO É O SITE OFICIAL</span>
    <div class="acess-btns">
      <button type="button" id="a-menos" aria-label="Diminuir texto">A−</button>
      <button type="button" id="a-mais" aria-label="Aumentar texto">A+</button>
      <button type="button" id="a-hc" aria-pressed="false">Alto contraste</button>
      <button type="button" id="a-pausa" aria-pressed="false">Pausar animações</button>
    </div>
  </div>
</div>

<header class="topo" id="topo">
  <div class="topo-in"><div class="topo-bar">
    <a class="logo" href="#inicio" aria-label="Flávio Bolsonaro, início"><img src="assets/logo-horizontal-negativa.png" alt="Flávio Bolsonaro Presidente 22"></a>
    <nav class="nav" aria-label="Principal">
      <a href="#inicio">Início</a><a href="#propostas">Propostas</a><a href="#plano">Plano</a><a href="#agenda">Agenda</a><a href="#tv">TV Celular</a><a href="#trajetoria">Flávio</a><a href="#participe">Participe</a>
    </nav>
    <a class="btn btn-primario btn-sm" href="#participe" data-magnetic>Doe agora</a>
  </div></div>
</header>
<nav class="dots" aria-label="Seções">${dots}</nav>

<main>
<!-- 01 HERO -->
<section class="hero" id="inicio">
  <div class="hero-grain" aria-hidden="true"></div>
  <div class="hero-grid" data-depth="0.2" aria-hidden="true"></div>
  <div class="hero-shape" data-depth="0.5" aria-hidden="true"></div>
  <div class="hero-22" data-depth="0.9" aria-hidden="true">22</div>
  <img class="hero-foto" id="hero-foto" src="assets/foto-oficial.webp" alt="Flávio Bolsonaro, candidato à Presidência" width="1634" height="2048" fetchpriority="high">
  <div class="glass g1" data-depth="1.3"><b id="dias">14</b><small>dias para 25 de outubro</small></div>
  <div class="glass g2" data-depth="1.1"><b>9</b><small>temas no Plano de Governo</small></div>
  <div class="hero-body">
    <div class="hero-txt" id="hero-txt">
      <span class="kicker" data-hero>Deus, Pátria, Família e Liberdade</span>
      <h1>
        <span class="ln"><span data-hero-l>O Brasil vai</span></span>
        <span class="ln"><span data-hero-l><span class="gigante">vencer</span></span></span>
      </h1>
      <span class="faixa" data-hero>Vamos tirar o país do vermelho</span>
      <div class="btns" data-hero>
        <a class="btn btn-zap" href="#participe" data-magnetic>${ZAP}Entre no BolsoZap</a>
        <a class="btn btn-fantasma" href="#participe" data-magnetic>Contribua com a nossa campanha</a>
      </div>
      <p class="aviso" data-hero><b>Canal oficial no WhatsApp.</b> Este site não solicita dados pessoais nesta etapa. Segundo a Meta, seguir o canal <b>não revela o seu número</b>.</p>
    </div>
  </div>
  <div class="rolar" aria-hidden="true"></div>
</section>

<div class="faixa-marq marq" aria-hidden="true">${marq(marqTxt)}</div>

<!-- 02 MANIFESTO -->
<section class="manifesto" id="manifesto" aria-label="Manifesto">
  <div class="man-pin" id="man-pin">
    <div class="man-stack">
      <p class="man-line s">Sem ordem<br>não há <em>progresso.</em></p>
      <p class="man-line s">Vamos tirar<br>o Brasil do <em>vermelho.</em></p>
      <p class="man-line s">O Brasil<br>vai <em>vencer.</em></p>
    </div>
    <div class="man-count" aria-hidden="true"><b id="man-n">01</b> <span>/ 03</span></div>
  </div>
</section>

<!-- 03 NÚMEROS -->
<section class="nums" aria-label="Números do site oficial">
  <div class="wrap">
    <div class="stat" data-reveal><b data-count="9">0</b><span>temas no Plano de Governo</span><small>FONTE: SITE OFICIAL</small></div>
    <div class="stat" data-reveal><b data-count="7">0</b><span>propostas por público</span><small>FONTE: SITE OFICIAL</small></div>
    <div class="stat" data-reveal><b data-count="27">0</b><span>estados com candidatos ao Senado</span><small>FONTE: SITE OFICIAL</small></div>
    <div class="stat" data-reveal><b data-count="23">0</b><span>jingles oficiais</span><small>FONTE: SITE OFICIAL</small></div>
  </div>
</section>

<!-- 04 COMPROMISSO -->
<section class="comp" id="compromisso">
  <div class="comp-bg" id="comp-bg"></div>
  <div class="wrap">
    <div data-reveal>
      <span class="eyebrow">Nosso compromisso</span>
      <h2>O Brasil precisa <em>de você.</em></h2>
    </div>
    <div>
      <p class="pal split">Nenhum país se levanta sozinho. Quem levanta um país é gente. É o pai que sai de casa às cinco da manhã e volta quando os filhos já dormiram. É o caminhoneiro na estrada, o professor na sala, o policial na esquina, o pequeno comerciante que abre as portas todos os dias.</p>
      <p class="pal split">Patriotismo não é gritar mais alto. É não desistir. É acreditar que este país pode voltar a ser um Brasil grande de verdade: onde a lei vale para todos e o dinheiro do seu trabalho volta para o seu bolso, não para a máquina.</p>
      <p class="final" data-reveal>Chegou a hora. O Brasil vai vencer!</p>
      <a class="btn btn-escuro" href="#plano" data-reveal data-magnetic>Conheça o Plano de Governo</a>
    </div>
  </div>
</section>

<!-- 05 PROPOSTAS -->
<section class="props" id="propostas">
  <div class="wrap props-head">
    <div data-reveal><span class="eyebrow on-dark">Plano de Governo</span><h2 style="margin-top:14px">Propostas para <em class="hl">o Brasil.</em></h2></div>
    <p data-reveal>Sete frentes, uma para cada parte da população. Role a página: os cards andam sozinhos.</p>
  </div>
  <div class="props-track" id="track">${propsHtml}
  </div>
  <div class="props-bar" aria-hidden="true"><i id="props-bar"></i></div>
</section>

<!-- 06 PLANO POR TEMA -->
<section class="plano" id="plano">
  <div class="wrap">
    <div data-reveal><span class="eyebrow">Plano de Governo</span><h2 style="margin-top:14px">Explore por <em>tema.</em></h2></div>
    <div class="temas">
      <div class="tema-lista" role="tablist" aria-label="Temas do plano" data-reveal>${temasBtns}</div>
      <div class="tema-painel" id="tema-painel" role="tabpanel" aria-live="polite">
        <div class="num-grande" id="tp-n">01</div>
        <h3 id="tp-t">${esc(temas[0][0])}</h3>
        <p class="sub" id="tp-s">${esc(temas[0][1])}</p>
        <p class="intro" id="tp-i">${esc(temas[0][2])}</p>
        <div class="tema-itens" id="tp-it">${temas[0][3].map((x) => `<span>${esc(x)}</span>`).join('')}</div>
        <div class="plano-cta">
          <a class="btn btn-primario" href="https://www.flaviobolsonaro.com.br/plano-integracao/plano-de-governo.pdf" target="_blank" rel="noopener" data-magnetic>Baixar Plano de Governo - PDF</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 07 BRASIL POR ELAS -->
<section class="elas" id="elas">
  <div class="wrap">
    <div class="elas-top">
      <div class="big" data-reveal><span class="eyebrow on-dark">Brasil por Elas</span><h2 style="margin-top:14px">Fortalecer as mulheres é fortalecer <em>a família.</em></h2></div>
      <p class="lead" data-reveal style="color:#fff">Mais da metade das famílias brasileiras é chefiada por uma mulher. Quando ela é protegida, capacitada e tem renda própria, não é só a vida dela que muda: é a da família inteira.</p>
    </div>
    <div class="elas-grid">${elasHtml}
    </div>
  </div>
</section>

<!-- 08 CHECAGEM -->
<section class="checa" id="checagem">
  <div class="wrap">
    <div data-reveal><span class="eyebrow">A verdade, com fontes</span><h2 style="margin-top:14px">Combate à <em>fake news.</em></h2><p class="lead" style="margin-top:16px;max-width:60ch;color:var(--cinza-700)">Informação exige prova: o que foi dito, o que os dados mostram e uma conclusão direta para compartilhar.</p></div>
    <div class="checa-grid">${checaHtml}
    </div>
  </div>
</section>

<!-- 09 AGENDA -->
<section class="agenda" id="agenda">
  <div class="wrap">
    <div data-reveal><span class="eyebrow">Agenda oficial</span><h2 style="margin-top:14px">Flávio perto <em>de você.</em></h2><p class="lead" style="margin-top:16px;max-width:460px;color:var(--cinza-500)">Acompanhe os próximos compromissos da campanha e saiba quando ele estará na sua região.</p></div>
    <div class="vazio" data-reveal>
      <div class="cal" aria-hidden="true"><i></i><i></i><i class="on"></i><i></i><i></i><i class="on"></i><i></i><i></i><i></i><i></i><i class="on"></i><i></i><i></i><i></i><i></i><i class="on"></i><i></i><i></i><i></i><i></i><i></i></div>
      <p>A agenda está sendo atualizada. Acompanhe o BolsoZap para receber os próximos compromissos.</p>
      <a class="btn btn-zap" href="#participe" data-magnetic>${ZAP}Entre no BolsoZap</a>
    </div>
  </div>
</section>

<!-- 10 TV CELULAR -->
<section class="tv" id="tv">
  <div class="wrap">
    <div data-reveal><span class="live"><i></i> 24 HORAS</span><h2 style="margin-top:14px">Acompanhe a <em class="hl">TV Celular</em></h2></div>
    <div class="tv-top">
      <div class="player" data-reveal><span class="play">${PLAY}</span></div>
      <div class="tv-lado" data-reveal>
        <span class="micro" style="color:var(--amarelo-500)">Conteúdo direto no seu celular</span>
        <h3>A TV que acompanha você</h3>
        <p>Notícia, política, humor, entretenimento, bastidores e o Brasil real. Se a transmissão ainda não começou, visite o canal para ativar as notificações e conferir os últimos vídeos.</p>
        <a class="btn btn-primario" style="margin-top:22px" href="#tv" data-magnetic>Abrir canal no YouTube</a>
      </div>
    </div>
    <h3 style="margin-top:clamp(36px,5vw,64px)" data-reveal>Últimos vídeos</h3>
    <div class="vids">${vidsHtml}
    </div>
    <h3 style="margin-top:clamp(36px,5vw,64px)" data-reveal>O Brasil vai vencer · playlist oficial</h3>
    <ul class="lista-prog">${progHtml}</ul>
  </div>
</section>

<!-- 11 NOTÍCIAS -->
<section class="noticias" id="noticias">
  <div class="wrap">
    <div data-reveal><span class="eyebrow">Notícias</span><h2 style="margin-top:14px">O que está <em>acontecendo.</em></h2></div>
    <div class="not-grid">
      <div class="not-destaque">${destHtml}
      </div>
      <aside class="pauta" data-reveal><h4>Em pauta</h4><ul>${pautaHtml}</ul><a class="btn-link btn" href="#noticias" style="margin-top:14px">Ver mais notícias</a></aside>
    </div>
  </div>
</section>

<!-- 12 TRAJETÓRIA -->
<section class="traj" id="trajetoria">
  <div class="wrap">
    <div class="traj-lado" data-reveal>
      <div class="traj-foto"><img src="assets/oficial-inteiro.webp" alt="Flávio Bolsonaro" loading="lazy"></div>
      <div class="traj-sel"><span class="eyebrow on-dark">Biografia oficial</span><h2 style="font-size:var(--t-h3);margin-top:10px">Da Academia Militar às urnas do Rio, do Rio ao Senado Federal.</h2></div>
    </div>
    <div>
      <div data-reveal><h2>Uma trajetória escrita <em class="hl">em movimento.</em></h2></div>${capsHtml}
      <p class="lead" style="margin-top:34px;font-weight:800" data-reveal>Por isso, vem com Flávio Bolsonaro! O Brasil vai vencer!</p>
    </div>
  </div>
</section>

<!-- 13 SENADO -->
<section class="senado" id="senado">
  <div class="wrap">
    <div data-reveal><span class="eyebrow">Senadores da direita</span><h2 style="margin-top:14px">Senado forte, <em>Brasil forte.</em></h2><p class="lead" style="margin-top:16px;color:var(--cinza-700)">Precisamos de um Congresso de direita para mudar o Brasil. Conheça os candidatos ao Senado apoiados por Flávio Bolsonaro, estado por estado.</p></div>
    <div class="uf-grid">${ufHtml}</div>
  </div>
</section>

<!-- 14 JINGLES -->
<section class="multi" id="multimidia">
  <div class="wrap">
    <div class="multi-top">
      <div data-reveal><span class="eyebrow on-dark">Conteúdo multimídia</span><h2 style="margin-top:14px">Jingles para <em class="hl">compartilhar.</em></h2><p class="lead" style="margin-top:12px;color:var(--texto-inverso-suave)">Ouça quando quiser e baixe para compartilhar. (Prévia visual do player.)</p></div>
      <span class="chip on-dark" data-reveal>Modo carreata</span>
    </div>
    <div class="jingles">${jgHtml}
    </div>
  </div>
</section>

<!-- 15 MATERIAIS -->
<section class="mat" id="materiais">
  <div class="wrap">
    <div data-reveal><span class="eyebrow">Kit de campanha</span><h2 style="margin-top:14px">Materiais para <em>compartilhar.</em></h2><p class="lead" style="margin-top:16px;color:var(--cinza-500)">Tudo pronto para levar a campanha mais longe. Escolha, clique e baixe.</p></div>
    <div class="mat-grid">${matHtml}
    </div>
  </div>
</section>

<!-- 16 FAQ -->
<section class="faq" id="faq">
  <div class="wrap">
    <div data-reveal><span class="eyebrow">Dúvidas</span><h2 style="margin-top:14px">Perguntas <em>frequentes.</em></h2></div>
    <div class="acc" data-reveal>${faqHtml}</div>
  </div>
</section>

<!-- 17 PARTICIPE -->
<section class="mob" id="participe">
  <div class="wrap">
    <div data-reveal>
      <span class="eyebrow" style="color:var(--azul-800)">Mobilização oficial</span>
      <h2 style="margin-top:14px">Se você também acredita, <br>vem de Zap!</h2>
      <p class="lead">Não precisa de palanque nem de microfone. Precisa de você no grupo da sua cidade. Lá dentro você recebe em primeira mão o que a campanha vai fazer e ajuda a espalhar a verdade para o seu bairro. É de graça, é rápido.</p>
      <a class="btn btn-zap" href="#participe" data-magnetic>${ZAP}Entrar no BolsoZap</a>
      <div class="passos">
        <div class="passo" data-reveal><b>1</b>Entre no BolsoZap</div>
        <div class="passo" data-reveal><b>2</b>Baixe e compartilhe os materiais</div>
      </div>
    </div>
    <form class="form" id="form" data-reveal novalidate>
      <h3>A agenda no seu e-mail</h3>
      <p class="s">Conceito de redesign: nenhum dado é enviado ou guardado.</p>
      <label class="sr" for="em">Seu e-mail</label>
      <input class="campo" id="em" type="email" placeholder="seu@email.com" autocomplete="email">
      <label class="consent"><input type="checkbox" id="ck"><span>Autorizo o tratamento do meu e-mail para receber a agenda e as comunicações oficiais da campanha, e sei que posso cancelar a qualquer momento.</span></label>
      <button class="btn btn-primario" type="submit" data-magnetic>Quero receber</button>
      <div class="res" id="res" role="status" aria-live="polite"></div>
    </form>
  </div>
</section>
</main>

<footer class="rod">
  <div class="marq" aria-hidden="true">${marq(marqTxt)}</div>
  <div class="wrap">
    <div><h4>Flávio Bolsonaro</h4><p>Estudo de redesign interativo, produzido pela Connect Alpha a partir de materiais públicos do site oficial.</p><span class="selo">Conceito · não é o site oficial</span></div>
    <div><h4>Navegar</h4><a href="#propostas">Propostas</a><a href="#plano">Plano por tema</a><a href="#agenda">Agenda</a><a href="#tv">TV Celular</a><a href="#trajetoria">Trajetória</a></div>
    <div><h4>Oficial</h4><a href="https://www.flaviobolsonaro.com.br/" target="_blank" rel="noopener">Site oficial</a><a href="https://www.flaviobolsonaro.com.br/participe" target="_blank" rel="noopener">Participe</a><a href="https://www.flaviobolsonaro.com.br/contribua" target="_blank" rel="noopener">Contribua</a></div>
    <div><h4>Estudo</h4><a href="design-system.html">Design system</a><span>Connect Alpha</span></div>
    <div class="fim"><span>Imagens, textos e marca pertencem à campanha. Este é um estudo de design, sem vínculo, endosso ou autorização da campanha.</span><span>Estudo criado pela Connect Alpha</span></div>
  </div>
</footer>

<a class="zap-fix" href="#participe" aria-label="Entrar no grupo do WhatsApp">${ZAP}</a>
<div class="cookie" id="cookie" role="dialog" aria-label="Cookies"><span>Usamos só cookies necessários neste estudo.</span><button type="button" id="ck-ok">Entendi</button><button type="button" class="al" id="ck-no">Recusar</button></div>

<script>window.__TEMAS__=${temasJson};</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="assets/js/app.js"></script>
<noscript><style>.anim [data-reveal]{opacity:1!important;transform:none!important}.pre{display:none}</style></noscript>
</body>
</html>
`;
fs.writeFileSync(__dirname + '/index.html', html);
console.log('index.html', html.length, 'bytes');
