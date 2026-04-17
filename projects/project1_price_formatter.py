# Project 1 - Crypto Price Formatter
#Description: formats and displays crypto market clenanly
#Author: Luis
#Date: 2026-04-16

coin = "Bitcoin"
price = 75670.00
change = 2.34

print(f"{coin}: ${price:,.2f} | 24h change: {change}%")

coin2 = "Ethereum"
price2 = 2374.52
change2 = 1.50

print(f"{coin2}: ${price2:,.2f} | 24h change: {change2:.2f}%")

coin3 = "Solana"
price3 = 88.79
change3 = 4.00

print(f"{coin3}: ${price3:,.2f} | 24h change: {change3:.2f}%")

coin4 = "Chainlink"
price4 = 9.62
change4 = 3.10

print(f"{coin4}: ${price4:,.2f} | 24h change: {change4:.2f}%")

coin5 = "Hyperliquid"
price5 = 44.13
change5 = -2.10

print(f"{coin5}: ${price5:,.2f} | 24h change: {change5:.2f}%")