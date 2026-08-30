/**
 * tree.js: Repository Tree Rendering & Dynamic Collapse/Expand
 */

let allTreeExpanded = false;

function toggleAllTreeFolders() {
    allTreeExpanded = !allTreeExpanded;
    const folders = document.querySelectorAll('.tree-folder');
    folders.forEach(folder => {
        folder.open = allTreeExpanded;
    });
}

function renderTreeBranch(nodes) {
    let html = '';
    for (const node of nodes) {
        if (node.type === 'directory') {
            html += `
                <li class="tree-item">
                    <details class="tree-folder">
                        <summary>📁 ${node.name}/</summary>
                        <ul class="tree-branch">
                            ${renderTreeBranch(node.children || [])}
                        </ul>
                    </details>
                </li>
            `;
        } else {
            let fileClass = 'tree-file';
            let icon = '📄';
            if (node.fileType === 'nix') {
                fileClass += ' tree-file-nix';
            } else if (node.fileType === 'doc') {
                fileClass += ' tree-file-doc';
                icon = '📘';
            } else if (node.fileType === 'media') {
                fileClass += ' tree-file-media';
                icon = '🎵';
            } else if (node.fileType === 'config') {
                fileClass += ' tree-file-config';
                icon = node.name.endsWith('.sh') ? '📜' : (node.name.endsWith('.pem') ? '🔑' : '📄');
            }
            html += `<li class="tree-item ${fileClass}">${icon} ${node.name}</li>`;
        }
    }
    return html;
}

async function loadTreeData() {
    const headerText = document.getElementById('tree-stats-text');
    const rootEl = document.getElementById('tree-root-container');
    if (!rootEl) return;

    try {
        const res = await fetch('data/tree.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (headerText) {
            headerText.textContent = `📂 ${data.repoName} (${data.totalDirectories} directories, ${data.totalFiles} files)`;
        }

        rootEl.innerHTML = renderTreeBranch(data.tree);
    } catch (err) {
        // Keeps the existing pre-rendered HTML in place if fetch fails
        console.warn("Using embedded repository tree:", err);
    }
}
