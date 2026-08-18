const fs = require('fs');
let html = fs.readFileSync('C:\\Users\\Atrik Samanta\\HRMS_Project\\lovable_source.html', 'utf8');

let start = html.indexOf('<div class="min-h-screen bg-surface">');
let end = html.indexOf('<!-- React Counter Component Equivalent -->');
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

// Close the unclosed tags because we cut it off before the counter
jsx += '</div></div></main></div>';

const finalContent = `import React from 'react';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background font-sans antialiased text-foreground">
            ${jsx}
        </div>
    );
}`;

fs.writeFileSync('C:\\Users\\Atrik Samanta\\HRMS_Project\\frontend\\src\\pages\\Dashboard.tsx', finalContent);
console.log('Fixed Dashboard.tsx!');
