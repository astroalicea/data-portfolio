#Project 3 - Crypto Watchlist
#Descriptive: personal watchlist tracker with functions that return values
#Author: Luis
#DAte: 04-17-2026

watchlist = {
    "Bticoin":      {"price": 77394.32, "change": 2.81, "volume": 28_000_000_000},
    "Ethereum":     {"price": 2471.48, "change": 3.01, "volume": 14_000_000_000},
    "Solana":       {"price": 89.40, "change": -0.10, "volume": 2_000_000_000},
    "Chainlink":    {"price": 9.68, "change": 0.70, "volume": 500_000_000},
    "Hyperliquid":  {"price": 44.22, "change": 0.80, "volume": 800_000_000}
}

def get_top_mover(watchlist):
    """Returns the coin name with hgihest 24h change."""
    return max(watchlist, key=lambda coin: watchlist[coin]["change"])
top = get_top_mover(watchlist)
print(f"Top Mover: {top} ({watchlist[top]['change']:.2f}%)")