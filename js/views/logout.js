export function renderLogout(container) {
  container.innerHTML = `
    <section class="message-section">
      <h2>Logged out</h2>
      <p>You have been logged out. <a href="#login">Log in again</a>.</p>
    </section>
  `;
}
