// Shared utilities across all pages

async function loadNavAuth() {
  try {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    const navUser = document.getElementById('nav-user');
    const navDash = document.getElementById('nav-dashboard');
    const navAdmin = document.getElementById('nav-admin');
    const navLogin = document.getElementById('nav-login');
    const navLogout = document.getElementById('nav-logout');

    if (data.loggedIn) {
      if (navUser) navUser.textContent = '👤 ' + data.name;
      if (navDash) navDash.style.display = 'inline';
      if (navLogin) navLogin.style.display = 'none';
      if (navLogout) navLogout.style.display = 'inline';
      if (navAdmin && data.isAdmin) navAdmin.style.display = 'inline';
    } else {
      if (navUser) navUser.textContent = '';
      if (navDash) navDash.style.display = 'none';
      if (navAdmin) navAdmin.style.display = 'none';
      if (navLogout) navLogout.style.display = 'none';
    }
  } catch (e) { /* silent */ }
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/';
}

function showMsg(id, text, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.style.display = 'block';
  el.className = type === 'error' ? 'error-msg' : 'success-msg';
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}

document.addEventListener('DOMContentLoaded', loadNavAuth);
