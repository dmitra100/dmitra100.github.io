# Portfolio Tracker

A single-page, client-only net worth tracker hosted on GitHub Pages. All data
stays in your browser's `localStorage` — nothing is sent to a server.

Live at: https://dmitra100.github.io/

## Asset classes supported

- Indian Stocks
- Indian ETFs
- Mutual Funds
- Global Stocks / ETFs
- RSU
- Bonds
- Fixed Deposits (auto-computed accrued value from principal, rate and dates)
- EPF
- NPS
- Gold / Silver
- Real Estate

## Live prices

Every field is manually editable, so the tracker works fully offline. For a
few categories it can also try to fetch live prices from free public APIs
(best-effort — depends on your browser allowing the cross-origin request):

- Indian Stocks/ETFs, Global Stocks/ETFs, RSU — Yahoo Finance chart API
- Mutual Funds — [mfapi.in](https://www.mfapi.in/)
- Gold/Silver — [gold-api.com](https://gold-api.com/) spot price, converted to INR/gram
- USD → INR rate — [frankfurter.app](https://www.frankfurter.app/)

If a fetch fails, the previously entered price is left untouched.

## Data

Use **Settings → Export Data** to download a JSON backup, and **Import Data**
to restore it (e.g. on a new browser/device).
