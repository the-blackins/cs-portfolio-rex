(() => {
  const root = document.documentElement;
  root.classList.add('has-js');
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} },
  };
  const themeQuery = matchMedia('(prefers-color-scheme: dark)');
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let cancelIntro = () => {};

  function applyTheme(choice) {
    const theme = choice || (themeQuery.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
      button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    });
  }
  function applyMotion(choice) {
    const reduced = choice === 'reduce' || (!choice && motionQuery.matches);
    root.dataset.motion = reduced ? 'reduce' : 'full';
    document.querySelectorAll('[data-motion-toggle]').forEach(button => {
      button.textContent = reduced ? 'Enable motion' : 'Reduce motion';
      button.setAttribute('aria-label', reduced ? 'Enable motion' : 'Reduce motion');
    });
    if (reduced) { finishTyping(); cancelIntro(); }
  }
  let typing = 0;
  let pending = '';
  let output;
  let announce;
  function finishTyping() {
    if (!typing) return;
    cancelAnimationFrame(typing);
    typing = 0;
    output.textContent = pending;
    announce.textContent = pending;
  }
  function showOutput(text) {
    if (!output) return;
    finishTyping();
    pending = text;
    announce.textContent = '';
    if (root.dataset.motion === 'reduce') { output.textContent = text; announce.textContent = text; return; }
    output.textContent = '';
    const spacer = document.createElement('span');
    spacer.textContent = text;
    spacer.className = 'terminal-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    const visible = document.createElement('span');
    visible.className = 'terminal-reveal';
    visible.setAttribute('aria-hidden', 'true');
    output.append(spacer, visible);
    let start;
    const duration = Math.min(720, Math.max(260, text.length * 2.4));
    function step(now) {
      if (start === undefined) start = now;
      const progress = Math.min(1, (now - start) / duration);
      visible.textContent = text.slice(0, Math.ceil(text.length * progress));
      if (progress < 1) typing = requestAnimationFrame(step);
      else { typing = 0; output.textContent = text; announce.textContent = text; }
    }
    typing = requestAnimationFrame(step);
  }

  applyTheme(store.get('rex-theme'));
  applyMotion(store.get('rex-motion'));
  themeQuery.addEventListener('change', () => { if (!store.get('rex-theme')) applyTheme(); });
  motionQuery.addEventListener('change', () => { if (!store.get('rex-motion')) applyMotion(); });
  document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    store.set('rex-theme', next);
    applyTheme(next);
  }));
  document.querySelectorAll('[data-motion-toggle]').forEach(button => button.addEventListener('click', () => {
    const next = root.dataset.motion === 'reduce' ? 'full' : 'reduce';
    store.set('rex-motion', next);
    applyMotion(next);
  }));

  const menu = document.querySelector('[data-menu]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  if (menu && menuButton) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
    });
    menu.addEventListener('click', event => {
      if (event.target.closest('a')) { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }
    });
  }

  const terminal = document.querySelector('[data-terminal]');
  if (terminal) {
    terminal.hidden = false;
    output = terminal.querySelector('[data-terminal-output]');
    announce = terminal.querySelector('[data-terminal-announce]');
    const form = terminal.querySelector('form');
    const input = form.querySelector('input');
    const current = terminal.querySelector('[data-current-command]');
    const history = [];
    let historyIndex = 0;
    const profile = 'Ndukwu Tochukwu Rex\nJunior SOC Analyst / Systems administration / IAM\n\nCompTIA Security+  certified\nISC2 CC            certified\n\nLagos, Nigeria';
    const urls = {
      wazuh: '/work/wazuh-endpoint-monitoring/index.html',
      jml: '/work/identity-lifecycle-management/index.html',
      research: '/work/attack-surface-vulnerability-research/index.html',
    };
    const commands = ['help', 'whoami', 'projects', 'ls projects', 'open wazuh', 'open jml', 'open research', 'certs', 'about', 'contact', 'resume', 'theme', 'theme light', 'theme dark', 'clear'];
    function links(items) {
      const list = terminal.querySelector('[data-terminal-links]');
      list.replaceChildren();
      items.forEach(({ label, href, download }) => {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = label;
        if (download) link.download = '';
        list.append(link);
      });
    }
    function run(value) {
      const command = value.trim().toLowerCase().replace(/\s+/g, ' ');
      if (!command) return;
      history.push(command);
      if (history.length > 50) history.shift();
      historyIndex = history.length;
      current.textContent = command;
      input.value = '';
      links([]);
      terminal.querySelectorAll('[data-command]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.command === command)));
      switch (command) {
        case 'help': showOutput('PORTFOLIO COMMANDS\n\nwhoami   Candidate profile\nprojects Case-study index\nopen wazuh / open jml / open research\ncerts    Credentials\nabout    Background\ncontact  Email and LinkedIn\nresume   Updated CV\ntheme    Switch appearance\nclear    Clear response'); break;
        case 'whoami': showOutput(profile); break;
        case 'projects': case 'ls projects':
          showOutput('01  Wazuh endpoint monitoring — lab\n02  Identity lifecycle — home lab\n03  Vulnerability research — training assessment');
          links([{ label: 'Open Wazuh case study ↗', href: urls.wazuh }, { label: 'Open identity case study ↗', href: urls.jml }, { label: 'Open research assessment ↗', href: urls.research }]); break;
        case 'open wazuh': case 'open jml': case 'open research': {
          const project = command.slice(5);
          window.location.assign(urls[project]); break;
        }
        case 'certs': showOutput('CERTIFICATIONS\n\nCompTIA Security+ — completed\nISC2 Certified in Cybersecurity — completed\n\nIN PROGRESS\nMicrosoft AZ-104 — expected Q1 2027'); links([{ label: 'View credentials ↗', href: '/#training' }]); break;
        case 'about': showOutput('Background in cybersecurity training, lab work, and first-line support.'); links([{ label: 'Read about Rex ↗', href: '/#about' }]); break;
        case 'contact': showOutput('Interested in Junior SOC and systems administration / IAM opportunities.'); links([{ label: 'Contact Rex ↗', href: '/contact/index.html' }, { label: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/rex-ndukwu-476662276/?isSelfProfile=false' }]); break;
        case 'resume': showOutput('Updated résumé (PDF).'); links([{ label: 'Download résumé ↘', href: '/assets/Rex_Ndukwu_Resume.pdf', download: true }]); break;
        case 'theme': case 'theme light': case 'theme dark': {
          const chosen = command === 'theme' ? (root.dataset.theme === 'dark' ? 'light' : 'dark') : command.slice(6);
          store.set('rex-theme', chosen); applyTheme(chosen); showOutput(`Appearance set to ${chosen}.`); break;
        }
        case 'clear': finishTyping(); pending = ''; output.textContent = ''; announce.textContent = 'Terminal cleared.'; current.textContent = ''; break;
        default: showOutput('Command not found. Type help or use the links below.'); links([{ label: 'Explore work ↗', href: '/#work' }]);
      }
    }
    form.addEventListener('submit', event => { event.preventDefault(); run(input.value); });
    terminal.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => run(button.dataset.command)));
    input.addEventListener('keydown', event => {
      if (event.key === 'ArrowUp') { event.preventDefault(); historyIndex = Math.max(0, historyIndex - 1); input.value = history[historyIndex] || ''; }
      else if (event.key === 'ArrowDown') { event.preventDefault(); historyIndex = Math.min(history.length, historyIndex + 1); input.value = history[historyIndex] || ''; }
      else if (event.key === 'Tab' && input.value) {
        const matches = commands.filter(candidate => candidate.startsWith(input.value.trim().toLowerCase()));
        if (matches.length === 1) { event.preventDefault(); input.value = matches[0]; }
      }
    });
  }

  // The opening scene is independent of the interactive homepage terminal.
  const scene = document.querySelector('[data-intro-scene]');
  const replayIntro = document.querySelector('[data-replay-intro]');
  if (scene && typeof scene.showModal === 'function') {
    const commands = scene.querySelector('[data-intro-commands]');
    const progress = scene.querySelector('[data-intro-progress]');
    let timers = [];
    let frame = 0;
    let returnFocus;
    function clearSequence() {
      timers.forEach(clearTimeout);
      timers = [];
      cancelAnimationFrame(frame);
      frame = 0;
    }
    function closeScene() {
      clearSequence();
      if (!scene.open) return;
      scene.close();
      scene.dataset.state = 'ready';
      root.classList.remove('intro-active');
      returnFocus?.focus({ preventScroll: true });
    }
    function finishScene() {
      clearSequence();
      scene.dataset.state = 'leaving';
      timers.push(setTimeout(closeScene, 280));
    }
    function typeCommand(index, command, response) {
      commands.querySelector('.intro-cursor')?.remove();
      const row = document.createElement('div');
      row.className = 'intro-row';
      const prompt = document.createElement('div');
      prompt.className = 'intro-command';
      const sign = document.createElement('span');
      sign.className = 'intro-sign';
      sign.textContent = '$';
      const text = document.createElement('span');
      const cursor = document.createElement('span');
      cursor.className = 'intro-cursor';
      cursor.textContent = '/';
      const result = document.createElement('div');
      result.className = 'intro-response';
      result.textContent = response;
      prompt.append(sign, text, cursor);
      row.append(prompt, result);
      commands.append(row);
      progress.textContent = `0${index + 1} / 03`;
      let start;
      function step(now) {
        if (!scene.open) return;
        if (start === undefined) start = now;
        const amount = Math.min(1, (now - start) / 380);
        text.textContent = command.slice(0, Math.ceil(command.length * amount));
        if (amount < 1) frame = requestAnimationFrame(step);
        else { frame = 0; row.classList.add('is-complete'); }
      }
      frame = requestAnimationFrame(step);
    }
    function startScene(replay = false) {
      if (root.dataset.motion === 'reduce' || motionQuery.matches) return;
      clearSequence();
      returnFocus = replay ? replayIntro : document.querySelector('#main');
      commands.replaceChildren();
      scene.dataset.state = 'running';
      scene.showModal();
      root.classList.add('intro-active');
      try { sessionStorage.setItem('rex-intro-seen', '1'); } catch {}
      const stages = [
        ['auth --public', 'Public access · no sign-in required'],
        ['evidence --index', '03 case studies · labs & research'],
        ['portfolio --open', 'Portfolio ready. Welcome.'],
      ];
      typeCommand(0, ...stages[0]);
      stages.slice(1).forEach((stage, index) => timers.push(setTimeout(() => typeCommand(index + 1, ...stage), (index + 1) * 950)));
      timers.push(setTimeout(finishScene, 3050));
    }
    scene.querySelector('[data-skip-intro]').addEventListener('click', closeScene);
    scene.addEventListener('cancel', event => { event.preventDefault(); closeScene(); });
    replayIntro?.addEventListener('click', () => startScene(true));
    cancelIntro = closeScene;
    motionQuery.addEventListener('change', () => { if (motionQuery.matches) closeScene(); });
    window.addEventListener('pagehide', closeScene);
    let seen = false;
    try { seen = sessionStorage.getItem('rex-intro-seen') === '1'; } catch {}
    if (!seen && !location.hash) startScene();
  } else if (replayIntro) replayIntro.hidden = true;

  const contactPage = document.querySelector('[data-contact-page]');
  if (contactPage) {
    const email = 'rextochi4@gmail.com';
    const subjects = {
      wazuh: { context: 'Wazuh endpoint monitoring lab', subject: 'Wazuh lab project' },
      identity: { context: 'Identity lifecycle / IAM home lab', subject: 'Identity lifecycle lab' },
      research: { context: 'Vulnerability research assessment', subject: 'Vulnerability research assessment' },
    };
    const key = new URLSearchParams(location.search).get('project');
    const chosen = subjects[key] || { context: 'General enquiry', subject: 'Rex Ndukwu portfolio enquiry' };
    contactPage.querySelector('[data-contact-context]').textContent = chosen.context;
    contactPage.querySelector('[data-contact-subject]').textContent = chosen.subject;
    contactPage.querySelector('[data-contact-gmail]').href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(chosen.subject)}`;
    contactPage.querySelector('[data-contact-outlook]').href = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(email)}&subject=${encodeURIComponent(chosen.subject)}`;
    const copyButton = contactPage.querySelector('[data-copy-email]');
    const emailText = contactPage.querySelector('[data-contact-email]');
    const status = contactPage.querySelector('[data-copy-status]');
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(email);
        status.textContent = 'Email address copied. Paste it into your preferred email service.';
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(emailText);
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = 'The address is selected. Copy it with Ctrl+C or your device’s Copy action.';
      }
    });
  }

  const viewer = document.querySelector('[data-viewer]');
  if (viewer && typeof viewer.showModal === 'function') {
    let origin;
    document.querySelectorAll('[data-evidence]').forEach(button => button.addEventListener('click', event => {
      event.preventDefault();
      origin = button;
      const img = viewer.querySelector('img');
      img.src = button.dataset.src;
      img.alt = button.dataset.alt;
      viewer.querySelector('[data-viewer-caption]').textContent = button.dataset.caption;
      viewer.showModal();
    }));
    viewer.querySelector('[data-viewer-close]').addEventListener('click', () => viewer.close());
    viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
    viewer.addEventListener('close', () => { if (origin) origin.focus(); viewer.querySelector('img').removeAttribute('src'); });
  }

  const processTabs = document.querySelectorAll('[data-stage]');
  const processDetail = document.querySelector('[data-stage-detail]');
  if (processTabs.length && processDetail) {
    const descriptions = {
      joiner: 'Accounts were provisioned and access was assigned through Active Directory security groups.',
      mover: 'Group membership was updated for role transfers, with access reviewed for privilege creep.',
      leaver: 'PowerShell supported offboarding tasks and same-day deprovisioning in the simulated process.',
    };
    processTabs.forEach(button => button.addEventListener('click', () => {
      processTabs.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      processDetail.textContent = descriptions[button.dataset.stage];
    }));
  }

  if ('IntersectionObserver' in window && root.dataset.motion !== 'reduce') {
    root.classList.add('reveal-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  } else document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
})();
