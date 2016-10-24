#!/usr/bin/env node

const filename = 'ja_meanings.txt';
const fs = require('fs');
const lineReader = require('readline').createInterface({
  input: fs.createReadStream(filename)
});

const table = 'kanjidic2_ja';

let prev_utf = '';

console.log(`
DROP TABLE IF EXISTS ${table};
CREATE TABLE ${table} (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  utf varchar(32) NOT NULL,
  kanji varchar(2) NOT NULL,
  meanings TEXT,
  UNIQUE KEY utf (utf),
  KEY kanji (kanji),
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);

let count = 0;
const reg = /^([0-9A-F]+) \((.+?)\): ([^|]*) \|/;

lineReader.on('line', line => {
  let m = line.match(reg);
  if( m != null ){
    let utf = m[1];
    let kanji = m[2];
    let mean = m[3];
    let sql = `INSERT INTO ${table} (utf, kanji, meanings) VALUES ('${utf}', '${kanji}', '${mean}')`;
    console.log(sql);
  }else{
    console.error('[ERROR] Not match');
    console.error(line);
    process.exit(1);
  }
});
