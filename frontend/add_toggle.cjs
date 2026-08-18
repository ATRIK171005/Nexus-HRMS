const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\Atrik Samanta\\HRMS_Project\\frontend\\src\\pages\\Dashboard.tsx', 'utf8');

const importReplacement = `import React, { useState, useEffect } from 'react';`;
code = code.replace(/import React from 'react';/, importReplacement);

const componentTop = `export default function Dashboard() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark') || 
                   (localStorage.getItem('nexus-theme') === 'dark') ||
                   (!localStorage.getItem('nexus-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('nexus-theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('nexus-theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);`;

code = code.replace(/export default function Dashboard\(\) \{/, componentTop);

const iconsToInjectBefore = `<button className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary-strong">`;

const toggleButton = `
<button onClick={toggleTheme} className="relative rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary-strong">
    {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
    )}
</button>
`;

code = code.replace(iconsToInjectBefore, toggleButton + iconsToInjectBefore);

fs.writeFileSync('C:\\Users\\Atrik Samanta\\HRMS_Project\\frontend\\src\\pages\\Dashboard.tsx', code);
console.log('Added theme toggle to Dashboard!');
