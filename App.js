let tabs = [
    { id: 1, title: 'New Tab', url: '', favicon: 'https://www.google.com/favicon.ico' }
];
let activeTabId = 1;
let tabCounter = 1;

const tabsContainer = document.getElementById('tabsContainer');
const newTabBtn = document.getElementById('newTabBtn');
const addressInput = document.getElementById('addressInput');
const webview = document.getElementById('webview');
const webviewContainer = document.getElementById('webviewContainer');
const newTabPage = document.getElementById('newTabPage');
const searchInput = document.getElementById('searchInput');
const menuBtn = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const reloadBtn = document.getElementById('reloadBtn');
const homeBtn = document.getElementById('homeBtn');

function renderTabs() {
    tabsContainer.innerHTML = tabs.map(tab => `
        <div class="tab ${tab.id === activeTabId ? 'active' : ''}" data-tab-id="${tab.id}">
            <img class="tab-favicon" src="${tab.favicon || 'https://www.google.com/favicon.ico'}" alt="">
            <span class="tab-title">${tab.title || 'New Tab'}</span>
            <button class="tab-close" onclick="closeTab(${tab.id}, event)">✕</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.tab').forEach(tabEl => {
        tabEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-close')) return;
            switchTab(parseInt(tabEl.dataset.tabId));
        });
    });
}

function createTab() {
    tabCounter++;
    tabs.push({
        id: tabCounter,
        title: 'New Tab',
        url: '',
        favicon: 'https://www.google.com/favicon.ico'
    });
    activeTabId = tabCounter;
    renderTabs();
    showNewTabPage();
}

function closeTab(tabId, event) {
    event.stopPropagation();
    if (tabs.length === 1) return;
    
    tabs = tabs.filter(t => t.id !== tabId);
    if (activeTabId === tabId) {
        activeTabId = tabs[tabs.length - 1].id;
    }
    renderTabs();
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab.url) {
        loadURL(activeTab.url);
    } else {
        showNewTabPage();
    }
}

function switchTab(tabId) {
    activeTabId = tabId;
    renderTabs();
    const tab = tabs.find(t => t.id === tabId);
    if (tab.url) {
        loadURL(tab.url);
    } else {
        showNewTabPage();
    }
}

function showNewTabPage() {
    newTabPage.style.display = 'flex';
    webviewContainer.style.display = 'none';
    addressInput.value = '';
    document.title = 'New Tab';
}

function loadURL(url) {
    if (!url) return;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        if (url.includes('.') && !url.includes(' ')) {
            url = 'https://' + url;
        } else {
            url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
        }
    }
    
    newTabPage.style.display = 'none';
    webviewContainer.style.display = 'block';
    webview.src = url;
    addressInput.value = url;
    
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab) {
        tab.url = url;
        tab.title = url.replace(/https?:\/\//, '').split('/')[0];
        tab.favicon = `https://www.google.com/s2/favicons?domain=${url}&sz=32`;
        renderTabs();
    }
    
    document.title = tab.title;
    saveHistory(url);
}

addressInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadURL(addressInput.value.trim());
        addressInput.blur();
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadURL(searchInput.value.trim());
    }
});

newTabBtn.addEventListener('click', createTab);

backBtn.addEventListener('click', () => webview.contentWindow.history.back());
forwardBtn.addEventListener('click', () => webview.contentWindow.history.forward());
reloadBtn.addEventListener('click', () => webview.contentWindow.location.reload());
homeBtn.addEventListener('click', showNewTabPage);

menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuDropdown.classList.toggle('active');
});

document.addEventListener('click', () => {
    menuDropdown.classList.remove('active');
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 't') { e.preventDefault(); createTab(); }
    if (e.ctrlKey && e.key === 'w') { e.preventDefault(); if (tabs.length > 1) closeTab(activeTabId, { stopPropagation: () => {} }); }
    if (e.ctrlKey && e.key === 'l') { e.preventDefault(); addressInput.focus(); addressInput.select(); }
});

function saveHistory(url) {
    let history = JSON.parse(localStorage.getItem('browserHistory') || '[]');
    history.unshift({ url, time: Date.now() });
    history = history.slice(0, 100);
    localStorage.setItem('browserHistory', JSON.stringify(history));
}

renderTabs();
