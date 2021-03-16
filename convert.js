const showdown = require('showdown');
const fs = require('fs-extra');
const filename = 'README.md';
let pageTitle = process.argv[2] || 'README';

fs.readFile(__dirname + '/style.css', function (err, styleData) {
  fs.readFile(process.cwd() + '/' + filename, function (err, data) {
    if (err) {
      throw err;
    }
    let text = data.toString();

    converter = new showdown.Converter({
      ghCompatibleHeaderId: true,
      simpleLineBreaks: true,
      ghMentions: true,
      tables: true
    });

    let preContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${pageTitle}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div id='content'>
    `;

    let postContent = `
        </div>
        <style type='text/css'>${styleData}</style>
      </body>
    </html>`;

    html = preContent + converter.makeHtml(text) + postContent;

    converter.setFlavor('github');
    //console.log(html);

    let filePath = process.cwd() + '/dist/README.html';
    fs.writeFile(filePath, html, { flag: 'wx' }, function (err) {
      if (err) {
        console.log("File '" + filePath + "' already exists. Aborted!");
      } else {
        console.log('Done, saved to ' + filePath);

        fs.copySync(process.cwd() + '/assets', process.cwd() + '/dist/assets');
      }
    });
  });
});
