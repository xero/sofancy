#!/usr/bin/env node
const fs = require("fs").promises;
const path = require("path");
let charmap,
  find,
  font,
  str = "",
  titles = false;

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
`);
  process.exit();
}
function setArgs() {
  const { parseArgs } = require("node:util");
  const args = process.argv.slice(2);
  const options = {
    font: {
      type: "string",
      short: "f",
    },
    titles: {
      type: "boolean",
      short: "t",
    },
  };
  try {
    const { values, positionals } = parseArgs({
      args,
      options,
      allowPositionals: true,
    });
    font = values.font || false;
    find = !font ? /.*json$/ : new RegExp(`\\b${font}.json\\b`, "gi");
    titles = values.titles || false;
    str = positionals.join(" ") || usage()
  } catch (e) {
    usage();
  }
}
const walk = async (dir, filelist = []) => {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = await fs.stat(filepath);

    if (stat.isDirectory()) {
      filelist = await walk(filepath, filelist);
    } else {
      if (file.match(find)) {
        filelist.push(file);
        charmap = require(__dirname + `/fonts/${file}`);
        let title = titles ? file.replace(".json", "").padEnd(15) : "";
        console.log(
          title +
            str.replace(/./g, function (s) {
              if (s in charmap) {
                return charmap[s];
              } else if (s.toLowerCase() in charmap) {
                return charmap[s.toLowerCase()];
              } else if (s.toUpperCase() in charmap) {
                return charmap[s.toUpperCase()];
              } else {
                return s;
              }
            })
        );
      }
    }
  }
};
setArgs();
walk(__dirname + "/fonts");
