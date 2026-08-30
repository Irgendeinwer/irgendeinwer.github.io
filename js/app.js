/**
 * app.js: Global UI Coordination & App Lifecycle
 */

// Command Switcher (Clone vs Rebuild)
const commands = {
    clone: "git clone https://github.com/Irgendeinwer/NixOS-Dotfiles.git",
    rebuild: "nixos-rebuild switch --flake github:Irgendeinwer/NixOS-Dotfiles#junixos"
};
let activeCmdKey = 'clone';

function switchCmd(key) {
    activeCmdKey = key;
    const cmdDisplay = document.getElementById('cmd-display');
    const btnClone = document.getElementById('btn-tab-clone');
    const btnRebuild = document.getElementById('btn-tab-rebuild');

    if (cmdDisplay) cmdDisplay.innerText = commands[key];
    if (btnClone) btnClone.classList.toggle('active', key === 'clone');
    if (btnRebuild) btnRebuild.classList.toggle('active', key === 'rebuild');
}

function copyCurrentCommand() {
    const cmd = commands[activeCmdKey];
    if (!cmd) return;
    navigator.clipboard.writeText(cmd).then(() => {
        showToast("Copied command to clipboard!");
    }).catch(() => {
        showToast("Failed to copy command");
    });
}

// Toast Notifications
let toastTimeout = null;
function showToast(msg, icon = 'λ') {
    const toast = document.getElementById("toast");
    const msgEl = document.getElementById("toast-msg");
    const iconEl = document.getElementById("toast-icon");
    if (!toast) return;

    if (msgEl) msgEl.textContent = msg;
    if (iconEl) iconEl.innerHTML = icon;

    toast.classList.add("show");
    if (toastTimeout) clearTimeout(toastTimeout);
    
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Restore saved contrast mode
    const savedContrast = localStorage.getItem('gruvbox-contrast');
    if (savedContrast && typeof setContrast === 'function') {
        setContrast(savedContrast);
    }

    // 2. Initialize default fleet tab
    if (typeof switchHost === 'function') {
        switchHost('junixos');
    }

    // 3. Randomize custom namespace silently on initial load
    if (typeof randomizeOptions === 'function') {
        randomizeOptions(true);
    }

    // 4. Fetch latest GitHub commit
    if (typeof fetchLatestCommit === 'function') {
        fetchLatestCommit();
    }

    // 5. Load dynamic tree data from tree.json
    if (typeof loadTreeData === 'function') {
        loadTreeData();
    }
});
