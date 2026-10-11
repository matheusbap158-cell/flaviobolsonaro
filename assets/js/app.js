/* Interações do estudo de redesign. GSAP + ScrollTrigger + Lenis (carregados do CDN).
   Sem JS ou com "reduzir movimento": tudo aparece estático. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var temGsap = !!(window.gsap && window.ScrollTrigger);
  var animando = temGsap && !reduzir;
  var lenis = null, mm = null;
  var cena = /[?&]cena=1/.test(location.search);

  /* ---------- contagem regressiva para 25/10/2026 ---------- */
  (function () {
    var alvo = new Date(2026, 9, 25, 0, 0, 0).getTime();
    var d = Math.max(0, Math.ceil((alvo - Date.now()) / 86400000));
    var el = $('#dias'); if (el) el.textContent = d;
  })();

  /* ---------- números estáticos (fallback) ---------- */
  function fmt(n, el) { return el.dataset.fmt ? Math.round(n).toLocaleString('pt-BR') : Math.round(n); }
  $$('[data-count]').forEach(function (b) { b.textContent = fmt(+b.dataset.count, b); });

  /* ---------- palavras para o texto que acende ---------- */
  $$('.split').forEach(function (p) {
    var t = p.textContent.trim().split(/\s+/);
    p.innerHTML = t.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
  });

  /* ---------- acessibilidade ---------- */
  var escala = 100;
  function setEscala(v) { escala = Math.max(80, Math.min(140, v)); root.style.fontSize = escala + '%'; }
  $('#a-mais').addEventListener('click', function () { setEscala(escala + 10); });
  $('#a-menos').addEventListener('click', function () { setEscala(escala - 10); });
  $('#a-hc').addEventListener('click', function (e) { var on = root.classList.toggle('hc'); e.currentTarget.setAttribute('aria-pressed', on); });
  $('#a-pausa').addEventListener('click', function (e) {
    var on = !root.classList.contains('sem-mov');
    root.classList.toggle('sem-mov', on);
    e.currentTarget.setAttribute('aria-pressed', on);
    if (on && temGsap) desligar(); else if (!on) location.reload();
  });
  function desligar() {
    animando = false;
    if (mm) mm.revert();
    ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    if (lenis) { lenis.destroy(); lenis = null; }
    root.classList.remove('anim');
    gsap.set('*', { clearProps: 'transform,opacity,clipPath' });
    $('#pre').style.display = 'none';
  }

  /* ---------- tema do plano (abas) ---------- */
  var T = window.__TEMAS__ || [];
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function mostrarTema(i, animar) {
    var t = T[i]; if (!t) return;
    $$('.tema-btn').forEach(function (b) { b.setAttribute('aria-selected', String(+b.dataset.i === i)); });
    var set = function () {
      $('#tp-n').textContent = pad(i + 1);
      $('#tp-t').textContent = t.t;
      $('#tp-s').textContent = t.s;
      $('#tp-i').textContent = t.i;
      $('#tp-it').innerHTML = t.it.map(function (x) { return '<span>' + x.replace(/</g, '&lt;') + '</span>'; }).join('');
    };
    if (animar && animando) {
      gsap.to('#tema-painel > *:not(.plano-cta)', { opacity: 0, y: 14, duration: .18, stagger: .02, onComplete: function () {
        set();
        gsap.fromTo('#tema-painel > *:not(.plano-cta)', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, stagger: .06, ease: 'power3.out' });
      } });
    } else set();
  }
  $$('.tema-btn').forEach(function (b) { b.addEventListener('click', function () { mostrarTema(+b.dataset.i, true); }); });

  /* ---------- jingles (prévia visual) ---------- */
  $$('.jg').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = !b.classList.contains('on');
      $$('.jg.on').forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
      if (on) { b.classList.add('on'); b.setAttribute('aria-pressed', 'true'); }
    });
  });

  /* ---------- formulário e cookies ---------- */
  $('#form').addEventListener('submit', function (e) {
    e.preventDefault();
    var em = $('#em').value.trim(), ok = $('#ck').checked, r = $('#res');
    if (!/^\S+@\S+\.\S+$/.test(em)) { r.textContent = 'Digite um e-mail válido.'; return; }
    if (!ok) { r.textContent = 'Marque a autorização para continuar.'; return; }
    r.textContent = 'Pronto! (estudo: nada foi enviado)';
  });
  function fechar() { $('#cookie').hidden = true; }
  $('#ck-ok').addEventListener('click', fechar);
  $('#ck-no').addEventListener('click', fechar);

  /* ---------- navegação ativa (nav + pontos) ---------- */
  var ids = $$('.dots a').map(function (a) { return a.getAttribute('href').slice(1); });
  function marcarAtivo() {
    var meio = window.innerHeight * 0.4, atual = ids[0];
    ids.forEach(function (id) {
      var el = document.getElementById(id); if (!el) return;
      if (el.getBoundingClientRect().top <= meio) atual = id;
    });
    $$('.dots a, .nav a').forEach(function (a) { a.classList.toggle('ativo', a.getAttribute('href') === '#' + atual); });
  }
  window.addEventListener('scroll', marcarAtivo, { passive: true });
  marcarAtivo();

  if (!animando) { $('#pre').style.display = 'none'; return; }

  /* ================== COM ANIMAÇÃO ================== */
  root.classList.add('anim');
  gsap.registerPlugin(ScrollTrigger);
  $$('[data-count]').forEach(function (b) { b.textContent = '0'; });
  var seguranca = setTimeout(function () { root.classList.remove('anim'); $('#pre').style.display = 'none'; $$('[data-count]').forEach(function (b) { b.textContent = fmt(+b.dataset.count, b); }); }, 8000);

  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { if (lenis) lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href'); if (id.length < 2) return;
        var alvo = $(id); if (!alvo || !lenis) return;
        e.preventDefault(); lenis.scrollTo(alvo, { offset: -10, duration: 1.6 });
      });
    });
  }

  /* abertura */
  var tl = gsap.timeline({ onComplete: function () {
    clearTimeout(seguranca); $('#pre').style.display = 'none';
    if (lenis) lenis.start();
    iniciar();
    if (cena) rodarCena();
  } });
  tl.from('#pre-logo', { scale: .7, opacity: 0, duration: .8, ease: 'back.out(1.6)' })
    .to('#pre-bar', { scaleX: 1, duration: .7, ease: 'power2.inOut' }, .2)
    .to('#pre', { clipPath: 'polygon(0 0,100% 0,100% 0,0 0)', duration: .9, ease: 'power4.inOut' }, '+=.1')
    .from('.hero-shape', { xPercent: 40, opacity: 0, duration: 1.1, ease: 'power4.out' }, '-=.55')
    .from('.hero-22', { yPercent: 12, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1')
    .from('.hero-foto', { yPercent: 14, opacity: 0, duration: 1.2, ease: 'power4.out' }, '-=1')
    .from('[data-hero-l]', { yPercent: 118, duration: 1, stagger: .12, ease: 'power4.out' }, '-=1')
    .from('[data-hero]', { y: 26, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out' }, '-=.6')
    .from('.glass', { y: 30, opacity: 0, scale: .9, duration: .8, stagger: .12, ease: 'back.out(1.5)' }, '-=.7')
    .from('.topo-bar', { y: -40, opacity: 0, duration: .8, ease: 'power3.out' }, '-=1');

  function iniciar() {
    mm = gsap.matchMedia();

    /* progresso e cabeçalho */
    gsap.to('#prog', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } });
    ScrollTrigger.create({ start: 60, onUpdate: function (s) { $('#topo').classList.toggle('enc', s.scroll() > 60); } });

    /* revelação geral */
    ScrollTrigger.batch('[data-reveal]', { start: 'top 90%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out' }); } });

    /* hero: parallax na rolagem */
    var hs = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero-foto', { yPercent: -8, scale: 1.04, scrollTrigger: hs });
    gsap.to('.hero-shape', { xPercent: 14, scrollTrigger: hs });
    gsap.to('.hero-22', { yPercent: -30, scrollTrigger: hs });
    gsap.to('.glass', { yPercent: -40, scrollTrigger: hs });
    gsap.to('#hero-txt', { yPercent: -16, opacity: .15, scrollTrigger: hs });

    /* hero: parallax com o mouse */
    mm.add('(hover:hover) and (pointer:fine)', function () {
      var camadas = $$('.hero [data-depth]').map(function (el) {
        return { x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }), d: +el.dataset.depth * 26 };
      });
      var h = $('.hero');
      function mover(e) {
        var nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
        camadas.forEach(function (c) { c.x(-nx * c.d); c.y(-ny * c.d); });
      }
      h.addEventListener('mousemove', mover);
      return function () { h.removeEventListener('mousemove', mover); };
    });

    /* manifesto: fixo, 3 frases em sequência */
    mm.add('(min-width:1px)', function () {
      var linhas = $$('.man-line'), n = $('#man-n');
      gsap.set(linhas, { opacity: 0, yPercent: 30 });
      gsap.set(linhas[0], { opacity: 1, yPercent: 0 });
      var t = gsap.timeline({ scrollTrigger: { trigger: '.manifesto', start: 'top top', end: '+=260%', pin: '#man-pin', scrub: .6, anticipatePin: 1 } });
      linhas.forEach(function (l, i) {
        if (i > 0) t.fromTo(l, { opacity: 0, yPercent: 30, scale: .96 }, { opacity: 1, yPercent: 0, scale: 1, duration: 1, ease: 'power2.out' }, '>');
        t.call(function () { n.textContent = '0' + (i + 1); }, null, '<');
        if (i < linhas.length - 1) t.to(l, { opacity: 0, yPercent: -30, duration: 1, ease: 'power2.in' }, '+=.5');
      });
      t.to({}, { duration: .4 });
    });

    /* números */
    $$('[data-count]').forEach(function (b) {
      ScrollTrigger.create({ trigger: b, start: 'top 92%', once: true, onEnter: function () {
        var o = { v: 0 }, alvo = +b.dataset.count;
        gsap.to(o, { v: alvo, duration: 2.2, ease: 'power3.out', onUpdate: function () { b.textContent = fmt(o.v, b); } });
      } });
    });

    /* compromisso: cortina diagonal + palavras acendendo */
    gsap.to('#comp-bg', { clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)', ease: 'none', scrollTrigger: { trigger: '.comp', start: 'top 95%', end: 'top 30%', scrub: true } });
    gsap.set('.split .w', { opacity: .16 });
    $$('.split').forEach(function (p) {
      gsap.to($$('.w', p), { opacity: 1, stagger: .12, ease: 'none', scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 48%', scrub: true } });
    });

    /* propostas: fixa com rolagem horizontal (desktop) */
    mm.add('(min-width:901px)', function () {
      var sec = $('.props'), track = $('#track');
      sec.classList.add('fix');
      var dist = function () { return Math.max(0, track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track).paddingLeft)); };
      gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: .8, invalidateOnRefresh: true, anticipatePin: 1 } });
      gsap.to('#props-bar', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: function () { return '+=' + dist(); }, scrub: .8, invalidateOnRefresh: true } });
      return function () { sec.classList.remove('fix'); };
    });

    /* cards: inclinação 3D */
    mm.add('(hover:hover) and (pointer:fine)', function () {
      var offs = [];
      $$('.tilt').forEach(function (c) {
        var rx = gsap.quickTo(c, 'rotationX', { duration: .5, ease: 'power3' }), ry = gsap.quickTo(c, 'rotationY', { duration: .5, ease: 'power3' });
        function mv(e) { var b = c.getBoundingClientRect(); ry(((e.clientX - b.left) / b.width - .5) * 9); rx(-((e.clientY - b.top) / b.height - .5) * 9); }
        function lv() { rx(0); ry(0); }
        c.style.transformPerspective = 900;
        c.addEventListener('mousemove', mv); c.addEventListener('mouseleave', lv);
        offs.push(function () { c.removeEventListener('mousemove', mv); c.removeEventListener('mouseleave', lv); });
      });
      return function () { offs.forEach(function (f) { f(); }); };
    });

    /* tv: player cresce ao entrar */
    gsap.from('.player', { scale: .86, scrollTrigger: { trigger: '.tv-top', start: 'top 95%', end: 'top 45%', scrub: true } });

    /* trajetória: capítulos acendem */
    $$('.cap').forEach(function (c) {
      gsap.fromTo(c, { opacity: .35 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: c, start: 'top 80%', end: 'top 45%', scrub: true } });
    });

    /* bandeiras: entrada em cascata */
    ScrollTrigger.batch('.uf', { start: 'top 95%', once: true, onEnter: function (b) { gsap.fromTo(b, { opacity: 0, scale: .7, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: .6, stagger: .035, ease: 'back.out(1.6)' }); } });

    /* botões magnéticos + cursor (só desktop com mouse) */
    mm.add('(hover:hover) and (pointer:fine)', function () {
      var curs = $('#cursor'), off = [];
      var cx = gsap.quickTo(curs, 'x', { duration: .25, ease: 'power3' }), cy = gsap.quickTo(curs, 'y', { duration: .25, ease: 'power3' });
      function mv(e) { curs.classList.add('on'); cx(e.clientX); cy(e.clientY); }
      window.addEventListener('mousemove', mv); off.push(function () { window.removeEventListener('mousemove', mv); });
      $$('a,button,[data-magnetic],.card,.uf,.tema-btn').forEach(function (el) {
        var ent = function () { curs.classList.add('big'); }, sai = function () { curs.classList.remove('big'); };
        el.addEventListener('mouseenter', ent); el.addEventListener('mouseleave', sai);
        off.push(function () { el.removeEventListener('mouseenter', ent); el.removeEventListener('mouseleave', sai); });
      });
      $$('[data-magnetic]').forEach(function (b) {
        var x = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
        function m(e) { var r = b.getBoundingClientRect(); x((e.clientX - (r.left + r.width / 2)) * .28); y((e.clientY - (r.top + r.height / 2)) * .4); }
        function l() { x(0); y(0); }
        b.addEventListener('mousemove', m); b.addEventListener('mouseleave', l);
        off.push(function () { b.removeEventListener('mousemove', m); b.removeEventListener('mouseleave', l); });
      });
      return function () { off.forEach(function (f) { f(); }); curs.classList.remove('on'); };
    });

    ScrollTrigger.refresh();
  }

  /* ---------- modo cena (?cena=1): rolagem automática para gravar o vídeo ---------- */
  function rodarCena() {
    if (!lenis) return;
    $('#cookie').hidden = true;
    var passos = [['#manifesto', 2.4, 0.2], ['#compromisso', 6, 2.0], ['#propostas', 2, 0.2], ['#plano', 7, 1.6], ['#elas', 2, 1.4], ['#checagem', 2, 1.2],
                  ['#agenda', 2, 1.2], ['#tv', 2, 1.4], ['#noticias', 2, 1.4], ['#trajetoria', 2, 1.6], ['#senado', 2.2, 1.8], ['#participe', 3, 2.2]];
    var i = 0;
    function prox() {
      if (i >= passos.length) { lenis.scrollTo(0, { duration: 4 }); return; }
      var p = passos[i++];
      lenis.scrollTo($(p[0]), { duration: p[1], offset: 0, lock: true, onComplete: function () { setTimeout(prox, p[2] * 1000); } });
    }
    setTimeout(prox, 2000);
  }
})();
