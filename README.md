# MailChimp letters scrapper

A small package that downloads emails created by MailChimp and saves their content (markup and images) to a directory. 

## Example

```js
const path = require('path');
const scrap = require('mailchimp-letters-scrapper');

const BASEPATH = 'http://example.com/images/';
const RESULT_DIR = path.resolve(__dirname, './letters');
const URL = 'http://eepurl.com/dmsYyv';
const ID = 'butt';

scrap({
  basepath: BASEPATH,
  dir: RESULT_DIR,
  pages: {
    id: ID,
    url: URL,
  }
})
```

## Parameters

There are three parameters in example above:

- `basepath`, a string that is used for appending paths to images in email's markup;
- `dir`, a path to result directory, where you need to save downloaded letters;
- `pages`, an array of objects (or just an object) that contain `id` and `url`,
  where `id` is an unique ID of a letter, and `url` is an URL for the letter.
  
See [tests]('.test/index.js') for more information.
