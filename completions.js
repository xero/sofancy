const env = require('node:process'),
	fs = require('node:fs'),
	os = require('node:os'),
	path = require('node:path'),
	util = require('node:util'),
	exec = util.promisify(require('node:child_process').exec),
	readline = require('node:readline'),
	rl = readline.createInterface({ input: process.stdin, output: process.stdout }),
	mac = process.platform === "darwin",
	// SIP blocks /usr/share on macOS even for root, so completions live under homebrew,
	// whose prefix the user owns. sudo strips HOMEBREW_PREFIX, hence the check on disk.
	// without homebrew, /usr/local is the one writable (with sudo) dir apple's zsh searches.
	brew = process.env.HOMEBREW_PREFIX || (fs.existsSync("/opt/homebrew") ? "/opt/homebrew" : "/usr/local"),
	zpath = `${mac ? brew : "/usr/local"}/share/zsh/site-functions/_sofancy`,
	zsh = `#compdef sofancy
_sofancy() {
	local state
	_arguments -C \\
		'(-f)'{-f,--font}'[pick a fancy font]:font:->font' \\
		'(-tf)-tf[pick a fancy font display with name]:font:->font' \\
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
				'cherokee' \\
				'circled' \\
				'currency' \\
				'cursive' \\
				'doublestruck' \\
				'flip' \\
				'frakturbold' \\
				'fraktur' \\
				'gothic' \\
				'greek' \\
				'invertedcircled' \\
				'invertedsquares' \\
				'italic' \\
				'mirrorflip' \\
				'mirror' \\
				'mono' \\
				'neon' \\
				'parenthesized' \\
				'runic' \\
				'sans' \\
				'script' \\
				'serifbolditalic' \\
				'serifitalic' \\
				'smallcaps' \\
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
				'tifinagh' \\
				'upperangle' \\
				'upsidedown' \\
				'wide'
    ;;
	esac
	return 0
}
_sofancy`,
	// both homebrew bash-completion versions read etc/bash_completion.d
	bpath = mac ? `${brew}/etc/bash_completion.d/sofancy` : "/usr/share/bash-completion/completions/sofancy",
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
		while read -r; do COMPREPLY+=("$REPLY"); done < <(compgen -W "$(_fancy_filter "alien asian asian2 bent bolditalic bold cherokee circled currency cursive doublestruck flip frakturbold fraktur gothic greek invertedcircled invertedsquares italic mirrorflip mirror mono neon parenthesized runic sans script serifbolditalic serifitalic smallcaps squares squiggle1 squiggle2 squiggle3 squiggle4 squiggle5 squiggle6 subscript superscript symbols tifinagh upperangle upsidedown wide")" -- "$cur")
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
	done = async (m = '', c = 0) => {
		(m !== '') && console.warn(m); process.exit(c);
	},
	prompt = async (m, r) => {
		console.log(m);
		const res = await rl[Symbol.asyncIterator]().next();
		// the iterator ends once readline closes: ctrl+c, ctrl+d, or piped input running out
		res.done && done("\naborted", 130);
		return r ? res.value.trim() : res.value.trim().toLowerCase().at(0) === "y";
	},
	install = async (l, c, s, b = true) => {
		b && console.log(`
+=================================+
| installing completions for ${s.padEnd(4)} |
+=================================+
`);
		try {
			await fs.promises.mkdir(path.dirname(l), { recursive: true });
			await fs.promises.writeFile(l, c, { mode: 0o644 });
			console.log(`file saved to: ${l}`);
			return true;
		} catch (e) {
			const p = await prompt(`error! failed to install to: "${l}" (${e.code})\npick a new location? [y/n]: `) && await prompt("enter a new directory:", true);
			if (p) return install(path.join(p.replace(/^~(?=\/|$)/, os.homedir()), `${s === "zsh" ? "_" : ""}sofancy`), c, s, false);
			console.warn(`skipping ${s} completions. try running again with sudo !!`);
			return false;
		}
	},
	completions = async () => {
		await prompt(`install shell completions? [y/n]:`) || done();
		const b = await cksh('bash') && await install(bpath, bash, 'bash'),
			z = await cksh('zsh') && await install(zpath, zsh, 'zsh');
		done(b || z ? "\nsofancy completions install complete. \ud835\udcdb\ud835\udcf8\ud835\udcdb! " : "\nno completions installed.");
	};
module.exports ={ completions }
