  import { renderHome }         from './views/home.js';
  import { renderLogin }        from './views/login.js';
  import { renderLogout }       from './views/logout.js';
  import { renderUsers, renderCreateUser, renderEditUser } from './views/users.js';
  import { renderRatings, renderEditRating } from './views/ratings.js';
  import { renderTop }          from './views/top.js';

  const container  = document.getElementById('app');
  const navElement = document.getElementById('main-nav');

  let isAuthenticated = sessionStorage.getItem('auth') === 'true';

  function renderNav() {
    if (!isAuthenticated) {
      navElement.classList.add('hidden');
      navElement.innerHTML = '';
      return;
    }

    navElement.classList.remove('hidden');
    navElement.innerHTML = `
      <a href="#home">Home</a>
      <a href="#users">Users</a>
      <a href="#ratings">Ratings</a>
      <a href="#top">Top Students</a>
      <a href="#logout">Logout</a>
    `;
  }

  function onLogin() {
    isAuthenticated = true;
    sessionStorage.setItem('auth', 'true');
    renderNav();
    location.hash = '#home';
  }

  function route() {
    const hash = location.hash || '#home';

    if (!isAuthenticated && hash !== '#login') {
      renderLogin(container, onLogin);
      return;
    }

    switch (true) {
      case hash === '#home' || hash === '':
        renderHome(container);
        break;

      case hash === '#login':
        renderLogin(container, onLogin);
        break;

      case hash === '#logout':
        isAuthenticated = false;
        sessionStorage.setItem('auth', 'false');
        renderNav();
        renderLogout(container);
        break;

      case hash === '#users':
        renderUsers(container);
        break;

      case hash === '#users/create':
        renderCreateUser(container);
        break;

      case hash.startsWith('#users/edit/'):
        {
          const id = location.hash.split('/')[2];
          renderEditUser(container, id);
        }
        break;

      case hash === '#ratings':
        renderRatings(container);
        break;

      case hash.startsWith('#ratings/edit/'):
        {
          const id = location.hash.split('/')[2];
          renderEditRating(container, id);
        }
        break;

      case hash === '#top':
        renderTop(container);
        break;

      default:
        renderHome(container);
        break;
    }
  }

  window.addEventListener('load', () => {
    renderNav();
    route();
  });
  window.addEventListener('hashchange', route);
