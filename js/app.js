const $ = (selector, root = document) => root.querySelector(selector);

const form = $('#searchForm');
const input = $('#username');
const searchButton = $('#searchButton');
const searchLabel = $('.btn-label', searchButton);
const statusBox = $('#status');
const result = $('#result');
const skeleton = $('#skeleton');
const analysisButton = $('#analysisButton');
const analysisContent = $('#analysisContent');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ROLE_NAMES = {
  ST: 'Delantero',
  CM: 'Mediocampo',
  DF: 'Defensa',
  GK: 'Portero'
};

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00add8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Dart: '#00b4ab',
  Vue: '#41b883',
  Jupyter: '#da5b0b',
  'Jupyter Notebook': '#da5b0b',
  Lua: '#000080',
  Haskell: '#5e5086',
  Elixir: '#6e4a7e',
  Zig: '#ec915c'
};

const clamp = value => Math.max(35, Math.min(99, Math.round(value)));

function formatCount(value) {
  const number = Number(value) || 0;
  if (number >= 1000000) return `${(number / 1000000).toFixed(1).replace('.0', '')}M`;
  if (number >= 1000) return `${(number / 1000).toFixed(1).replace('.0', '')}k`;
  return String(number);
}

function ratingFor(user, repos) {
  const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const forks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const followers = user.followers || 0;
  const activity = Math.min(99, Math.log10((user.public_repos || 0) + 1) * 23 + Math.min(30, repos.length * 2));
  const impact = Math.min(99, Math.log10(stars + 1) * 25 + Math.log10(followers + 1) * 10);

  return {
    PAC: clamp(45 + activity * 0.48),
    DRI: clamp(42 + Math.log10(forks + 1) * 20 + Math.min(20, repos.length)),
    SHO: clamp(42 + impact * 0.47),
    DEF: clamp(45 + Math.min(42, (user.following || 0) * 0.15) + Math.min(12, (user.public_gists || 0) * 0.4)),
    PAS: clamp(46 + Math.min(38, Math.log10(followers + 1) * 15) + Math.min(12, activity * 0.12)),
    PHY: clamp(48 + Math.min(35, (user.public_repos || 0) * 0.8) + Math.min(12, Math.log10(stars + 1) * 4))
  };
}

function roleFor(stats) {
  if (stats.SHO >= stats.PAS && stats.SHO >= stats.DEF) return 'ST';
  if (stats.PAS >= stats.DRI && stats.PAS >= stats.DEF) return 'CM';
  if (stats.DEF >= stats.PHY) return 'DF';
  return 'GK';
}

function makeRepositorySummary(repos) {
  const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))];
  const descriptions = repos.map(repo => repo.description).filter(Boolean);
  const topics = [...new Set(repos.flatMap(repo => repo.topics || []))];
  const evidence = repos.slice(0, 2).map(repo => repo.name);

  if (!repos.length) return 'Todavía no hay repositorios públicos recientes suficientes para describir sus intereses de desarrollo.';

  let focus;
  if (topics.length) focus = topics.slice(0, 3).join(', ');
  else if (languages.length) focus = `proyectos desarrollados principalmente con ${languages.slice(0, 3).join(' y ')}`;
  else if (descriptions.length) focus = descriptions[0].replace(/[.!?].*$/, '');
  else focus = 'proyectos personales y experimentación';

  let text = `Sus repositorios públicos sugieren interés por ${focus}.`;
  if (languages.length > 1) text += ` También explora varias tecnologías, entre ellas ${languages.slice(0, 3).join(', ')}.`;
  if (evidence.length) text += ` Entre sus proyectos recientes están ${evidence.join(' y ')}.`;
  if (descriptions.length) text += ` Sus descripciones destacan temas como: “${descriptions[0]}”.`;
  return text;
}

/* ------------------------------ Render ---------------------------------- */

let statBars = [];

function renderStats(stats) {
  const host = $('#stats');
  host.replaceChildren();
  statBars = [];

  Object.entries(stats).forEach(([key, value]) => {
    const stat = document.createElement('div');
    stat.className = 'stat';

    const label = document.createElement('span');
    label.textContent = key;

    const track = document.createElement('div');
    track.className = 'track';

    const bar = document.createElement('i');
    bar.dataset.value = value;
    track.append(bar);

    const score = document.createElement('strong');
    score.textContent = value;

    stat.append(label, track, score);
    host.append(stat);
    statBars.push(bar);
  });
}

function animateStats() {
  statBars.forEach((bar, index) => {
    const delay = reduceMotion ? 0 : index * 70;
    window.setTimeout(() => {
      bar.style.width = `${bar.dataset.value}%`;
    }, delay);
  });
}

function renderRepos(repos) {
  const host = $('#repos');
  host.replaceChildren();
  $('#repoCount').textContent = `${repos.length} ${repos.length === 1 ? 'mostrado' : 'mostrados'}`;

  if (!repos.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'Este usuario no tiene repositorios públicos para mostrar.';
    host.append(empty);
    return;
  }

  repos.forEach(repo => {
    const link = document.createElement('a');
    link.className = 'repo';
    link.href = repo.html_url;
    link.target = '_blank';
    link.rel = 'noopener';

    const top = document.createElement('div');
    top.className = 'repo-top';

    const name = document.createElement('span');
    name.className = 'repo-name';
    name.textContent = repo.name;

    const stars = document.createElement('span');
    stars.className = 'repo-stars';
    stars.textContent = `★ ${formatCount(repo.stargazers_count)}`;
    stars.title = `${repo.stargazers_count} estrellas`;

    top.append(name, stars);

    const description = document.createElement('p');
    description.textContent = repo.description || 'Sin descripción';

    const foot = document.createElement('div');
    foot.className = 'repo-foot';

    const language = document.createElement('span');
    language.className = 'lang';
    const dot = document.createElement('i');
    dot.style.background = LANGUAGE_COLORS[repo.language] || 'var(--muted-2)';
    language.append(dot, document.createTextNode(repo.language || 'Sin lenguaje'));

    const forks = document.createElement('span');
    forks.textContent = `⑂ ${formatCount(repo.forks_count)} forks`;
    forks.title = `${repo.forks_count} forks`;

    foot.append(language, forks);
    link.append(top, description, foot);
    host.append(link);
  });
}

function renderMeta(user) {
  const meta = $('#meta');
  meta.replaceChildren();

  [
    ['repos', user.public_repos],
    ['seguidores', user.followers],
    ['gists', user.public_gists]
  ].forEach(([label, value]) => {
    const pill = document.createElement('span');
    const strong = document.createElement('b');
    strong.textContent = formatCount(value);
    pill.append(strong, document.createTextNode(` ${label}`));
    meta.append(pill);
  });
}

function renderIntroMeta(user) {
  const host = $('#introMeta');
  host.replaceChildren();

  [
    `${formatCount(user.public_repos)} repositorios`,
    `${formatCount(user.followers)} seguidores`
  ].forEach(text => {
    const pill = document.createElement('span');
    pill.textContent = text;
    host.append(pill);
  });
}

function renderResult(user, repos) {
  const stats = ratingFor(user, repos);
  const overall = Math.round(Object.values(stats).reduce((sum, value) => sum + value, 0) / 6);

  const introAvatar = $('#introAvatar');
  introAvatar.src = user.avatar_url;
  introAvatar.alt = `Avatar de ${user.login}`;

  $('#introName').textContent = user.name || user.login;
  $('#introHandle').textContent = `@${user.login}`;
  $('#introBio').textContent = makeRepositorySummary(repos);
  renderIntroMeta(user);

  const avatar = $('#avatar');
  avatar.src = user.avatar_url;
  avatar.alt = `Avatar de ${user.login}`;

  $('#playerName').textContent = (user.name || user.login).toUpperCase();
  $('#handle').textContent = `@${user.login}`;

  const overallBox = $('#overall');
  overallBox.replaceChildren(document.createTextNode(overall));
  const overallLabel = document.createElement('small');
  overallLabel.textContent = 'Rating';
  overallBox.append(overallLabel);

  const role = roleFor(stats);
  $('#role').textContent = role;
  $('#roleName').textContent = ROLE_NAMES[role] || 'Rol';
  $('#cardLink').href = user.html_url;

  $('#displayName').textContent = user.name || user.login;
  $('#bio').textContent = user.bio || 'Este jugador todavía no ha añadido una bio.';
  $('#profileLink').href = user.html_url;
  renderMeta(user);

  renderStats(stats);
  renderRepos(repos);

  document.title = `${user.name || user.login} · GitFut Chibi Club`;
}

/* ------------------------------ Estados --------------------------------- */

let requestId = 0;

function setStatus(message, state = '') {
  statusBox.className = `status${state ? ` ${state}` : ''}`;
  statusBox.textContent = message;
}

function setLoading(isLoading) {
  searchButton.disabled = isLoading;
  searchButton.classList.toggle('is-loading', isLoading);
  searchLabel.textContent = isLoading ? 'BUSCANDO' : 'SCOUT';
}

function resetAnalysis() {
  analysisContent.hidden = true;
  analysisButton.hidden = false;
  statBars = [];
}

/* ------------------------------- Scout ---------------------------------- */

async function scout(raw) {
  const username = raw.trim();
  const currentRequest = ++requestId;

  result.classList.remove('visible');
  skeleton.hidden = true;
  resetAnalysis();
  document.title = 'GitFut · Chibi Club';

  if (!username) {
    setStatus('Escribe un nombre de usuario para empezar.', 'error');
    input.focus();
    return;
  }

  setLoading(true);
  setStatus('Consultando perfil y repositorios…', 'loading');
  skeleton.hidden = false;

  try {
    const profileResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: { Accept: 'application/vnd.github+json' }
    });

    if (profileResponse.status === 404) throw new Error(`No encontramos a “${username}”. Revisa el nombre.`);
    if (profileResponse.status === 403) throw new Error('GitHub limitó temporalmente las consultas. Intenta más tarde.');
    if (!profileResponse.ok) throw new Error(`GitHub respondió con el código ${profileResponse.status}.`);

    const user = await profileResponse.json();
    const reposResponse = await fetch(`${user.repos_url}?sort=updated&per_page=4`, {
      headers: { Accept: 'application/vnd.github+json' }
    });

    if (!reposResponse.ok) throw new Error('No pudimos consultar los repositorios de este perfil.');

    const repos = await reposResponse.json();

    // Si el usuario ya lanzó otra búsqueda, descartamos esta respuesta.
    if (currentRequest !== requestId) return;

    renderResult(user, repos);
    skeleton.hidden = true;
    result.classList.add('visible');
    setStatus(`Scouting completo para @${user.login}.`, 'success');

    window.requestAnimationFrame(() => {
      result.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  } catch (error) {
    if (currentRequest !== requestId) return;

    skeleton.hidden = true;
    setStatus(
      error instanceof TypeError
        ? 'No pudimos conectar con GitHub. Revisa tu conexión e inténtalo otra vez.'
        : error.message,
      'error'
    );
  } finally {
    if (currentRequest === requestId) setLoading(false);
  }
}

/* ------------------------------ Eventos --------------------------------- */

form.addEventListener('submit', event => {
  event.preventDefault();
  scout(input.value);
});

document.querySelectorAll('[data-user]').forEach(chip => {
  chip.addEventListener('click', () => {
    input.value = chip.dataset.user;
    scout(chip.dataset.user);
  });
});

analysisButton.addEventListener('click', () => {
  analysisContent.hidden = false;
  analysisButton.hidden = true;
  analysisContent.setAttribute('tabindex', '-1');
  analysisContent.focus({ preventScroll: true });
  animateStats();

  window.requestAnimationFrame(() => {
    analysisContent.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  });
});

input.addEventListener('input', () => {
  if (statusBox.classList.contains('error')) setStatus('');
});
