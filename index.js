const fs = require('fs');
const path = require('path');

const rq = require('request-promise-native');
const cheerio = require('cheerio');

module.exports = async function scrapper({ pages, dir, basepath }) {
  if (!Array.isArray(pages)) {
    pages = [pages];
  }

  ensureDir(dir);

  for (let page of pages) {
    await scrap({ page, dir, basepath });
  }
};

async function scrap({ page: { id, url }, dir, basepath} ) {
  let html;

  html = await rq(url);

  const $ = cheerio.load(html);
  const $header = $('#templateHeader');
  const $body = $('#templateBody');

  await scrapImages({ $, $object: $header, pageId: id, dir, basepath });
  await scrapImages({ $, $object: $body, pageId: id, dir, basepath });

  const content = $header.html() + $body.html();

  fs.writeFileSync(`${dir}/${id}.html`, content, { encoding: 'utf8' });
}

async function scrapImages({ $, $object, pageId, dir, basepath }) {
  const $images = $object.find('img');
  const urls = $images.map(function () { return $(this).attr('src'); }).get();

  for (let url of urls) {
    const imgName = url.split('?')[0].split('/').pop();
    const imgRelativeDir = `files/${pageId}`;
    const realImgDir = `${dir}/${imgRelativeDir}`;
    const realImgPath = path.normalize(`${realImgDir}/${imgName}`);
    const srcImgPath = path.normalize(`${basepath}/${imgRelativeDir}/${imgName}`);

    ensureDir(realImgDir);

    await rq(url).pipe(fs.createWriteStream(realImgPath));

    $object.find(`img[src="${url}"]`).attr('src', srcImgPath);
  }
}

function ensureDir(p, made = null) {
  p = path.resolve(p);

  try {
    fs.mkdirSync(p);
    made = made || p;
  } catch (err) {
    switch (err.code) {
      case 'ENOENT' :
        made = ensureDir(path.dirname(p), made);
        ensureDir(p, made);
        break;
      default:
        let stat;
        try {
          stat = fs.statSync(p);
        } catch (e) {
          throw err; // throw original error
        }

        if (!stat.isDirectory()) throw err; // throw original error

        break;
    }
  }

  return made;
}
