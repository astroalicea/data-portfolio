# Project 1 - Crypto Price Formatter
#Description: formats and displays crypto market clenanly
#Author: Luis
#Date: 2026-04-16


coins = {
    "Bitcoin":      {"price": 77329.32, "change": 2.81},
    "Ethereum":     {"price": 2471.39, "change": 3.01},
    "Solana":       {"price": 89.40, "change": -0.1},
    "Chainlink":    {"price": 9.68, "change": 0.70},
    "Hyperliquid":  {"price": 44.22, "change": .80}
}

for coin, data in coins.items():
    print(f"{coin}: ${data['price']:,.2f} | 24h change: {data['change']:.2f}%")

total_coins = len(coins)
highest = max(coins, key=lambda coin: coins[coin]["change"])
lowest = min(coins, key=lambda coin: coins[coin]["change"])

print("-" * 45)
print(f"Coins tracked: {total_coins}")
print(f"Top performer: {highest} ({coins[highest]['change']:.2f}%)")
print(f"Worst performer: {lowest} ({coins[lowest]['change']:.2f}%)")
print("-" * 45)