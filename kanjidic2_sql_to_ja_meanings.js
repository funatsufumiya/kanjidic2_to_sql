#!/usr/bin/env node

const filename = 'kanjidic2.sql';
const fs = require('fs');
const execSync = require('child_process').execSync;
const argv = require('argv');

argv.option([
  {
    name: 'from',
    short: 'f',
    type: 'int',
    description: '読み込み開始する行を指定します'
  },
  {
    name: 'to',
    short: 't',
    type: 'int',
    description: '読み込みする最後の行を指定します'
  }
]);

const args = argv.run();
const line_from = (typeof args.options.from === 'undefined')? null: args.options.from;
const line_to = (typeof args.options.to === 'undefined')? null: args.options.to;

const lineReader = require('readline').createInterface({
  input: fs.createReadStream(filename)
});

let line_num = 0;

lineReader.on('line', line => {
  ++line_num;

  if(line_from !== null && line_num < line_from){
    return;
  }

  if(line_to !== null && line_num > line_to){
    process.exit();
  }

  if(!line.startsWith('INSERT')){
    return;
  }

  line = line.replace('INSERT INTO kanjidic2 (utf, kanji, strokes, grade, meanings, ja_on, ja_kun) VALUES ','');
  let m = line.match(/^\('(.*?)', '(.*?)', \d+?, (?:\d+?|NULL), '(.*?)',/);
  let utf = m[1];
  let kanji = m[2];
  let means = m[3].split(',');
  let means_ja = means.map( (mean) => {
    let res = execSync(`trans -b en:ja "${mean}"`).toString();
    return res.replace(/\n/g, '');
  });
  let mean_ja = means_ja.join(',');
  console.error(`[${line_num}] ${utf} (${kanji}): ${mean_ja} | ${means}`);
  console.log(`${utf} (${kanji}): ${mean_ja} | ${means}`);
});
