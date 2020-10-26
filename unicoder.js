#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

var charmap,str='';
for(var v of process.argv.splice(2,process.argv.length-1)) {
	str+=" "+v;
}

const walk = async (dir, filelist = []) => {
	const files = await fs.readdir(dir);

	for (file of files) {
		const filepath = path.join(dir, file);
		const stat = await fs.stat(filepath);

		if (stat.isDirectory()) {
			filelist = await walk(filepath, filelist);
		} else {
			if(file.match(/.*json$/)) {
				filelist.push(file);
				charmap = require(__dirname+`/lib/${file}`);
				console.log(
					file.replace(".json", "").padEnd(15)+
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
walk(__dirname+'/lib');
