/**
 * fleet.js: Fastfetch Specifications & Interactive Snowflake Animation
 */

const hostData = {
    junixos: {
        user: "julian",
        host: "junixos",
        specs: [
            { key: "OS", val: "NixOS (x86_64)" },
            { key: "Host", val: "Desktop Workstation" },
            { key: "Kernel", val: "Linux (CachyOS)" },
            { key: "Shell", val: "zsh" },
            { key: "WM", val: "Hyprland (Wayland)", accent: true },
            { key: "Terminal", val: "kitty" },
            { key: "Font", val: "FiraCode Nerd Font" },
            { key: "Theme", val: "gruvbox-dark-gtk" },
            { key: "Cursor", val: "BreezeX-RosePine-Linux" },
            { key: "CPU", val: "Intel Core i5-13600KF" },
            { key: "GPU", val: "AMD Radeon RX 9070" }
        ]
    },
    junixbook: {
        user: "julian",
        host: "junixbook",
        specs: [
            { key: "OS", val: "NixOS (x86_64)" },
            { key: "Host", val: "Portable Laptop" },
            { key: "Kernel", val: "Linux (Latest)" },
            { key: "Shell", val: "zsh" },
            { key: "WM", val: "Hyprland (Wayland)", accent: true },
            { key: "Terminal", val: "kitty" },
            { key: "Font", val: "FiraCode Nerd Font" },
            { key: "Theme", val: "gruvbox-dark-gtk" },
            { key: "CPU", val: "10th Gen Intel Core i5 (Mobile)" },
            { key: "GPU", val: "Intel UHD Graphics" },
            { key: "Config", val: "Shared Flake Baseline" }
        ]
    }
};

function renderHostSpecs(hostKey) {
    const data = hostData[hostKey];
    const container = document.getElementById('specs-container');
    if (!data || !container) return;

    let html = `
        <div class="fetch-header">${data.user}@${data.host}</div>
        <div class="fetch-divider">-----------------------------</div>
    `;

    data.specs.forEach(item => {
        const accentClass = item.accent ? ' accent' : '';
        html += `<div class="spec-line"><span class="spec-key">${item.key}:</span><span class="spec-val${accentClass}">${item.val}</span></div>`;
    });

    html += `
        <div class="fetch-palette" aria-hidden="true">
            <span class="palette-block" style="background:#282828"></span>
            <span class="palette-block" style="background:#fb4934"></span>
            <span class="palette-block" style="background:#b8bb26"></span>
            <span class="palette-block" style="background:#fabd2f"></span>
            <span class="palette-block" style="background:#83a598"></span>
            <span class="palette-block" style="background:#d3869b"></span>
            <span class="palette-block" style="background:#8ec07c"></span>
            <span class="palette-block" style="background:#ebdbb2"></span>
        </div>
    `;

    container.innerHTML = html;
}

function switchHost(host) {
    renderHostSpecs(host);
    const isJunixos = host === 'junixos';
    const tabJunixos = document.getElementById('tab-junixos');
    const tabJunixbook = document.getElementById('tab-junixbook');

    if (tabJunixos) {
        tabJunixos.classList.toggle('active', isJunixos);
        tabJunixos.setAttribute('aria-selected', isJunixos ? 'true' : 'false');
    }
    if (tabJunixbook) {
        tabJunixbook.classList.toggle('active', !isJunixos);
        tabJunixbook.setAttribute('aria-selected', isJunixos ? 'false' : 'true');
    }
}

// Snowflake Easter Egg Quotes & Particle Effects
const quotes = [
    `<svg class="svg-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 1v14M1 8h14M3 3l10 10M3 13L13 3M6 2l2 2 2-2M2 6l2 2-2 2M10 14l-2-2-2 2M14 10l-2-2 2-2"/></svg> Purity check: 100% pure`,
    `<svg class="svg-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6.5" width="10" height="8" rx="1.5"/><path d="M5 6.5V4a3 3 0 0 1 6 0v2.5"/></svg> flake.lock verified & clean`,
    `<svg class="svg-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5.5" cy="6" r="3"/><line x1="8" y1="8" x2="13.5" y2="13.5"/><line x1="11" y1="11" x2="13" y2="9"/><line x1="12" y1="12" x2="14" y2="10.5"/></svg> sops-nix secrets management enabled`,
    `<svg class="svg-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.5 14.5h-9a1.5 1.5 0 0 1-1.5-1.5v-10A1.5 1.5 0 0 1 3.5 1.5h7l3.5 3.5v8a1.5 1.5 0 0 1-1.5 1.5z"/><rect x="5" y="1.5" width="6" height="4" rx="0.5"/><rect x="4.5" y="9.5" width="7" height="5" rx="0.5"/></svg> Automated BorgBackup to USB drive active`,
    `<svg class="svg-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 1.5C9.5 1.5 14 2 14.5 6.5C14.5 10.5 10 14 7 14.5L5.5 10.5L1.5 9C2 6 5.5 1.5 9.5 1.5Z"/><circle cx="10" cy="6" r="1.5" fill="currentColor"/><path d="M1.5 14.5l3-3"/></svg> CachyOS kernel optimizations active`,
    `<svg class="svg-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 1.5L2 4v4.5c0 4 3 6.5 6 7.5 3-1 6-3.5 6-7.5V4L8 1.5z"/></svg> zapret DPI bypass active`,
    `<svg class="svg-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 1.5L14.5 5v6L8 14.5 1.5 11V5L8 1.5z"/><polyline points="1.5 5 8 8.5 14.5 5"/><line x1="8" y1="8.5" x2="8" y2="14.5"/></svg> Works on my machine? Everywhere.`,
    `<svg class="svg-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 11.5l-3.5-3.5a4 4 0 0 0 .5-2 4 4 0 1 0-4 4 4 4 0 0 0 2-.5l3.5 3.5a1 1 0 0 0 1.5 0l0 0a1 1 0 0 0 0-1.5z"/><path d="M2.5 13.5l4-4"/></svg> Declarative all the way down`
];
let quoteIdx = 0;
let cumulativeAngle = 0;
const gruvColors = ['#fabd2f', '#fe8019', '#b8bb26', '#83a598', '#d3869b', '#fb4934'];
const particleChars = ['λ', '✦', '▲', '◆', '⬡', '✻'];

function spawnParticles(x, y) {
    for (let i = 0; i < 16; i++) {
        const p = document.createElement('span');
        p.className = 'particle';
        p.textContent = particleChars[Math.floor(Math.random() * particleChars.length)];
        p.style.color = gruvColors[Math.floor(Math.random() * gruvColors.length)];
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.fontSize = `${Math.random() * 14 + 14}px`;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 120 + 60;
        p.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
        p.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);

        document.body.appendChild(p);
        setTimeout(() => p.remove(), 900);
    }
}

function triggerSnowflakeEgg(event) {
    cumulativeAngle += 360;
    const flakeEl = document.getElementById("snowflake-btn");
    if (flakeEl) {
        flakeEl.style.transform = `rotate(${cumulativeAngle}deg)`;
    }

    const rect = flakeEl ? flakeEl.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
    const posX = (event && typeof event.clientX === 'number' && event.clientX > 0)
        ? event.clientX
        : rect.left + rect.width / 2;
    const posY = (event && typeof event.clientY === 'number' && event.clientY > 0)
        ? event.clientY
        : rect.top + rect.height / 2;
    spawnParticles(posX, posY);

    quoteIdx = (quoteIdx + 1) % quotes.length;
    const quoteEl = document.getElementById("nix-quote");
    if (quoteEl) quoteEl.innerHTML = quotes[quoteIdx];
    if (typeof showToast === 'function') showToast("Evaluated pure flake expression!");
}

