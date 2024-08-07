const env = require('node:process'),
	fs = require('node:fs'),
	util = require('node:util'),
	exec = util.promisify(require('node:child_process').exec),
	readline = require('node:readline'),
	rl = readline.createInterface({ input: process.stdin, output: process.stdout }),
	zpath = "/usr/local/share/zsh/site-functions/_sofancy",
	zsh = `#compdef sofancy
_sofancy() {
	local state
	_arguments -C \\
		'(-f)'{-f,--font}'[pick a fancy font]:font:->font' \\
		'(-tf)'{-tf,--titledfont}'[pick a fancy font display with name]:font:->font' \\
		'(-t)'{-t,--titles}'[display font names]'\\
		'(-r)'{-r,--random}'[randomized font]'\\
		'(-c)'{-c,--completions}'[install shell completions]'\\
		'(-h)'{-h,--help}'[display usage]'
		case "$state" in
		(font)
			_values 'fonts' \\
				'alien' \\
				'asian' \\
				'asian2' \\
				'bent' \\
				'bolditalic' \\
				'bold' \\
				'circled' \\
				'currency' \\
				'cursive' \\
				'doublestruck' \\
				'flip' \\
				'frakturbold' \\
				'fraktur' \\
				'greek' \\
				'invertedsquares' \\
				'italic' \\
				'mirrorflip' \\
				'mirror' \\
				'mono' \\
				'neon' \\
				'squares' \\
				'squiggle1' \\
				'squiggle2' \\
				'squiggle3' \\
				'squiggle4' \\
				'squiggle5' \\
				'squiggle6' \\
				'subscript' \\
				'superscript' \\
				'symbols' \\
				'upperangle' \\
				'upsidedown' \\
				'wide'
    ;;
	esac
	return 0
}
_sofancy`,
	bpath = "/usr/share/bash-completion/completions/sofancy",
	bash = `_fancy_filter() {
	local words="$1"
	local cur=\${COMP_WORDS[COMP_CWORD]}
	local result=()

	if [[ "\${cur:0:1}" == "-" ]]; then
		echo "$words"
	else
		for word in $words; do
			[[ "\${word:0:1}" != "-" ]] && result+=("$word")
		done
		echo "\${result[*]}"
	fi
}
_sofancy_completions() {
	local cur=\${COMP_WORDS[COMP_CWORD]}
	local compwords=("\${COMP_WORDS[@]:1:$COMP_CWORD-1}")
	local compline="\${compwords[*]}"

	case "$compline" in
	*'--font' | *'-f' | *'-tf')
		while read -r; do COMPREPLY+=("$REPLY"); done < <(compgen -W "$(_fancy_filter "alien asian asian2 bent bolditalic bold circled currency cursive doublestruck flip frakturbold fraktur greek invertedsquares italic mirrorflip mirror mono neon squares squiggle1 squiggle2 squiggle3 squiggle4 squiggle5 squiggle6 subscript superscript symbols upperangle upsidedown wide")" -- "$cur")
		;;
	*)
		while read -r; do COMPREPLY+=("$REPLY"); done < <(compgen -W "$(_fancy_filter "--font -f --titles -t --random -r --completions -c --help -h")" -- "$cur")
		;;
	esac
} &&
	complete -F _sofancy_completions sofancy`,
	cksh = async (sh) => {
		try { const r = await exec(`which ${sh}`, { encoding: 'utf8' }); return r.stdout }
		catch (e) { return e.status }
	},
	done = async (m = '') => {
		(m !== '') && console.warn(m); process.exit(0);
	},
	prompt = async (m, r) => {
		console.log(m);
		const it = rl[Symbol.asyncIterator]();
		let res = await it.next();
		return (!r) ? (res.value.trim().toLowerCase().at(0) === "y") ? true : false : res.value.trim();
	},
	install = async (l, c, s, b = true) => {
		b && console.log(`
+=================================+
| installing completions for ${s} |
+=================================+
`);
		return new Promise((r, x) => {
			fs.writeFile(l, c, { mode: 0o644 }, async (err) => {
				if (err) {
					if (await prompt(`error! failed to install to: "${l}"\npick a new location? [y/n]: `)) {
						var p = await prompt("enter a new path:", true);
						if (p.at(-1) != '/') {
							p += '/';
						}
						r(await install(((s === "zsh") ? p + "_" : p) + "sofancy", c, s, false));
					} else {
						x(done("try running again with sudo !!"));
					}
				} else {
					r(console.log(`file saved to: ${l}`));
				}
			});
		});
	},
	completions = async () => {
		await prompt(`install shell completions? [y/n]:`) || done();
		await cksh('bash') && await install(bpath, bash, 'bash').catch(() => { });
		await cksh('zsh') && await install(zpath, zsh, 'zsh ').catch(() => { });
		done("\nsofancy completions install complete. \ud835\udcdb\ud835\udcf8\ud835\udcdb! ");
	};
module.exports ={ completions }
