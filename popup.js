document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const windowListEl = document.querySelector('.window-list');
    const windowDetailEl = document.getElementById('window-detail');
    let windowsData = [];
 
 
    navToggle.addEventListener('click', () => {
        // const navbar = document.getElementById('navbar');
        // if (!navbar) return;
 
 
        // const isOpen = navbar.classList.toggle('open'); // toggle 'open' class
 
 
        // if (isOpen) {
        //     loadWindowList(); // refresh windows when navbar opens
        // }
 
 
        const navbar = document.getElementById('navbar');
        if (!navbar) return;
 
 
        const isOpen = navbar.classList.toggle('open'); // toggle visibility
 
 
        chrome.windows.getAll({ populate: true }, (windows) => {
            if (chrome.runtime.lastError) {
                console.error('Error getting windows:', chrome.runtime.lastError);
                return;
            }
            windowsData = windows;
 
 
            console.log(isOpen);
 
 
            renderSidebar(windowsData);
            console.log("nav toggle clicked");
        });
    });
 
 
    //Optionally, load window list on startup if navbar visible by default
    // if (document.getElementById('navbar').classList.contains('open')) {
    //     loadWindowList();
    // }
 
 
    if (document.getElementById('navbar').classList.contains('open')) {
        chrome.windows.getAll({ populate: true }, (windows) => {
            if (chrome.runtime.lastError) {
                console.error('Error getting windows:', chrome.runtime.lastError);
                return;
            }
            windowsData = windows;
            renderSidebar(windowsData);
        });
    }
 
 
    function loadWindows() {
        chrome.windows.getAll({ populate: true }, (windows) => {
            if (chrome.runtime.lastError) {
                console.error('Error getting windows:', chrome.runtime.lastError);
                return;
            }
            windowsData = windows;
 
 
            renderSidebar(windowsData);
            renderWindowDetails(windowsData);
        });
    }
 
 
    function renderSidebar(windows) {
        windowListEl.innerHTML = '';
        windows.forEach(win => {
            const div = document.createElement('div');
            div.className = 'window-item';
            div.textContent = `Window ${win.id} (${win.tabs.length} tabs)`;
            div.style.cursor = 'pointer';
 
 
            div.addEventListener('click', () => {
                // Focus the window by id
                chrome.windows.update(win.id, { focused: true }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Error focusing window:', chrome.runtime.lastError);
                    } else {
                        highlightWindow(win.id);
                        scrollToWindow(win.id);
                    }
                });
            });
 
 
            windowListEl.appendChild(div);
        });
    }
 
 
    function renderWindowDetails(windows) {
        windowDetailEl.innerHTML = '';
        windows.forEach(win => {
            const section = document.createElement('section');
            section.className = 'window-section';
            section.id = `window-section-${win.id}`;
 
 
            const title = document.createElement('h2');
            title.className = 'window-title';
            title.textContent = `Window ${win.id}`;
            title.style.cursor = 'pointer';
            title.title = 'Click to focus this window';
 
 
            title.addEventListener('click', () => {
                chrome.windows.update(win.id, { focused: true }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Error focusing window:', chrome.runtime.lastError);
                    } else {
                        //highlightWindow(win.id);
                    }
                });
            });
 
 
            section.appendChild(title);
 
 
            const ul = document.createElement('ul');
            ul.className = 'tab-list';
 
 
            win.tabs.forEach(tab => {
                const li = document.createElement('li');
                li.className = 'tab-item';
 
 
                // Text span for tab title/url
                const tabText = document.createElement('span');
                tabText.textContent = tab.title || tab.url;
 
 
                // Icon span (using a right-arrow or link icon Unicode)
                const icon = document.createElement('span');
                icon.className = 'tab-icon';
                icon.title = 'Activate tab'; // tooltip on hover
                icon.textContent = '🔗'; // or use → or any icon you prefer
                icon.style.cursor = 'pointer';
                icon.style.marginLeft = '8px';
 
 
                // When clicking icon, focus window and tab
                icon.addEventListener('click', (e) => {
                    e.stopPropagation(); // prevent triggering li click if any
                    chrome.windows.update(win.id, { focused: true }, () => {
                        chrome.tabs.update(tab.id, { active: true });
                    });
                });
 
 
                li.appendChild(tabText);
                li.appendChild(icon);
                ul.appendChild(li);
            });
 
 
            section.appendChild(ul);
            windowDetailEl.appendChild(section);
        });
    }
 
 
 
 
    // function highlightWindow(windowId) {
    //     // Remove 'selected' class from all window sections
    //     windowsData.forEach(win => {
    //         const sec = document.getElementById(`window-section-${win.id}`);
    //         if (sec) sec.classList.remove('selected');
    //     });
 
 
    //     // Add 'selected' class to the clicked window section
    //     const selectedSection = document.getElementById(`window-section-${windowId}`);
    //     if (selectedSection) {
    //         selectedSection.classList.add('selected');
    //     }
    // }
 
 
    function scrollToWindow(windowId) {
        const selectedSection = document.getElementById(`window-section-${windowId}`);
        if (selectedSection) {
            selectedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
 
 
    loadWindows();
 
 
 });
 
 
 // function loadWindowList() {
 //     const listEl = document.querySelector('.window-list');
 //     if (!listEl) return;
 
 
 //     listEl.innerHTML = ''; // Clear old entries
 
 
 //     chrome.windows.getAll({ populate: true }, windows => {
 //         windows.forEach(win => {
 //             const windowDiv = document.createElement('div');
 //             windowDiv.className = 'window-item';
 //             windowDiv.textContent = `Window ${win.id} (${win.tabs.length} tabs)`;
 
 
 //             listEl.appendChild(windowDiv);
 //         });
 //     });
 
 
 // }
 