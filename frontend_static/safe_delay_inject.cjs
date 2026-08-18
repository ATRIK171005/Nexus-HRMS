const fs = require('fs');
let html = fs.readFileSync('C:\\Users\\Atrik Samanta\\HRMS_Project\\lovable_source.html', 'utf8');

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
  
  /* Global smooth transition for theme switching */
  *, *::before, *::after {
    transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease !important;
  }
  
  /* Change cursor to pointer for options */
  li, button, a, [role="button"], [role="menuitem"], [role="option"], [role="tab"] {
    cursor: pointer !important;
  }
  
  /* Floating Toggle Button */
  #my-dark-mode-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    color: var(--foreground);
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  #my-dark-mode-toggle.show {
    opacity: 1;
  }
  #my-dark-mode-toggle:hover {
    background: var(--primary-soft);
    color: var(--primary-strong);
  }
</style>
`;

const customScript = `
<script>
  // Add floating dark mode toggle button safely after React hydration finishes
  window.addEventListener('load', () => {
      setTimeout(() => {
          const btn = document.createElement('button');
          btn.id = 'my-dark-mode-toggle';
          
          const updateIcon = () => {
              const isDark = document.documentElement.classList.contains('dark');
              btn.innerHTML = isDark ? 
                  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>' : 
                  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';
          };
          
          btn.onclick = () => {
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
          
          // Safely append to body AFTER hydration
          document.body.appendChild(btn);
          
          // Fade it in smoothly
          setTimeout(() => {
              btn.classList.add('show');
          }, 100);
          
      }, 1500); // Wait 1.5 seconds to guarantee React hydration is complete
  });
</script>
`;

// Also inject a script to bust the cache of service workers if they exist
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
console.log('Safe delay toggle injected into frontend_static/index.html');
