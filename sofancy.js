#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const parseArgs = require('minimist-lite');
let argv = require('minimist-lite')(process.argv.slice(2));
let charmap,find,font,str='',titles=false;

function usage() {
	console.log(`usage: sofancy [-f (font) | -t] string

 flags:
  -f|--font (font) : output in a single font
  -t|--titles      : display titles in output

 examples:
  sofancy -f wide aesthetics
ａｅｓｔｈｅｔｉｃｓ
  sofancy -tf neon llamas | sed 's/neon.* /txt: /'
txt: ᒪᒪᗩᗰᗩᔕ
  sofancy -t some string | fzf | xsel -i
  git commit -m "style(docs): $(sofancy -f bolditalic STYLIN)"
`)
	process.exit();
}
function setArgs() {
	font=(argv.f || argv.font) ? argv.f || argv.font : false;
	find=(!font) ? /.*json$/ : new RegExp(`\\b${font}.json\\b`, 'gi');
	titles=(argv.t || argv.titles) ? true : false;
	if (argv.t && !font) {
		str=argv.t+" "+argv._.toString().replace(',', ' ');
	} else if (argv.titles && !font) {
		str=argv.titles+" "+argv._.toString().replace(',', ' ');
	} else {
		str=argv._.toString().replace(',', ' ');
	}
	if (str == '') { usage(); }
}
const walk = async (dir, filelist = []) => {
	const files = await fs.readdir(dir);

	for (file of files) {
		const filepath = path.join(dir, file);
		const stat = await fs.stat(filepath);

		if (stat.isDirectory()) {
			filelist = await walk(filepath, filelist);
		} else {
			if(file.match(find)) {
				filelist.push(file);
				charmap = require(__dirname+`/fonts/${file}`);
				let title=(titles) ? file.replace(".json", "").padEnd(15) : '';
				console.log(
					title+
					str.replace(/./g, function (s) {
						if(s in charmap) {
							return charmap[s]
						} else if (s.toLowerCase() in charmap) {
							return charmap[s.toLowerCase()]
						} else if (s.toUpperCase() in charmap) {
							return charmap[s.toUpperCase()]
						} else {
							return s
						}
					})
				)
			}
		}
	}
}
setArgs();
walk(__dirname+'/fonts');
