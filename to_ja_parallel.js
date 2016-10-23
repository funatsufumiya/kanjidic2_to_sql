#!/usr/bin/env node

const exec = require('child_process').exec;
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
  },
  {
    name: 'each',
    short: 'e',
    type: 'int',
    description: '一ファイルあたりの行数を指定します'
  }
]);

const args = argv.run();
const line_from = (typeof args.options.from === 'undefined')? null: args.options.from;
const line_to = (typeof args.options.to === 'undefined')? null: args.options.to;

if(line_from === null || line_to === null){
  console.error('引数が足りません');
  process.exit();
}

const once = args.options.each || 9;

let count = 0;
let line = line_from;
while(line <= line_to){
  ++count;
  let from = line;
  let to = (line_to - line >= once)? line + (once): line_to;
  let command = `./kanjidic2_sql_to_ja_meanings.js -f ${from} -t ${to} > /tmp/mean-${count}.txt`;
  console.log('[exec] ' + command);
  exec(command, function(){ console.log(`done: ${from}-${to}`); });
  line += (once + 1);
}
