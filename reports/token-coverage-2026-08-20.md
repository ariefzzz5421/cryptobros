# Token coverage audit — 20 Aug 2026

This is a point-in-time audit of the 100 tokens returned by the homepage
memecoin market basket. Live membership and values can change after this file
is published.

## Identity and detail links

- Homepage links checked: **100**
- Exact `chain + contract` identities: **91**
- Provider-only records with no contract returned by CoinGecko: **9**
- Curated registry records: **13**
- Curated stored DexScreener pairs verified against the exact contract: **12**

Provider-only IDs:

`dogs-2`, `fins`, `my-paqman-coin`, `notcoin`, `pepecoin-network`, `purr-2`,
`snek`, `the-grays-currency`, `utya`.

These records still open the token detail shell. The contract, explorer, Lore,
and Dex chart remain explicitly unavailable until a source verifies identity.

## Lore coverage

All detail pages contain a Lore card. Thirteen curated registry records have a
source-backed summary. In the current homepage basket, the following 89 IDs use
the honest fallback `Lore not sufficiently verified yet.`:

`ai-xovia`, `aixbt`, `america-party-5`, `ape-and-pepe`, `apes-2-2`,
`asteroid-shiba`, `baby-claw`, `baby-doge-coin`, `banana-for-scale-2`,
`based-brett`, `basedhype`, `bermuda-shorts`, `bianrensheng`,
`binance-peg-dogecoin`, `binance-peg-shib`, `book-of-meme`, `build-on`,
`bulla-3`, `burnedfi`, `cat-in-a-dogs-world`, `cheems-token`, `coco-2`,
`comedian`, `constitutiondao`, `degen-base`, `dog-go-to-the-moon-rune`,
`dogbull`, `dogelon-mars`, `dogs-2`, `fartcoin`, `fins`, `gekko`,
`gigachad-2`, `giggle-fund`, `gohome`, `hundred`, `kekius-maximus-6`,
`loaded-lions`, `lobster-2`, `lucidum`, `marscoin-4`, `melania-meme`,
`meme-horse`, `memecoin-2`, `memecore`, `memetoon`, `mog-coin`, `moo-deng`,
`moolah`, `mowcat`, `mubarak`, `my-paqman-coin`, `myonion-fun`, `neet`,
`neiro-3`, `niu-lai`, `non-playable-coin`, `notcoin`, `nyc-token`,
`official-fo`, `ordinals`, `osk`, `peanut-the-squirrel`, `pepecoin-network`,
`pipedog`, `pippin`, `popcat`, `pump-fun`, `purr-2`, `qkacoin`, `rekt-4`,
`ribbita-by-virtuals`, `siren-2`, `sixseven`, `smilek`, `snek`, `spx6900`,
`tdccp`, `the-grays-currency`, `toshi`, `turbo`, `tutorial`, `useless-3`,
`utya`, `wiki-cat`, `wojak-5`, `would`, `yzy`, `zerebro`.

## DexScreener coverage

The full live audit queried DexScreener by exact contract for 90 smart-contract
tokens. Exact pairs were returned for **84**. No exact pair was returned for:

`apes-2-2`, `baby-claw`, `myonion-fun`, `nyc-token`, `qkacoin`, `smilek`.

The nine provider-only records above cannot be checked contract-first. Dogecoin
is a native asset and is intentionally not sent through a token-contract pair
resolver.

## Launchpad ranking snapshot

Metric: **DeFiLlama 30-day platform fees**, sorted dynamically.

| Rank | Launchpad | 30d fees | Verified project rows available in final audit |
|---:|---|---:|---:|
| 1 | Pump.fun | $37,297,765 | 5 |
| 2 | Pons | $19,407,757 | 4 |
| 3 | Virtuals Protocol | $895,836 | 9 |
| 4 | Four.meme | $685,767 | 4 |
| 5 | Bags | $358,452 | 5 |

Fewer than ten rows are intentional when the live category endpoint is delayed
or the sourced fallback set contains fewer verified projects.
