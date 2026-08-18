const fs = require('fs');

let html = fs.readFileSync('C:\\Users\\Atrik Samanta\\HRMS_Project\\lovable_source.html', 'utf8');

// Find the exact dashboard wrapper
let start = html.indexOf('<div class="min-h-screen bg-surface">');
let end = html.indexOf('</main></div></div>', start) + '</main></div></div>'.length;

let dashboardHtml = html.substring(start, end);

let jsx = dashboardHtml
    .replace(/class=/g, 'className=')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-linecap=/g, 'strokeLinecap=')
    .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/<!--.*?-->/g, '')
    .replace(/style="(.*?)"/g, (match, p1) => {
        const styleObj = {};
        p1.split(';').forEach(rule => {
            if (!rule.trim()) return;
            const [key, value] = rule.split(':');
            const camelKey = key.trim().replace(/-([a-z])/g, (m, w) => w.toUpperCase());
            styleObj[camelKey] = value.trim();
        });
        return `style={{${JSON.stringify(styleObj)}}}`;
    })
    .replace(/<input([^>]*[^/])>/g, '<input$1 />')
    .replace(/<img([^>]*[^/])>/g, '<img$1 />')
    .replace(/<hr([^>]*[^/])>/g, '<hr$1 />')
    .replace(/<br([^>]*[^/])>/g, '<br$1 />');


const finalContent = `import React, { useState, useEffect } from 'react';

export default function Dashboard() {
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

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <div className="min-h-screen bg-background font-sans antialiased text-foreground">
            ${jsx}
        </div>
    );
}`;

// Inject the toggle button before the bell icon
const bellButtonStart = `<button className="relative rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary-strong"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell" aria-hidden="true">`;

const toggleButton = `
<button onClick={toggleTheme} className="relative rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary-strong">
    {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
    )}
</button>
`;

fs.writeFileSync('C:\\Users\\Atrik Samanta\\HRMS_Project\\frontend\\src\\pages\\Dashboard.tsx', finalContent.replace(bellButtonStart, toggleButton + bellButtonStart));
console.log('Fixed Dashboard.tsx flawlessly and injected toggle button!');
