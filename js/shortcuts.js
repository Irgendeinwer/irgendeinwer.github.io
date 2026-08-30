/**
 * shortcuts.js: Contrast Switcher & Vim Navigation Keybindings
 */

const contrastThemeColors = {
    hard: '#1d2021',
    medium: '#282828',
    soft: '#32302f'
};

function setContrast(mode) {
    document.body.setAttribute('data-contrast', mode);
    document.querySelectorAll('.contrast-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim().toLowerCase() === mode);
    });
    
    const metaTheme = document.getElementById('meta-theme-color');
    if (metaTheme && contrastThemeColors[mode]) {
        metaTheme.setAttribute('content', contrastThemeColors[mode]);
    }

    localStorage.setItem('gruvbox-contrast', mode);
}

function toggleHelpModal() {
    const modal = document.getElementById('help-modal');
    if (modal) modal.classList.toggle('active');
}

// Keybindings Navigation
window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    
    if (e.key === 'j') {
        e.preventDefault();
        window.scrollBy({ top: 160, behavior: 'smooth' });
    }
    if (e.key === 'k') {
        e.preventDefault();
        window.scrollBy({ top: -160, behavior: 'smooth' });
    }
    if (e.key === 'G') {
        e.preventDefault();
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
    if (e.key === 'g' && !e.shiftKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        if (typeof randomizeOptions === 'function') randomizeOptions(false);
    }
    if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        if (typeof triggerSnowflakeEgg === 'function') triggerSnowflakeEgg();
    }
    if (e.key === '1') {
        e.preventDefault();
        if (typeof switchHost === 'function') switchHost('junixos');
    }
    if (e.key === '2') {
        e.preventDefault();
        if (typeof switchHost === 'function') switchHost('junixbook');
    }
    if (e.key === '?' || (e.key === '/' && e.shiftKey) || e.key === 'h') {
        e.preventDefault();
        toggleHelpModal();
    }
    if (e.key === 'Escape') {
        const modal = document.getElementById('help-modal');
        if (modal && modal.classList.contains('active')) {
            e.preventDefault();
            toggleHelpModal();
        }
    }
});
