const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const scrap = require('../');

const BASEPATH = 'example.com/images/';
const RESULT_DIR = path.resolve(__dirname, './result/');
const TEST_URL = 'http://eepurl.com/dmsYyv';
const TEST_ID = 'butt';

scrap({
  basepath: BASEPATH,
  dir: RESULT_DIR,
  pages: {
    id: TEST_ID,
    url: TEST_URL,
  }
})
  .then(() => {
    if (!fs.existsSync(`${RESULT_DIR}/files/${TEST_ID}`)) {
      fail('Files dir are not found.');
    }

    const resultFile = fs.readFileSync(`${RESULT_DIR}/${TEST_ID}.html`, { encoding: 'utf8' });

    if (!resultFile.includes(`src="${BASEPATH}`)) {
      fail('Rebased image sources are not found.')
    }

    execSync(`rm -rf ${RESULT_DIR}`);
  })
  .catch(fail);

function fail(str) {
  execSync(`rm -rf ${RESULT_DIR}`);
  console.error(str);
  process.exit(1);
}
