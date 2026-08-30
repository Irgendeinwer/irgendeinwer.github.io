/**
 * github.js: Live GitHub Latest Commit Fetcher (Safe DOM + Cache + Timeout)
 */

async function fetchLatestCommit() {
    const msgEl = document.getElementById("git-latest-msg");
    const dateEl = document.getElementById("git-latest-date");
    if (!msgEl || !dateEl) return;

    function renderCommit(msg, sha, url, dateStr) {
        const date = new Date(dateStr);
        const formattedDate = isNaN(date.getTime()) 
            ? "Recent" 
            : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = msg;

        const shaSpan = document.createElement("span");
        shaSpan.style.color = "var(--gray)";
        shaSpan.textContent = ` (${sha})`;

        msgEl.replaceChildren(link, shaSpan);
        dateEl.textContent = `${formattedDate} (master)`;
    }

    // 1. Instant render from local cache if present
    const cached = localStorage.getItem("gh-latest-commit");
    if (cached) {
        try {
            const c = JSON.parse(cached);
            renderCommit(c.msg, c.sha, c.url, c.date);
        } catch(e) {}
    }

    // 2. Fetch fresh commit with a 3.5s timeout
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch("https://api.github.com/repos/Irgendeinwer/NixOS-Dotfiles/commits?per_page=1", {
            signal: controller.signal,
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
            const commit = data[0];
            const fullMsg = commit.commit.message.split("\n")[0];
            const shortSha = commit.sha.substring(0, 7);
            const commitUrl = commit.html_url;
            const commitDate = commit.commit.author?.date || commit.commit.committer?.date;

            renderCommit(fullMsg, shortSha, commitUrl, commitDate);
            localStorage.setItem("gh-latest-commit", JSON.stringify({
                msg: fullMsg, sha: shortSha, url: commitUrl, date: commitDate
            }));
            return;
        }
    } catch (err) {
        if (!localStorage.getItem("gh-latest-commit")) {
            const fallbackText = document.createElement("span");
            fallbackText.style.color = "var(--fg-1)";
            fallbackText.textContent = "Tracking declarative flake baseline";

            const verifiedBadge = document.createElement("span");
            verifiedBadge.style.color = "var(--gray)";
            verifiedBadge.textContent = " (verified)";

            msgEl.replaceChildren(fallbackText, verifiedBadge);
            dateEl.textContent = "master branch";
        }
    }
}
