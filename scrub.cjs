const fs = require('fs');

function scrub(file) {
    let html = fs.readFileSync(file, 'utf8');

    html = html.replace(/<script class="\$tsr".*?<\/script>/s, '');
    html = html.replace(/<script type="module" async="" src="\/assets\/index-CMyvCMRG\.js"><\/script>/s, '');
    html = html.replace(/<link rel="modulepreload".*?>/g, '');
    html = html.replace(/<!--\/\$-->/g, '');

    fs.writeFileSync(file, html);
    console.log('Removed React scripts from', file);
}

scrub('C:\\Users\\Atrik Samanta\\HRMS_Project\\frontend_static\\login.html');
scrub('C:\\Users\\Atrik Samanta\\HRMS_Project\\frontend_static\\signup.html');
