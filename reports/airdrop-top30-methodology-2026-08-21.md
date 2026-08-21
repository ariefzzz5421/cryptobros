# Airdrop Top 30 methodology — 2026-08-21

## Why the page has two rankings

The term **airdrop value** is routinely used for two different measurements:

1. **Value at distribution** — the tokens actually distributed multiplied by a price on the distribution/TGE day.
2. **Peak value of the distributed allocation** — those same tokens multiplied by the token's later all-time-high price.

Crypto Bros keeps these measurements separate. The deep-case ranking on `/airdrops/` defaults to value at distribution. The new all-time Top 30 is explicitly labelled **Peak value of distributed allocation** because that is the methodology used by the widely cited CoinGecko historical ranking and it allows a broad historical comparison.

## Historical base table

CoinGecko, *50 Biggest Crypto Airdrops: $26.6B In 'Free Money'*, updated 2026-04-30:

https://www.coingecko.com/research/publications/biggest-crypto-airdrops

The source explicitly ranks the historical distributions at token ATH prices. The legacy values used by the app include Uniswap, ApeCoin, dYdX, Arbitrum, ENS, Internet Computer, BONK, Celestia, LooksRare, 1inch, Optimism, Blur, Aptos, Loot, Jito, Gitcoin and ParaSwap.

## Large post-2023 additions reconstructed for the board

The app stores the arithmetic alongside each reconstructed row so it is visible in the UI.

| Project | Distributed/allocation bucket used | ATH/peak used | Peak allocation value | Allocation source | Market/ATH source |
| --- | ---: | ---: | ---: | --- | --- |
| Hyperliquid | 310M HYPE | $76.87 | $23.8297B | The Block genesis-airdrop report | CoinGecko HYPE market record |
| Starknet | 726M STRK | $4.41 | $3.20166B | Starknet Provisions FAQ | CoinGecko STRK market record |
| Pudgy Penguins | 44.46B PENGU community buckets | $0.06845 | $3.04344B | CoinGecko tokenomics explainer | CoinGecko PENGU market record |
| Jupiter | 1B JUP | $2.00 | $2.0B | CoinGecko JUP airdrop explainer | CoinGecko JUP market record |
| Story | 100M IP | $14.78 documented 2025 peak | $1.478B | AirdropAlert 2025 dataset | CoinGecko IP market record |
| ZKsync | 3.675B ZK | $0.3210 | $1.179675B | ZK Nation token introduction | CoinGecko ZK market record |
| Berachain | ~79M BERA | $14.83 | $1.17157B | AirdropAlert 2025 dataset | CoinGecko BERA market record |
| Ethena | 750M ENA | $1.52 | $1.14B | The Block distribution report | CoinGecko ENA market record |
| Wormhole | 617.3M W | $1.66 | $1.024718B | Wormhole tokenomics | CoinGecko W market record |
| EigenLayer | ~113M EIGEN | $5.65 | $638.45M | Eigen Foundation Season 1 | CoinGecko EIGEN market record |
| LayerZero | 85M ZRO | $7.47 | $634.95M | The Block airdrop report | CoinGecko ZRO market record |
| Blast | 17B BLAST | $0.02918 | $496.06M | Blast Q2 2024 report | CoinGecko BLAST market record |

## Interpretation rules

- Multi-round distributions remain separate events. Blur round 1 and round 2 are intentionally two rows, not duplicate-data bugs.
- The all-time board is event-ranked, not project-grouped.
- Reconstructed rows must expose an allocation, an ATH/peak input, a formula and a source link.
- A later ATH is **not** described as launch-day value or realised recipient proceeds.
- The older deep-case dataset remains authoritative for distribution-day value, claimant/recipient counts and case-specific methodology.
- Remote project favicons have a text-initial fallback so missing artwork cannot break the table.

## Caveat

A peak-allocation calculation answers, “What was the maximum later market value of the tokens assigned to this distribution?” It does **not** imply every recipient held until the ATH or could have sold the entire allocation there. The UI says this explicitly.
