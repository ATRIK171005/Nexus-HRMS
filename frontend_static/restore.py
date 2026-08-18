with open('index.html', encoding='utf-8') as f:
    html = f.read()

html = html.replace('/assets/styles-NTL0jLd5.css', '/assets/index-B75WAirH.css')
html = html.replace('/assets/index-CMyvCMRG.js', '/assets/index-cIWrBSmz.js')
html = html.replace('<link rel="modulepreload" href="/assets/routes-C6tBpSR4.js"/>', '')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
