# Project 2 - Coin Categorizer
# Description: categorizes coins by price tier and market signal
# Author: Luis
# Date: 2026-04-17

coins = [
    ("Bitcoin", 77329.32),
    ("Ethereum", 2471.39),
    ("Solana", 89.40),
    ("Chainlink", 9.68),
    ("Hyperliquid", 44.22),
    ("Pepe", 0.000012),
    ("Cardano", 0.45),
    ("Avalanche", 28.73),
]

categories = {
    "Large Cap": 0,
    "Mid Cap": 0,
    "Small Cap": 0,
    "Micro Cap": 0
}

for name, price in coins:
    if price > 1000:
        category = "Large Cap"
        categories[category] += 1
    elif price > 1:
        category = "Mid Cap"
        categories[category] += 1
    elif price > 0.01:
        category = "Small Cap"
        categories[category] += 1
    else:
        category = "Micro Cap"
        categories[category] += 1
    if price < 0.01:
        formatted_price = f"${price:.8f}"
    else:
        formatted_price = f"${price:,.2f}"
    print(f"{name}: {formatted_price} | {category}")

    

print("-" * 35)
print("Market Summary:")
for cap, count in categories.items():
    label = "coin" if count == 1 else "coins"
    print(f"    {cap}: {count} {label}")
print("-" * 35)
