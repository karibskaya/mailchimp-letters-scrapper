const rq = require('request-promise-native');
const cheerio = require('cheerio');
const fse = require('fs-extra');

if (process.argv.length < 3) {
  console.error('URL not found');
  process.exit(1);
}

const TEST_URL = process.argv[2];
const DIR = `./files`;

async function run() {
  let html;

  try {
    html = await rq(TEST_URL);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }

  const $ = cheerio.load(html);
  const $header = $('#templateHeader');
  const $body = $('#templateBody');

  fse.ensureDirSync(DIR);

  await downloadImages($header, $);
  await downloadImages($body, $);

  console.log($header.html());
  console.log($body.html());
}

async function downloadImages($selector, $) {
  const $images = $selector.find('img');
  const urls = $images.map(function (i, el) { return $(this).attr('src'); }).get();

  for (let url of urls) {
    const imgName = url.split('?')[0].split('/').pop();
    const imgPath = `${DIR}/${imgName}`;

    try {
      await rq(url).pipe(fse.createWriteStream(imgPath));
    } catch (e) {
      console.error(e);
      process.exit(1);
    }

    $selector.find(`img[src="${url}"]`).attr('src', imgPath);
  }
}

run();
