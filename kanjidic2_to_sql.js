#!/usr/bin/env node

const filename = 'kanjidic2.xml';
const fs = require('fs');
const lineReader = require('readline').createInterface({
  input: fs.createReadStream(filename)
});

const table = 'kanjidic2';

let prev_utf = '';

console.log(`
DROP TABLE IF EXISTS ${table};
CREATE TABLE ${table} (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  utf varchar(32) NOT NULL,
  kanji varchar(2) NOT NULL,
  strokes TINYINT NOT NULL,
  grade TINYINT,
  meanings TEXT,
  ja_on TEXT,
  ja_kun TEXT,
  UNIQUE KEY utf (utf),
  KEY kanji (kanji),
  key strokes (strokes)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);

function get_sql(data){
  return '';
}

let data = {};

lineReader.on('line', line => {
  if( line.startsWith('<character>') ){
    // console.log(get_sql(data));
    console.log(data);
    data = {};
  }else if( line.startsWith('<literal>') ){
    let m = line.match(/^<literal>(.*)<\/literal>/);
    data['kanji'] = m[1];
  }else if( line.startsWith('<grade>') ){
    let m = line.match(/^<grade>(.*)<\/grade>/);
    data['grade'] = m[1];
  }else if( line.startsWith('<stroke_count>') ){
    let m = line.match(/^<stroke_count>(.*)<\/stroke_count>/);
    data['stroke_count'] = m[1];
  }else if( line.startsWith('<cp_value cp_type="ucs">') ){
    let m = line.match(/^<cp_value cp_type="ucs">(.*)<\/cp_value>/);
    data['utf'] = m[1];
  }else if( line.startsWith('<reading r_type="ja_on">') ){
    let m = line.match(/^<reading r_type="ja_on">(.*)<\/reading>/);
    data['ja_on'] = m[1];
  }else if( line.startsWith('<reading r_type="ja_kun">') ){
    let m = line.match(/^<reading r_type="ja_kun">(.*)<\/reading>/);
    data['ja_kun'] = m[1];
  }
});
