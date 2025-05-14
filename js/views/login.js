export function renderLogin(container, authCallback) {
  container.innerHTML = `
    <section class="auth-section">
      <h2>Login</h2>
      <form id="login-form" class="auth-form">
        <label>Username
          <input name="username" required>
        </label>
        <label>Password
          <input type="password" name="password" required>
        </label>
        <button type="submit" class="btn">Log In</button>
      </form>
    </section>
  `;

  document.getElementById('login-form').onsubmit = e => {
    e.preventDefault();
    authCallback();
  };
}
