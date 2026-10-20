/* ==========================================================================
   SaaS Dashboard Navigation Application Script
   Features:
   - Responsive Navigation & Sidebar Collapsible Mode
   - Mobile Bottom Tab Bar & Drawer Controller
   - Notification Bell with Red Badge Indicator State Management
   - Keyboard Shortcut (Cmd+K / Ctrl+K / /) Command Palette Modal
   - Team Switcher Dropdown Workspace Management
   - Dark/Light Theme Switching
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. DOM Elements Reference Cache
  // ------------------------------------------------------------------------
  const appContainer = document.getElementById('app');
  const sidebar = document.getElementById('sidebar');
  const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');

  // Team Switcher
  const teamSwitcherBtn = document.getElementById('teamSwitcherBtn');
  const teamDropdownMenu = document.getElementById('teamDropdownMenu');
  const activeTeamName = document.getElementById('activeTeamName');
  const activeTeamPlan = document.getElementById('activeTeamPlan');
  const activeTeamAvatar = document.getElementById('activeTeamAvatar');
  const workspaceWelcomeText = document.getElementById('workspaceWelcomeText');
  const statMRR = document.getElementById('statMRR');
  const statUsers = document.getElementById('statUsers');

  // Notifications
  const notificationBellBtn = document.getElementById('notificationBellBtn');
  const notificationPanel = document.getElementById('notificationPanel');
  const notifBadge = document.getElementById('notifBadge');
  const notifCount = document.getElementById('notifCount');
  const panelUnreadPill = document.getElementById('panelUnreadPill');
  const markAllReadBtn = document.getElementById('markAllReadBtn');
  const clearAllNotifsBtn = document.getElementById('clearAllNotifsBtn');
  const notificationList = document.getElementById('notificationList');

  // Search Command Palette
  const searchCmdBtn = document.getElementById('searchCmdBtn');
  const commandModalOverlay = document.getElementById('commandModalOverlay');
  const commandSearchInput = document.getElementById('commandSearchInput');
  const commandResultsList = document.getElementById('commandResultsList');

  // Theme & Views
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const sunIcon = themeToggleBtn.querySelector('.sun-icon');
  const moonIcon = themeToggleBtn.querySelector('.moon-icon');
  const navItems = document.querySelectorAll('.nav-item');
  const pageViews = document.querySelectorAll('.page-view');

  // Mobile Elements
  const mobileBottomBar = document.getElementById('mobileBottomBar');
  const mobileSearchTabBtn = document.getElementById('mobileSearchTabBtn');
  const mobileNotifTabBtn = document.getElementById('mobileNotifTabBtn');
  const mobileMoreTabBtn = document.getElementById('mobileMoreTabBtn');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
  const closeMobileDrawerBtn = document.getElementById('closeMobileDrawerBtn');
  const mobileTabBadge = document.getElementById('mobileTabBadge');

  // ------------------------------------------------------------------------
  // 2. Sidebar Collapsible State Toggle
  // ------------------------------------------------------------------------
  sidebarCollapseBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    appContainer.classList.toggle('sidebar-collapsed-mode');

    // Rotate toggle icon
    const chevronIcon = sidebarCollapseBtn.querySelector('use');
    if (sidebar.classList.contains('collapsed')) {
      chevronIcon.setAttribute('href', '#icon-chevron-left');
      sidebarCollapseBtn.style.transform = 'rotate(180deg)';
    } else {
      sidebarCollapseBtn.style.transform = 'rotate(0deg)';
    }
  });

  // ------------------------------------------------------------------------
  // 3. Team Switcher Dropdown Controller
  // ------------------------------------------------------------------------
  teamSwitcherBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isShow = teamDropdownMenu.classList.contains('show');
    closeAllDropdowns();
    if (!isShow) {
      teamDropdownMenu.classList.add('show');
      teamSwitcherBtn.setAttribute('aria-expanded', 'true');
    }
  });

  const teamOptions = document.querySelectorAll('.team-option');
  teamOptions.forEach(option => {
    option.addEventListener('click', () => {
      const team = option.getAttribute('data-team');
      const plan = option.getAttribute('data-plan');
      const avatar = option.getAttribute('data-avatar');

      // Update UI active state
      teamOptions.forEach(opt => {
        opt.classList.remove('active');
        opt.querySelector('.team-option-check').style.display = 'none';
      });
      option.classList.add('active');
      option.querySelector('.team-option-check').style.display = 'block';

      // Update active team display
      activeTeamName.textContent = team;
      activeTeamPlan.textContent = plan;
      activeTeamAvatar.textContent = avatar;

      // Update workspace demo data
      if (team === 'Acme Corp') {
        workspaceWelcomeText.textContent = "Welcome back, Sarah! Here is Acme Corp's overview for today.";
        statMRR.textContent = "$128,450";
        statUsers.textContent = "24,892";
      } else if (team === 'Stark Tech') {
        workspaceWelcomeText.textContent = "Welcome back! Stark Tech workspace is operating smoothly.";
        statMRR.textContent = "$64,200";
        statUsers.textContent = "12,140";
      } else {
        workspaceWelcomeText.textContent = "Welcome back! Apex Labs developer project overview.";
        statMRR.textContent = "$4,850";
        statUsers.textContent = "1,280";
      }

      teamDropdownMenu.classList.remove('show');
      teamSwitcherBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // ------------------------------------------------------------------------
  // 4. Notification Bell & Panel Logic
  // ------------------------------------------------------------------------
  let unreadCount = 3;

  function updateNotificationBadgeUI() {
    notifCount.textContent = unreadCount;
    panelUnreadPill.textContent = `${unreadCount} New`;

    if (unreadCount > 0) {
      notifBadge.style.display = 'block';
      notifCount.style.display = 'flex';
      notifBadge.classList.add('pulse');
      if (mobileTabBadge) mobileTabBadge.style.display = 'block';
    } else {
      notifBadge.style.display = 'none';
      notifCount.style.display = 'none';
      panelUnreadPill.textContent = `0 New`;
      notifBadge.classList.remove('pulse');
      if (mobileTabBadge) mobileTabBadge.style.display = 'none';
    }
  }

  notificationBellBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isShow = notificationPanel.classList.contains('show');
    closeAllDropdowns();
    if (!isShow) {
      notificationPanel.classList.add('show');
    }
  });

  // Mark item as read on click
  notificationList.addEventListener('click', (e) => {
    const item = e.target.closest('.notification-item');
    if (item && item.classList.contains('unread')) {
      item.classList.remove('unread');
      unreadCount = Math.max(0, unreadCount - 1);
      updateNotificationBadgeUI();
    }
  });

  // Mark all as read
  markAllReadBtn.addEventListener('click', () => {
    const unreadItems = notificationList.querySelectorAll('.notification-item.unread');
    unreadItems.forEach(item => item.classList.remove('unread'));
    unreadCount = 0;
    updateNotificationBadgeUI();
  });

  // Clear all notifications
  clearAllNotifsBtn.addEventListener('click', () => {
    notificationList.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-dim); font-size: 0.85rem;">No new notifications</div>';
    unreadCount = 0;
    updateNotificationBadgeUI();
  });

  // ------------------------------------------------------------------------
  // 5. Search Command Palette Modal (Cmd+K / Ctrl+K)
  // ------------------------------------------------------------------------
  function openCommandPalette() {
    closeAllDropdowns();
    commandModalOverlay.classList.add('open');
    commandSearchInput.value = '';
    filterCommands('');
    setTimeout(() => commandSearchInput.focus(), 50);
  }

  function closeCommandPalette() {
    commandModalOverlay.classList.remove('open');
  }

  searchCmdBtn.addEventListener('click', openCommandPalette);
  if (mobileSearchTabBtn) {
    mobileSearchTabBtn.addEventListener('click', openCommandPalette);
  }

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // Cmd+K or Ctrl+K or '/'
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (commandModalOverlay.classList.contains('open')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      openCommandPalette();
    } else if (e.key === 'Escape') {
      closeCommandPalette();
      closeAllDropdowns();
      closeMobileDrawer();
    }
  });

  commandModalOverlay.addEventListener('click', (e) => {
    if (e.target === commandModalOverlay) {
      closeCommandPalette();
    }
  });

  // Command Search Input Filtering
  commandSearchInput.addEventListener('input', (e) => {
    filterCommands(e.target.value.trim().toLowerCase());
  });

  function filterCommands(query) {
    const items = commandResultsList.querySelectorAll('.command-item');
    let firstVisible = null;

    items.forEach(item => {
      const label = item.querySelector('.command-item-label').textContent.toLowerCase();
      if (label.includes(query)) {
        item.style.display = 'flex';
        item.classList.remove('selected');
        if (!firstVisible) firstVisible = item;
      } else {
        item.style.display = 'none';
        item.classList.remove('selected');
      }
    });

    if (firstVisible) {
      firstVisible.classList.add('selected');
    }
  }

  // Keyboard Navigation inside Command Palette (ArrowUp, ArrowDown, Enter)
  commandSearchInput.addEventListener('keydown', (e) => {
    const visibleItems = Array.from(commandResultsList.querySelectorAll('.command-item')).filter(i => i.style.display !== 'none');
    if (!visibleItems.length) return;

    let currentIndex = visibleItems.findIndex(i => i.classList.contains('selected'));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex >= 0) visibleItems[currentIndex].classList.remove('selected');
      currentIndex = (currentIndex + 1) % visibleItems.length;
      visibleItems[currentIndex].classList.add('selected');
      visibleItems[currentIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex >= 0) visibleItems[currentIndex].classList.remove('selected');
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      visibleItems[currentIndex].classList.add('selected');
      visibleItems[currentIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentIndex >= 0) {
        executeCommand(visibleItems[currentIndex]);
      }
    }
  });

  // Click on command item
  commandResultsList.addEventListener('click', (e) => {
    const item = e.target.closest('.command-item');
    if (item) {
      executeCommand(item);
    }
  });

  function executeCommand(item) {
    const type = item.getAttribute('data-type');
    const target = item.getAttribute('data-target');

    closeCommandPalette();

    if (type === 'page') {
      switchView(target);
    } else if (type === 'action') {
      if (target === 'toggle-theme') {
        toggleTheme();
      } else if (target === 'switch-team') {
        teamDropdownMenu.classList.add('show');
      } else if (target === 'create-project') {
        alert('Creating new project...');
      }
    }
  }

  // ------------------------------------------------------------------------
  // 6. View Router & Navigation
  // ------------------------------------------------------------------------
  function switchView(viewName) {
    // Hide all views
    pageViews.forEach(view => {
      view.style.display = 'none';
    });

    // Show target view
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.style.display = 'block';
    } else {
      document.getElementById('view-dashboard').style.display = 'block';
    }

    // Update active nav items (Sidebar)
    navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update active mobile bottom bar tab
    const tabBtns = mobileBottomBar.querySelectorAll('.tab-link-btn');
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Attach Sidebar Click Listeners
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const view = item.getAttribute('data-view');
      if (view) {
        e.preventDefault();
        switchView(view);
      }
    });
  });

  // Attach Mobile Bottom Bar Tab Listeners
  const mobileTabBtns = mobileBottomBar.querySelectorAll('.tab-link-btn[data-view]');
  mobileTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      if (view) switchView(view);
    });
  });

  // Mobile Notif Tab Trigger
  if (mobileNotifTabBtn) {
    mobileNotifTabBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationPanel.classList.toggle('show');
    });
  }

  // Mobile More Drawer
  function openMobileDrawer() {
    mobileDrawerOverlay.classList.add('open');
  }

  function closeMobileDrawer() {
    mobileDrawerOverlay.classList.remove('open');
  }

  if (mobileMoreTabBtn) {
    mobileMoreTabBtn.addEventListener('click', openMobileDrawer);
  }
  if (closeMobileDrawerBtn) {
    closeMobileDrawerBtn.addEventListener('click', closeMobileDrawer);
  }
  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === mobileDrawerOverlay) closeMobileDrawer();
    });
  }

  document.querySelectorAll('.mobile-drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      const view = link.getAttribute('data-view');
      if (view) switchView(view);
      closeMobileDrawer();
    });
  });

  // ------------------------------------------------------------------------
  // 7. Dark / Light Theme Toggle Controller
  // ------------------------------------------------------------------------
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);

    if (newTheme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  themeToggleBtn.addEventListener('click', toggleTheme);

  // ------------------------------------------------------------------------
  // 8. Helper Functions
  // ------------------------------------------------------------------------
  function closeAllDropdowns() {
    teamDropdownMenu.classList.remove('show');
    notificationPanel.classList.remove('show');
    teamSwitcherBtn.setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#teamSwitcherBtn') && !e.target.closest('#teamDropdownMenu')) {
      teamDropdownMenu.classList.remove('show');
    }
    if (!e.target.closest('#notificationBellBtn') && !e.target.closest('#notificationPanel') && !e.target.closest('#mobileNotifTabBtn')) {
      notificationPanel.classList.remove('show');
    }
  });

  // Initialize UI state
  updateNotificationBadgeUI();
});



