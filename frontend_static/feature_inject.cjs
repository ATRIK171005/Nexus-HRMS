const fs = require('fs');
let html = fs.readFileSync('C:\\Users\\Atrik Samanta\\HRMS_Project\\frontend_static\\source_index.html', 'utf8');

// Remove Lovable Badge
html = html.replace(/<aside id="lovable-badge"[\s\S]*?<\/aside>/g, '');

const customStyles = `
<style>
  html.dark {
    --background: oklch(15.5% 0.024 274); /* Midnight Slate */
    --surface: oklch(19.6% 0.026 274); /* Deep Slate Navy */
    --surface-2: oklch(23% 0.028 274); /* Elevated Slate */
    --primary: oklch(65% 0.18 285); /* Vivid Slate Blue */
    --primary-soft: oklch(28% 0.065 283); 
    --primary-strong: oklch(78% 0.13 287);
    --accent-teal: oklch(75% 0.11 195); /* Bright Mint */
    --foreground: oklch(96.5% 0.006 275); /* Frost White */
    --muted-foreground: oklch(72% 0.024 272); /* Slate Muted */
    --border: oklch(100% 0 0/0.11); /* Slate Outline */
    --sidebar: oklch(17.6% 0.025 274);
  }
  
  /* Global smooth transition */
  *, *::before, *::after {
    transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease !important;
  }
  
  /* Force hide lovable badge */
  #lovable-badge, aside[aria-label="Edit with Lovable"] {
    display: none !important;
  }
  
  /* Change cursor to pointer for options */
  li, button, a, [role="button"], [role="menuitem"], [role="option"], [role="tab"], .hover\\:bg-surface {
    cursor: pointer !important;
  }
  
  /* Copilot FAB (Smaller & Circular) */
  #copilot-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, var(--primary), var(--primary-strong));
    color: var(--primary-foreground);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,0,0.3);
    z-index: 999998;
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    border: none;
  }
  #copilot-fab:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  }

  /* Copilot Overlay Window */
  #copilot-overlay {
    position: fixed;
    bottom: 90px;
    right: 24px;
    width: 440px;
    height: 720px;
    max-height: 85vh;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: 0 12px 30px rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
    z-index: 999999;
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    pointer-events: none;
    transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    transform-origin: bottom right;
  }
  #copilot-overlay.open {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }
  #copilot-header {
    padding: 16px;
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);
    font-weight: 600;
    color: var(--foreground);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #copilot-close {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--muted-foreground);
    cursor: pointer;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #copilot-close:hover {
    background: var(--primary-soft);
    color: var(--primary-strong);
  }
  
  #copilot-chat {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: var(--foreground);
    font-size: 0.9rem;
    background: var(--background);
  }
  .msg-user {
    align-self: flex-end;
    background: var(--primary);
    color: var(--primary-foreground);
    padding: 10px 14px;
    border-radius: 14px 14px 0 14px;
    max-width: 85%;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .msg-bot {
    align-self: flex-start;
    background: var(--surface);
    padding: 12px 14px;
    border-radius: 14px 14px 14px 0;
    border: 1px solid var(--border);
    max-width: 95%;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    line-height: 1.5;
  }
  
  /* Suggestions Box */
  #copilot-suggestions {
    display: flex;
    gap: 8px;
    padding: 10px 16px 14px 16px;
    background: var(--surface-2);
    border-top: 1px solid var(--border);
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--primary-soft) transparent;
  }
  #copilot-suggestions::-webkit-scrollbar {
    height: 6px;
  }
  #copilot-suggestions::-webkit-scrollbar-track {
    background: transparent;
  }
  #copilot-suggestions::-webkit-scrollbar-thumb {
    background-color: var(--primary-soft);
    border-radius: 10px;
  }
  #copilot-suggestions::-webkit-scrollbar-thumb:hover {
    background-color: var(--primary);
  }
  .suggestion-chip {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--muted-foreground);
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 0.8rem;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s ease !important;
  }
  .suggestion-chip:hover {
    background: var(--primary-soft);
    color: var(--primary-strong);
    border-color: var(--primary-strong);
  }

  #copilot-input-container {
    padding: 14px;
    background: var(--surface-2);
    display: flex;
    gap: 10px;
    align-items: center;
  }
  #copilot-input {
    flex: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--foreground);
    padding: 10px 14px;
    border-radius: 20px;
    outline: none;
    transition: border-color 0.2s !important;
  }
  #copilot-input:focus {
    border-color: var(--primary);
  }
  #copilot-submit {
    background: var(--primary);
    color: var(--primary-foreground);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
  #copilot-submit:hover {
    opacity: 0.9;
  }

  /* Custom Dropdowns */
  .nexus-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    width: 280px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    z-index: 99999;
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease !important;
  }
  .nexus-dropdown.open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
  .dropdown-header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    font-weight: 600;
    color: var(--foreground);
  }
  .dropdown-item {
    padding: 10px 16px;
    color: var(--foreground);
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .dropdown-item:hover {
    background: var(--surface-2);
  }
  .dropdown-item svg {
    color: var(--muted-foreground);
  }
  .dropdown-footer {
    border-top: 1px solid var(--border);
    padding: 10px 16px;
    text-align: center;
    color: var(--primary);
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
  }
  .dropdown-footer:hover {
    background: var(--surface-2);
  }
</style>

`;

const customScript = `
<script>
  window.addEventListener('load', () => {
      setTimeout(() => {
          // Find notification bell
          const bellSvg = document.querySelector('.lucide-bell');
          const bellBtn = bellSvg ? bellSvg.closest('button') : null;
          if (bellBtn) {
              const redDot = bellBtn.querySelector('.bg-destructive');
              if (redDot) {
                  redDot.className = 'absolute flex items-center justify-center text-[11px] font-extrabold text-white';
                  redDot.innerText = '3';
                  // Position exactly over the top right corner of the SVG (button has 10px padding)
                  redDot.style.right = '8px';
                  redDot.style.top = '6px';
                  redDot.style.background = 'transparent';
              }
          }
          
          const headerActions = bellBtn.parentElement;
          headerActions.style.display = 'flex';
          headerActions.style.alignItems = 'center';
          headerActions.style.gap = '8px';
          
          // Create Dark Mode Toggle right beside bell
          const themeBtn = document.createElement('button');
          themeBtn.className = bellBtn.className;
          
          const updateIcon = () => {
              const isDark = document.documentElement.classList.contains('dark');
              themeBtn.innerHTML = isDark ? 
                  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>' : 
                  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';
          };
          
          themeBtn.onclick = () => {
              if (document.documentElement.classList.contains('dark')) {
                  document.documentElement.classList.remove('dark');
                  localStorage.setItem('nexus-theme', 'light');
              } else {
                  document.documentElement.classList.add('dark');
                  localStorage.setItem('nexus-theme', 'dark');
              }
              updateIcon();
          };
          updateIcon();
          
          // Add File Button
          const uploadWrapper = document.createElement('div');
          uploadWrapper.style.position = 'relative';
          
          const uploadBtn = document.createElement('label');
          uploadBtn.className = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-transparent shadow-sm h-9 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 cursor-pointer";
          uploadBtn.innerHTML = "Add File";
          
          const fileInput = document.createElement('input');
          fileInput.type = "file";
          fileInput.style.display = "none";
          fileInput.accept = ".csv,.json,.txt";
          
          fileInput.onchange = async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              
              const formData = new FormData();
              formData.append("file", file);
              
              const oldText = uploadBtn.innerHTML;
              uploadBtn.innerHTML = "Uploading...";
              try {
                  const res = await fetch('http://localhost:8000/upload', {
                      method: 'POST',
                      body: formData
                  });
                  const data = await res.json();
                  alert(data.message || data.error);
              } catch (err) {
                  alert("Upload failed. Is the python backend running?");
              } finally {
                  uploadBtn.innerHTML = oldText;
                  fileInput.value = "";
              }
          };
          
          uploadBtn.appendChild(fileInput);
          uploadWrapper.appendChild(uploadBtn);
          
          // Inject Dark Mode and Add File before bell
          headerActions.insertBefore(uploadWrapper, bellBtn);
          headerActions.insertBefore(themeBtn, bellBtn);

          // Find other header buttons
          const settingsSvg = document.querySelector('.lucide-settings');
          const settingsBtn = settingsSvg ? settingsSvg.closest('button') : null;
          
          // The profile span contains 'SM' or is a span inside the header actions
          const headerSpans = headerActions.querySelectorAll('span');
          let profileBtn = null;
          headerSpans.forEach(span => {
              if (span.innerText.trim() === 'SM' || span.classList.contains('bg-primary')) {
                  profileBtn = span;
                  profileBtn.style.cursor = 'pointer';
              }
          });

          // Close all dropdowns when clicking outside
          document.addEventListener('click', (e) => {
              document.querySelectorAll('.nexus-dropdown').forEach(d => {
                  if (!d.contains(e.target) && d.parentElement && !d.parentElement.contains(e.target)) {
                      d.classList.remove('open');
                  }
              });
          });

          const createDropdown = (parentBtn, width, htmlContent) => {
              if (!parentBtn) return;
              parentBtn.style.position = 'relative';
              const dropdown = document.createElement('div');
              dropdown.className = 'nexus-dropdown';
              dropdown.style.width = width;
              dropdown.innerHTML = htmlContent;
              parentBtn.appendChild(dropdown);
              
              parentBtn.onclick = (e) => {
                  e.stopPropagation();
                  const isOpen = dropdown.classList.contains('open');
                  // Close others
                  document.querySelectorAll('.nexus-dropdown').forEach(d => d.classList.remove('open'));
                  if (!isOpen) dropdown.classList.add('open');
              };
          };

          // 1. Notification Dropdown
          createDropdown(bellBtn, '320px', \`
              <div class="dropdown-header">Notifications (3)</div>
              <div class="dropdown-item">
                  <div style="flex:1">
                      <p style="font-size:0.85rem;font-weight:600;margin:0">Server Reboot</p>
                      <p style="font-size:0.75rem;color:var(--muted-foreground);margin:0">Your server has been updated successfully.</p>
                  </div>
              </div>
              <div class="dropdown-item">
                  <div style="flex:1">
                      <p style="font-size:0.85rem;font-weight:600;margin:0">New Message</p>
                      <p style="font-size:0.75rem;color:var(--muted-foreground);margin:0">Sofia requested annual leave.</p>
                  </div>
              </div>
              <div class="dropdown-item">
                  <div style="flex:1">
                      <p style="font-size:0.85rem;font-weight:600;margin:0">Payroll Processed</p>
                      <p style="font-size:0.75rem;color:var(--muted-foreground);margin:0">August payroll is complete.</p>
                  </div>
              </div>
              <div class="dropdown-footer">Mark all as read</div>
          \`);

          // 2. Settings Dropdown
          createDropdown(settingsBtn, '240px', \`
              <div class="dropdown-header">System Settings</div>
              <div class="dropdown-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                  <span>Dashboard Layout</span>
              </div>
              <div class="dropdown-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  <span>Appearance</span>
              </div>
              <div class="dropdown-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
                  <span>Security & Privacy</span>
              </div>
          \`);

          // 3. Profile Dropdown
          createDropdown(profileBtn, '220px', \`
              <div class="dropdown-header">
                  <p style="margin:0;font-size:0.9rem">Sofia Marchetti</p>
                  <p style="margin:0;font-size:0.75rem;color:var(--muted-foreground);font-weight:400">sofia@nexus.app</p>
              </div>
              <div class="dropdown-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>My Profile</span>
              </div>
              <div class="dropdown-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                  <span>Billing</span>
              </div>
              <div class="dropdown-footer" style="color:var(--destructive)">Log out</div>
          \`);

          
          // Settings Modals Logic
          const createModal = (id, title, icon, bodyHtml) => {
              const overlay = document.createElement('div');
              overlay.className = 'nexus-modal-overlay';
              overlay.id = id;
              overlay.innerHTML = \`
                <div class="nexus-modal">
                    <div class="nexus-modal-header">
                        <div class="nexus-modal-title">
                            \${icon}
                            \${title}
                        </div>
                        <button class="nexus-modal-close">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>
                    <div class="nexus-modal-body">
                        \${bodyHtml}
                    </div>
                </div>
              \`;
              document.body.appendChild(overlay);
              
              overlay.querySelector('.nexus-modal-close').onclick = () => {
                  overlay.classList.remove('open');
              };
              overlay.onclick = (e) => {
                  if (e.target === overlay) overlay.classList.remove('open');
              };
              
              // Handle toggles inside modal
              overlay.querySelectorAll('.nexus-toggle').forEach(t => {
                  t.onclick = () => t.classList.toggle('active');
              });
              
              return overlay;
          };

          const layoutModal = createModal('modal-layout', 'Dashboard Layout', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>', \`
              <div class="settings-row">
                  <div class="settings-info">
                      <h4>Compact Mode</h4>
                      <p>Reduce padding to fit more data on screen</p>
                  </div>
                  <div class="nexus-toggle"></div>
              </div>
              <div class="settings-row">
                  <div class="settings-info">
                      <h4>Show Quick Actions</h4>
                      <p>Display floating quick action buttons on tables</p>
                  </div>
                  <div class="nexus-toggle active"></div>
              </div>
              <div class="settings-row">
                  <div class="settings-info">
                      <h4>Collapsible Sidebar</h4>
                      <p>Automatically collapse sidebar on smaller screens</p>
                  </div>
                  <div class="nexus-toggle active"></div>
              </div>
          \`);

          const appearanceModal = createModal('modal-appearance', 'Appearance Settings', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>', \`
              <div class="settings-row">
                  <div class="settings-info">
                      <h4>Midnight Slate Theme</h4>
                      <p>The default dark blue aesthetic for Nexus HRMS</p>
                  </div>
                  <div class="nexus-toggle active"></div>
              </div>
              <div class="settings-row">
                  <div class="settings-info">
                      <h4>System Sync</h4>
                      <p>Automatically switch themes based on OS preference</p>
                  </div>
                  <div class="nexus-toggle"></div>
              </div>
              <div class="settings-row">
                  <div class="settings-info">
                      <h4>Reduce Animations</h4>
                      <p>Disable hover effects and transitions for better performance</p>
                  </div>
                  <div class="nexus-toggle"></div>
              </div>
          \`);

          const securityModal = createModal('modal-security', 'Security & Privacy', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>', \`
              <div class="settings-row">
                  <div class="settings-info">
                      <h4>Two-Factor Authentication (2FA)</h4>
                      <p>Require an extra security code when logging in</p>
                  </div>
                  <div class="nexus-toggle active"></div>
              </div>
              <div class="settings-row">
                  <div class="settings-info">
                      <h4>Session Timeout</h4>
                      <p>Automatically log out after 30 minutes of inactivity</p>
                  </div>
                  <div class="nexus-toggle active"></div>
              </div>
              <div class="settings-row">
                  <div class="settings-info">
                      <h4>Data Sharing</h4>
                      <p>Allow anonymous telemetry for app improvements</p>
                  </div>
                  <div class="nexus-toggle"></div>
              </div>
              <div style="margin-top: 24px; text-align: right;">
                  <button style="background: var(--destructive); color: white; padding: 10px 16px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer;">Revoke All Sessions</button>
              </div>
          \`);

          // Hook up clicks to open modals
          document.addEventListener('click', (e) => {
              const dropItem = e.target.closest('.dropdown-item');
              if (!dropItem) return;
              
              const text = dropItem.innerText.trim();
              if (text === 'Dashboard Layout') {
                  layoutModal.classList.add('open');
              } else if (text === 'Appearance') {
                  appearanceModal.classList.add('open');
              } else if (text === 'Security & Privacy') {
                  securityModal.classList.add('open');
              }
          });

          // Build Copilot FAB
          const fab = document.createElement('button');
          fab.id = 'copilot-fab';
          fab.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M4.93 4.93l2.83 2.83"></path><path d="M16.24 16.24l2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="M4.93 19.07l2.83-2.83"></path><path d="M16.24 7.76l2.83-2.83"></path></svg>';
          document.body.appendChild(fab);

          // Build Copilot Overlay
          const overlay = document.createElement('div');
          overlay.id = 'copilot-overlay';
          overlay.innerHTML = \`
            <div id="copilot-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary)"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
                    Nexus Text-to-SQL Copilot
                </div>
                <button id="copilot-close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
            <div id="copilot-chat">
                <div class="msg-bot">Hi there! Try uploading a CSV with the "Add File" button above, then ask me to query it!</div>
            </div>
            <div id="copilot-suggestions">
                <div class="suggestion-chip">What can you do?</div>
                <div class="suggestion-chip">Summarize data</div>
                <div class="suggestion-chip">Draft an email</div>
                <div class="suggestion-chip">Average salary by department?</div>
                <div class="suggestion-chip">Count all employees?</div>
                <div class="suggestion-chip">Organise all the stuff</div>
                <div class="suggestion-chip">Who has the highest salary?</div>
            </div>
            <div id="copilot-input-container">
                <input type="text" id="copilot-input" placeholder="Type a message..." autocomplete="off" />
                <button id="copilot-submit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
            </div>
          \`;
          document.body.appendChild(overlay);
          // Helper to uniquely identify a row across different UI layouts
          const getRowKey = (container) => {
              let el = container;
              while (el && el !== document.body) {
                  if (el.tagName === 'TR' || el.tagName === 'LI') break;
                  if (el.classList && el.classList.contains('flex') && el.innerText.length > 15 && el.innerText.length < 200) break;
                  el = el.parentElement;
              }
              let text = (el || container).innerText.replace(/Approve/gi, '').replace(/Reject/gi, '');
              return text.replace(/[^a-zA-Z0-9]/g, '').substring(0, 40);
          };

          // Hook up ALL App Buttons dynamically (Export, Copilot, Approve, Reject)
          document.body.addEventListener('click', (e) => {
              const btn = e.target.closest('button');
              if (!btn) return;
              
              const text = btn.innerText.trim();
              
              if (text === 'Ask Copilot') {
                  e.preventDefault();
                  if (!overlay.classList.contains('open')) {
                      overlay.classList.add('open');
                      document.getElementById('copilot-input').focus();
                  }
              } else if (text === 'Export') {
                  e.preventDefault();
                  const oldText = btn.innerHTML;
                  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_P7sC{transform-origin:center;animation:spinner_svv2 .75s infinite linear}@keyframes spinner_svv2{100%{transform:rotate(360deg)}}</style><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_P7sC"/></svg> Exporting...';
                  window.location.href = 'http://localhost:8000/export';
                  setTimeout(() => { btn.innerHTML = oldText; }, 2000);
              } else if (text === 'Approve' || text === 'Reject') {
                  e.preventDefault();
                  const container = btn.parentElement;
                  if (container) {
                      const rowKey = getRowKey(container);
                      if (!rowKey) return; // Ignore if we can't identify the row
                      const status = text === 'Approve' ? 'Approved' : 'Rejected';
                      
                      const history = JSON.parse(localStorage.getItem('nexus-leave-history') || '{}');
                      history[rowKey] = status;
                      localStorage.setItem('nexus-leave-history', JSON.stringify(history));
                      
                      container.innerHTML = status === 'Approved' 
                          ? '<span style="color: var(--primary); font-weight: 600; font-size: 0.85rem; padding: 8px;">✓ Approved</span>'
                          : '<span style="color: var(--destructive); font-weight: 600; font-size: 0.85rem; padding: 8px;">✕ Rejected</span>';
                  }
              }
          });

          // Persistent State Re-hydrator (MutationObserver)
          const observer = new MutationObserver((mutations) => {
              const history = JSON.parse(localStorage.getItem('nexus-leave-history') || '{}');
              if (Object.keys(history).length === 0) return;

              document.querySelectorAll('button').forEach(btn => {
                  const text = btn.innerText.trim();
                  if (text === 'Approve' || text === 'Reject') {
                      const container = btn.parentElement;
                      if (container) {
                          const rowKey = getRowKey(container);
                          if (history[rowKey]) {
                              const status = history[rowKey];
                              container.innerHTML = status === 'Approved' 
                                  ? '<span style="color: var(--primary); font-weight: 600; font-size: 0.85rem; padding: 8px;">✓ Approved</span>'
                                  : '<span style="color: var(--destructive); font-weight: 600; font-size: 0.85rem; padding: 8px;">✕ Rejected</span>';
                          }
                      }
                  }
              });
          });
          observer.observe(document.body, { childList: true, subtree: true });

          fab.onclick = () => {
              const isOpen = overlay.classList.contains('open');
              if (isOpen) {
                  overlay.classList.remove('open');
              } else {
                  overlay.classList.add('open');
                  document.getElementById('copilot-input').focus();
              }
          };
          document.getElementById('copilot-close').onclick = () => {
              overlay.classList.remove('open');
          };

          const chat = document.getElementById('copilot-chat');
          const input = document.getElementById('copilot-input');
          const submit = document.getElementById('copilot-submit');

          // Handle Suggestions
          document.querySelectorAll('.suggestion-chip').forEach(chip => {
              chip.onclick = () => {
                  if (!overlay.classList.contains('open')) {
                      fab.click();
                  }
                  input.value = chip.innerText;
                  sendMessage();
              };
          });

          const sendMessage = async () => {
              const text = input.value.trim();
              if (!text) return;
              
              chat.innerHTML += \`<div class="msg-user">\${text}</div>\`;
              input.value = '';
              chat.scrollTop = chat.scrollHeight;

              const loadingId = 'loading-' + Date.now();
              chat.innerHTML += \`<div class="msg-bot" id="\${loadingId}">
                  <div style="display: flex; gap: 4px; align-items: center; color: var(--muted-foreground)">
                      <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_P7sC{transform-origin:center;animation:spinner_svv2 .75s infinite linear}@keyframes spinner_svv2{100%{transform:rotate(360deg)}}</style><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_P7sC"/></svg>
                      Translating to SQL via BM25...
                  </div>
              </div>\`;
              chat.scrollTop = chat.scrollHeight;

              try {
                  const res = await fetch('http://localhost:8000/copilot', {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({text})
                  });
                  const data = await res.json();
                  
                  document.getElementById(loadingId).remove();
                  
                  let replyText = \`<div style="color: var(--primary-strong); font-weight: 600; margin-bottom: 8px; font-size: 0.8rem; letter-spacing: 0.5px;">✓ TEXT TO SQL SUCCESS</div>\`;
                  
                  if (data.generated_sql && data.generated_sql !== "N/A") {
                      replyText += \`<div style="background: var(--surface-2); padding: 8px; border-radius: 6px; font-family: monospace; font-size: 0.8rem; margin-bottom: 12px; border: 1px solid var(--border); color: var(--accent-teal)">\${data.generated_sql}</div>\`;
                  }
                  
                  replyText += data.reply;

                  chat.innerHTML += \`<div class="msg-bot">\${replyText}</div>\`;
                  chat.scrollTop = chat.scrollHeight;
              } catch (e) {
                  document.getElementById(loadingId).remove();
                  chat.innerHTML += \`<div class="msg-bot" style="color: var(--destructive);">Error connecting to Python backend. Is it running on port 8000?</div>\`;
                  chat.scrollTop = chat.scrollHeight;
              }
          };

          submit.onclick = sendMessage;
          input.onkeypress = (e) => {
              if (e.key === 'Enter') sendMessage();
          };
          
      }, 1500);
  });
</script>
`;

const cacheBuster = `
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
      } 
    });
  }
</script>
`;

html = html.replace('</head>', customStyles + cacheBuster + '</head>');
html = html.replace('</body>', customScript + '</body>');

fs.writeFileSync('C:\\Users\\Atrik Samanta\\HRMS_Project\\frontend_static\\index.html', html);
console.log('Final polish: Copilot FAB reverted to small circular icon, Add File button renamed.');
