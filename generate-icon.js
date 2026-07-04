const fs = require('fs');
const img = fs.readFileSync('public/images/logo1.jpg');
const b64 = img.toString('base64');
const svg = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="circle">
      <circle cx="16" cy="16" r="16" />
    </clipPath>
  </defs>
  <image href="data:image/jpeg;base64,${b64}" x="0" y="0" width="32" height="32" clip-path="url(#circle)" preserveAspectRatio="xMidYMid slice"/>
</svg>`;
fs.writeFileSync('src/app/icon.svg', svg);
try { fs.unlinkSync('src/app/icon.jpg'); } catch (e) {}
