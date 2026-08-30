/**
 * tree.js: Repository Tree Rendering & Dynamic Collapse/Expand
 */

const TREE_ICONS = {
    folder: `<svg class="svg-icon svg-folder-icon" viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M1.5 2.5A1.5 1.5 0 0 0 0 4v8A1.5 1.5 0 0 0 1.5 13.5h13a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H7.707l-1.354-1.354A1.5 1.5 0 0 0 5.293 2.5H1.5z"/></svg>`,
    file: `<svg class="svg-icon svg-file-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 1.5h6l4 4V14a1.5 1.5 0 0 1-1.5 1.5h-8.5A1.5 1.5 0 0 1 2 14V3a1.5 1.5 0 0 1 1.5-1.5z"/><polyline points="9.5 1.5 9.5 5.5 13.5 5.5"/></svg>`,
    nix: `<svg class="svg-icon svg-file-icon svg-nix-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 1.5h6l4 4V14a1.5 1.5 0 0 1-1.5 1.5h-8.5A1.5 1.5 0 0 1 2 14V3a1.5 1.5 0 0 1 1.5-1.5z"/><polyline points="9.5 1.5 9.5 5.5 13.5 5.5"/><path d="M6 11.5l2-4 2 4M6.7 10h2.6" stroke-width="1.2"/></svg>`,
    doc: `<svg class="svg-icon svg-file-icon svg-doc-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 1.5h6l4 4V14a1.5 1.5 0 0 1-1.5 1.5h-8.5A1.5 1.5 0 0 1 2 14V3a1.5 1.5 0 0 1 1.5-1.5z"/><polyline points="9.5 1.5 9.5 5.5 13.5 5.5"/><path d="M5 8.5h6M5 11.5h4" stroke-width="1.3"/></svg>`,
    media: `<svg class="svg-icon svg-file-icon svg-media-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 13.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 0V3.5l7-2v9.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0-6.5l7-2"/></svg>`,
    script: `<svg class="svg-icon svg-file-icon svg-script-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 1.5h6l4 4V14a1.5 1.5 0 0 1-1.5 1.5h-8.5A1.5 1.5 0 0 1 2 14V3a1.5 1.5 0 0 1 1.5-1.5z"/><polyline points="9.5 1.5 9.5 5.5 13.5 5.5"/><path d="M5 8.5l1.8 1.5-1.8 1.5M8.5 11.5h2.5" stroke-width="1.3"/></svg>`,
    key: `<svg class="svg-icon svg-file-icon svg-key-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5.5" cy="6" r="3"/><line x1="8" y1="8" x2="13.5" y2="13.5"/><line x1="11" y1="11" x2="13" y2="9"/><line x1="12" y1="12" x2="14" y2="10.5"/></svg>`
};

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
                        <summary>${TREE_ICONS.folder} ${node.name}/</summary>
                        <ul class="tree-branch">
                            ${renderTreeBranch(node.children || [])}
                        </ul>
                    </details>
                </li>
            `;
        } else {
            let fileClass = 'tree-file';
            let icon = TREE_ICONS.file;
            if (node.fileType === 'nix') {
                fileClass += ' tree-file-nix';
                icon = TREE_ICONS.nix;
            } else if (node.fileType === 'doc') {
                fileClass += ' tree-file-doc';
                icon = TREE_ICONS.doc;
            } else if (node.fileType === 'media') {
                fileClass += ' tree-file-media';
                icon = TREE_ICONS.media;
            } else if (node.fileType === 'config') {
                fileClass += ' tree-file-config';
                icon = node.name.endsWith('.sh') ? TREE_ICONS.script : (node.name.endsWith('.pem') ? TREE_ICONS.key : TREE_ICONS.file);
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
            headerText.innerHTML = `${TREE_ICONS.folder} ${data.repoName} (${data.totalDirectories} directories, ${data.totalFiles} files)`;
        }

        rootEl.innerHTML = renderTreeBranch(data.tree);
    } catch (err) {
        // Keeps the existing pre-rendered HTML in place if fetch fails
        console.warn("Using embedded repository tree:", err);
    }
}

