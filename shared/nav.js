/**
 * ImmersivePoint — Navigation Component
 *
 * Renders the sidebar + topbar shell into the page. Call renderNav() once
 * from each module's entry point to inject the shared navigation chrome.
 */

import { getUser, getRole, signOut } from './auth.js';

/* ---- Module Definitions ----------------------------------- */

const MODULES = [
  { id: 'dashboard', label: 'Dashboard',  icon: '▦', href: '/dashboard/' },
  { id: 'spark',     label: 'Spark',      icon: '✦', href: '/spark/' },
  { id: 'passport',  label: 'Passport',   icon: '⦾', href: '/passport/' },
  { id: 'crm',       label: 'CRM',        icon: '☰', href: '/crm/' },
  { id: 'vendors',   label: 'Vendors',    icon: '⌂', href: '/vendors/' },
  { id: 'mobile-ops', label: 'Mobile Ops', icon: '⚙', href: '/mobile-ops/' },
  { id: 'cast',      label: 'Cast Hub',   icon: '◉', href: '/cast/' },
];

/* Friendly labels for topbar titles */
const MODULE_TITLES = {
  dashboard: 'Dashboard',
  spark:     'Spark Discovery',
  passport:  'Career Passport',
  crm:       'Contact Management',
  vendors:   'Vendor Integrations',
  'mobile-ops': 'Mobile Operations',
  cast:      'Cast Hub',
};

/* ---- Render ----------------------------------------------- */

/**
 * Injects the sidebar and topbar into the current page.
 *
 * @param {string} activeModule — one of the module ids above
 */
export async function renderNav(activeModule) {
  const user = await getUser();
  const role = await getRole();

  const userName  = user?.email?.split('@')[0] || 'Guest';
  const userRole  = role || 'user';
  const pageTitle = MODULE_TITLES[activeModule] || 'ImmersivePoint';

  /* ---------- Build sidebar links ---------- */
  const navLinks = MODULES.map(m => {
    const active = m.id === activeModule ? ' active' : '';
    return `
      <a href="${m.href}" class="sidebar-link${active}" data-module="${m.id}">
        <span class="sidebar-link-icon">${m.icon}</span>
        <span class="sidebar-link-label">${m.label}</span>
      </a>`;
  }).join('');

  /* ---------- Inject HTML ------------------- */
  const shell = document.createElement('div');
  shell.className = 'app-layout';
  shell.id = 'ip-app-layout';

  shell.innerHTML = `
    <!-- Sidebar -->
    <nav class="sidebar" id="ip-sidebar" aria-label="Main navigation">
      <div class="sidebar-brand">
        <div class="sidebar-brand-icon" aria-hidden="true"></div>
        <span class="sidebar-brand-text">ImmersivePoint</span>
      </div>

      <div class="sidebar-nav" role="navigation">
        ${navLinks}
      </div>

      <div class="sidebar-footer">
        <button class="btn btn-ghost btn-sm w-full" id="ip-logout-sidebar" title="Sign out">
          ← Sign Out
        </button>
      </div>

      <button class="sidebar-toggle" id="ip-sidebar-toggle" title="Collapse sidebar" aria-label="Toggle sidebar">
        ❮
      </button>
    </nav>

    <!-- Mobile overlay -->
    <div class="sidebar-overlay" id="ip-sidebar-overlay"></div>

    <!-- Topbar -->
    <header class="topbar">
      <div class="flex items-center gap-4">
        <button class="hamburger" id="ip-hamburger" aria-label="Open menu">☰</button>
        <h1 class="topbar-title">${pageTitle}</h1>
      </div>
      <div class="topbar-actions">
        <div class="topbar-user hide-mobile">
          <span>${userName}</span>
          <span class="topbar-user-role">${userRole}</span>
        </div>
        <button class="btn btn-ghost btn-sm" id="ip-logout-topbar" title="Sign out">
          ←
        </button>
      </div>
    </header>

    <!-- Main content slot -->
    <main class="app-main" id="ip-main"></main>
  `;

  /* Move existing body children into the main slot */
  const existingContent = document.createDocumentFragment();
  while (document.body.firstChild) {
    existingContent.appendChild(document.body.firstChild);
  }

  document.body.appendChild(shell);

  const mainSlot = document.getElementById('ip-main');
  mainSlot.appendChild(existingContent);

  /* ---------- Wire up interactions ---------- */
  _bindEvents();
}

/* ---- Event Bindings --------------------------------------- */

function _bindEvents() {
  const sidebar  = document.getElementById('ip-sidebar');
  const overlay  = document.getElementById('ip-sidebar-overlay');
  const layout   = document.getElementById('ip-app-layout');
  const toggle   = document.getElementById('ip-sidebar-toggle');
  const hamburger = document.getElementById('ip-hamburger');

  // Sidebar collapse/expand (desktop)
  if (toggle) {
    toggle.addEventListener('click', () => {
      layout.classList.toggle('sidebar-collapsed');
      const collapsed = layout.classList.contains('sidebar-collapsed');
      toggle.textContent = collapsed ? '❯' : '❮';
      toggle.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
      localStorage.setItem('ip_sidebar_collapsed', collapsed ? '1' : '0');
    });

    // Restore collapsed state
    if (localStorage.getItem('ip_sidebar_collapsed') === '1') {
      layout.classList.add('sidebar-collapsed');
      toggle.textContent = '❯';
      toggle.title = 'Expand sidebar';
    }
  }

  // Hamburger (mobile)
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.add('open');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }

  // Logout buttons
  const logoutHandler = async (e) => {
    e.preventDefault();
    await signOut();
    window.location.href = '/index.html';
  };

  document.getElementById('ip-logout-sidebar')?.addEventListener('click', logoutHandler);
  document.getElementById('ip-logout-topbar')?.addEventListener('click', logoutHandler);

  // Close mobile sidebar on nav link click
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  });

  // Close mobile sidebar on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }
  });
}

export { MODULES, MODULE_TITLES };
