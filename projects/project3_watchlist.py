#Project 3 - Crypto Watchlist
#Descriptive: personal watchlist tracker with functions that return values
#Author: Luis
#DAte: 04-17-2026

watchlist = {
    "Bitcoin":      {"price": 77394.32, "change": 2.81, "volume": 28_000_000_000},
    "Ethereum":     {"price": 2471.48, "change": 3.01, "volume": 14_000_000_000},
    "Solana":       {"price": 89.40, "change": -0.10, "volume": 2_000_000_000},
    "Chainlink":    {"price": 9.68, "change": 0.70, "volume": 500_000_000},
    "Hyperliquid":  {"price": 44.22, "change": 0.80, "volume": 800_000_000}
}

def get_top_mover(watchlist):
    """Returns the coin name with highest 24h change."""
    return max(watchlist, key=lambda coin: watchlist[coin]["change"])


def get_worst_mover(watchlist):
    """Returns the coin name with lowest 24h change."""
    return min(watchlist, key=lambda coin: watchlist[coin]["change"])


def get_total_volume(watchlist):
    """Returns the total combined volume of all coins."""
    return sum(watchlist[coin]["volume"] for coin in watchlist)



def get_summary(watchlist):
    """Prints a fell watchlist summary report."""
    top = get_top_mover(watchlist)
    worst = get_worst_mover(watchlist)
    total = get_total_volume(watchlist)

    print("-" * 40)
    print("WATCHLIST SUMMARY")
    print("-" * 40)

    for name, data in watchlist.items():
        print(f"{name}: ${data['price']:,.2f} | 24h change: {data['change']:.2f}% | Volume: {data['volume']:,.0f}")


    print("-" * 40)
    print(f"Top Mover:    {top} ({watchlist[top]['change']:.2f}%)")
    print(f"Worst Mover:  {worst} ({watchlist[worst]['change']:.2f}%)")
    print(f"Total Volume: ${total:,.0f}")
    print("-" * 40)

get_summary(watchlist)


   


