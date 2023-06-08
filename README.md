# sofancy

fun unicode font tool

## examples

```
asian           ㄚㄖㄩ 丂ㄖ 千卂几匚ㄚ
asian2          ﾘのひ 丂の ｷﾑ刀ᄃﾘ
bent            Ӌօմ Ϛօ Ƒąղçվ
bold            𝐘𝐨𝐮 𝐒𝐨 𝐅𝐚𝐧𝐜𝐲
bolditalic      𝙔𝙤𝙪 𝙎𝙤 𝙁𝙖𝙣𝙘𝙮
circled         Ⓨⓞⓤ Ⓢⓞ Ⓕⓐⓝⓒⓨ
currency        ɎØɄ ₴Ø ₣₳₦₵Ɏ
cursive         𝓨𝓸𝓾 𝓢𝓸 𝓕𝓪𝓷𝓬𝔂
doublestruck    𝕐𝕠𝕦 𝕊𝕠 𝔽𝕒𝕟𝕔𝕪
flip            ⅄on Ƨo Էɑucλ
fraktur         𝔜𝔬𝔲 𝔖𝔬 𝔉𝔞𝔫𝔠𝔶
frakturbold     𝖄𝖔𝖚 𝕾𝖔 𝕱𝖆𝖓𝖈𝖞
futureAlien     ᖻᓍᑘ Sᓍ ᖴᗩᘉᑢᖻ
greek           уσυ ѕσ ƒαη¢у
invertedsquares 🆈🅾🆄 🆂🅾 🅵🅰🅽🅲🆈
italic          𝘠𝘰𝘶 𝘚𝘰 𝘍𝘢𝘯𝘤𝘺
mirror          γoυ Ƨo ꟻɒИɔγ
mirrorflip      ⅄on So ꓞɐuɔʎ
mono            𝚈𝚘𝚞 𝚂𝚘 𝙵𝚊𝚗𝚌𝚢
neon            YOᑌ ᔕO ᖴᗩᑎᑕY
squares         🅈🄾🅄 🅂🄾 🄵🄰🄽🄲🅈
squiggle1       ץ๏ย ร๏ Ŧคภςץ
squiggle2       Yσυ Sσ Fαɳƈყ
squiggle3       ʏօʊ ֆօ ʄǟռƈʏ
squiggle4       ᎩᎧᏬ ᏕᎧ ᎦᏗᏁፈᎩ
squiggle5       ყơų ʂơ ʄąŋƈყ
squiggle6       ฯ໐น Ş໐ fคຖ¢ฯ
subscript       Yₒᵤ ₛₒ Fₐₙcy
superscript     ʸᵒᵘ ˢᵒ ᶠᵃⁿᶜʸ
symbols         ¥ðµ §ð £åñ¢¥
upperangle      YӨЦ ƧӨ FΛПᄃY
upsidedown      ⅄on So Ⅎɐuɔʎ
wide            Ｙｏｕ Ｓｏ Ｆａｎｃｙ
```

## usage

__ῳɛıཞɖ ųŋıƈơɖɛ ʄƖɛҳıŋɠ? 😜__

```
usage: sofancy [-f (font) | -t] string

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
```
## install
clone and install
```
git clone git@github.com:xero/sofancy.git sofancy
cd sofancy
npm i -g .
```

~~use `npm` to globally install~~ (this seems to still not be working, help?)

`npm i -g sofancy`

### note
on unix systems node "bins" are normally placed in `/usr/local/lib/node` or `/usr/local/lib/node_modules` unless your export a custom `NODE_PATH`. either way, make sure the appropriate directory is in your path.


## license

![kopimi logo](https://gist.githubusercontent.com/xero/cbcd5c38b695004c848b73e5c1c0c779/raw/6b32899b0af238b17383d7a878a69a076139e72d/kopimi-sm.png)

all files and scripts in this repo are released [CC0](https://creativecommons.org/publicdomain/zero/1.0/) / [kopimi](https://kopimi.com)! in the spirit of _freedom of information_, i encourage you to fork, modify, change, share, or do whatever you like with this project! `^c^v`
