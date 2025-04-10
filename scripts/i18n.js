// This checks for new stings from _locales/en/messages.json and adds them
// to other translation files. Used by i18n.sh
'use strict';

function filterAccounts() {
  const query = document.getElementById("search").value.toLowerCase();
  const allAccounts = document.querySelectorAll(".account"); // use your actual class/structure here
  
  allAccounts.forEach(acc => {
    const label = acc.textContent.toLowerCase();
    acc.style.display = label.includes(query) ? "block" : "none";
  });
}

const fs = require('fs');

function readFile(filename) {
  let data = fs.readFileSync(filename);
  data = data.toString().replace(/^\uFEFF/, '');
  return JSON.parse(data);
}

let strings = readFile('_locales/en/messages.json');
let currentFile;
let missingKeys = [];

fs.readdir('_locales', function(err, items) {
    for (let i=0; i<items.length; i++) {
      if (items[i] !== 'en') {
        currentFile = readFile('_locales/' + items[i] + '/messages.json');
        missingKeys = Object.keys(strings).filter(string => !currentFile.hasOwnProperty(string));
        if (!missingKeys[0]) {
          continue;
        }
        for (let j=0; j<missingKeys.length; j++) {
          currentFile[missingKeys[j]] = strings[missingKeys[j]]
          fs.writeFile('_locales/' + items[i] + '/messages.json', JSON.stringify(currentFile, null, 4), (err) => {
            if (err) throw err;
          })
        }
      }
    }
});
