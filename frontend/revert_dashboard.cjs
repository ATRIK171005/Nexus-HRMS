const fs = require('fs');

let html = fs.readFileSync('C:\\Users\\Atrik Samanta\\HRMS_Project\\frontend_static\\index.html', 'utf8');

let start = html.indexOf('<div class="min-h-screen bg-surface">');
let end = html.indexOf('<script>document.addEventListener("DOMContentLoaded"', start);
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
    .replace(/<br([^>]*[^/])>/g, '<br$1 />')
    .replace(/onclick="[^"]*"/g, 'onClick={handleSignout}');

// find the React counter component block in the original html string
const counterStartMarker = '<div className="relative rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[var(--shadow-lift)] p-5 lg:col-span-2 flex flex-col items-center justify-center gap-4">';
const counterIndex = jsx.indexOf(counterStartMarker);

if (counterIndex !== -1) {
    // we want to completely remove this counter block.
    // In index.html, it's inside `<div class="grid gap-4 lg:grid-cols-6">` ... `</div>`
    // And ends right before `</main>`. So if we cut off at counterIndex, we need to manually append:
    jsx = jsx.substring(0, counterIndex) + '</div></div></main></div></div>';
} else {
    // wait, if it wasn't replaced, index.html might not have the "React Counter Component Equivalent" comment?
    // Let's check index.html. The comment was `<!-- React Counter Component Equivalent -->`
    // but the `replace(/<!--.*?-->/g, '')` removed the comment.
    // So the marker is the <div>.
    const counterIndex2 = jsx.indexOf('Component Example');
    if (counterIndex2 !== -1) {
        const divIndex = jsx.lastIndexOf('<div', counterIndex2);
        jsx = jsx.substring(0, divIndex) + '</div></div></main></div></div>';
    }
}

const finalCode = `import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    
    const handleSignout = () => {
        sessionStorage.removeItem('isLoggedIn');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background font-sans antialiased text-foreground">
            ${jsx}
        </div>
    );
}
`;

fs.writeFileSync('C:\\Users\\Atrik Samanta\\HRMS_Project\\frontend\\src\\pages\\Dashboard.tsx', finalCode);
console.log('Reverted successfully!');
