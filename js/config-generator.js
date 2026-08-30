/**
 * config-generator.js: Interactive Custom Namespace Nix Config Builder
 */

const toggleIds = [
    "chk-hyprland", "chk-gaming", "chk-ark",
    "chk-silent", "chk-android", "chk-hotspot",
    "chk-jellyfin", "chk-zapret", "chk-backup", "chk-isolated"
];

function updateLiveConfig() {
    const hypr = document.getElementById("chk-hyprland")?.checked ?? true;
    const gaming = document.getElementById("chk-gaming")?.checked ?? true;
    const ark = document.getElementById("chk-ark")?.checked ?? false;
    const silent = document.getElementById("chk-silent")?.checked ?? false;
    const android = document.getElementById("chk-android")?.checked ?? true;
    const hotspot = document.getElementById("chk-hotspot")?.checked ?? false;
    const jellyfin = document.getElementById("chk-jellyfin")?.checked ?? false;
    const zapret = document.getElementById("chk-zapret")?.checked ?? true;
    const backup = document.getElementById("chk-backup")?.checked ?? true;
    const isolated = document.getElementById("chk-isolated")?.checked ?? false;

    const previewEl = document.getElementById("code-preview");
    if (!previewEl) return;

    const code = 
`<span class="code-nix-comment"># hosts/junixos/configuration.nix snippet</span>
{
  <span class="code-nix-key">custom</span> = {
    <span class="code-nix-key">system</span> = {
      <span class="code-nix-key">kernel</span> = <span class="code-nix-str">"cachyos"</span>;
      <span class="code-nix-key">boot.silent.enable</span> = <span class="code-nix-val">${silent}</span>;
      <span class="code-nix-key">android.enable</span>     = <span class="code-nix-val">${android}</span>;
    };

    <span class="code-nix-key">desktop</span> = {
      <span class="code-nix-key">hyprland.enable</span>    = <span class="code-nix-val">${hypr}</span>;
      <span class="code-nix-key">gaming</span> = {
        <span class="code-nix-key">enable</span>           = <span class="code-nix-val">${gaming}</span>;
        <span class="code-nix-key">arkServer.enable</span> = <span class="code-nix-val">${ark}</span>;
      };
    };

    <span class="code-nix-key">services</span> = {
      <span class="code-nix-key">backup</span> = {
        <span class="code-nix-key">enable</span>             = <span class="code-nix-val">${backup}</span>;
        <span class="code-nix-key">autoTriggerOnPlug</span>  = <span class="code-nix-val">true</span>;
      };
      <span class="code-nix-key">hotspot</span> = {
        <span class="code-nix-key">enable</span>             = <span class="code-nix-val">${hotspot}</span>;
        <span class="code-nix-key">ssid</span>               = <span class="code-nix-str">"6+7"</span>;
      };
      <span class="code-nix-key">jellyfin.enable</span>       = <span class="code-nix-val">${jellyfin}</span>;
      <span class="code-nix-key">zapret.enable</span>         = <span class="code-nix-val">${zapret}</span>;
      <span class="code-nix-key">isolatedGaming.enable</span> = <span class="code-nix-val">${isolated}</span>;
    };
  };
}`;
    previewEl.innerHTML = code;
}

function randomizeOptions(silent = false) {
    toggleIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = Math.random() > 0.45;
    });
    updateLiveConfig();
    if (!silent && typeof showToast === 'function') {
        showToast("Randomized custom namespace!");
    }
}

function copyNixCode() {
    const rawCode = document.getElementById("code-preview")?.innerText;
    if (!rawCode) return;
    navigator.clipboard.writeText(rawCode).then(() => {
        if (typeof showToast === 'function') showToast("Copied Nix configuration snippet!");
    }).catch(() => {
        if (typeof showToast === 'function') showToast("Failed to copy code");
    });
}
