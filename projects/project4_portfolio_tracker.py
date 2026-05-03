# Project 4 - Portfolio Tracker
# Description: tracks crypto holdings, values, and portfolio allocation
# Author: Luis
# Date: 2026-04-17

portfolio = {
    "Bitcoin":  {"amount": 0.5, "buy_price": 60000.00, "current_price": 77234.32},
    "Ethereum": {"amount": 3.0, "buy_price": 2000.00, "current_price": 2471.48},
    "Solana":   {"amount": 10.0, "buy_price": 120.00, "current_price": 89.40},
    "Chainlink": {"amount": 50.0, "buy_price": 8.00, "current_price": 9.68}, 
    "Hyperlink": {"amount": 20.0, "buy_price": 30.00, "current_price": 44.22}
}

def get_current_value(coin_data):
    """Returns the current value of a single coin holding."""
    return coin_data["amount"] * coin_data["current_price"]

def get_profit_loss(coin_data):
    """Returns the profit or loss of a single coin holding."""
    return (coin_data["current_price"] * coin_data["amount"]) - (coin_data["buy_price"] * coin_data["amount"])



def get_total_value(portfolio):
    """Returns the total current value of the entire portfolio"""
    return sum(get_current_value(portfolio[coin]) for coin in portfolio)


def get_total_profit_loss(portfolio):
    """Returns the total profit or loss across all coins"""
    return sum(get_profit_loss(portfolio[coin]) for coin in portfolio)



def get_portfolio_summary(portfolio):
    """Prints a full portfolio with allocation percentages."""
    total_value = get_total_value(portfolio)
    total_pl = get_total_profit_loss(portfolio)

    print("=" * 55)
    print("PORTOFOLIO SUMMARY")
    print("=" * 55)
    
    for name, data in portfolio.items():
        value = get_current_value(data)
        pl = get_profit_loss(data)
        allocation = (value / total_value) * 100
        pl_str = f"-${abs(pl):,.2f}" if pl < 0 else f"${pl:,.2f}"
        print(f"{name}: ${value:,.2f} | P&L: {pl_str} | Allocation: {allocation:.1f}%")
    
    print("=" * 55)
    print(f"Total Value: ${total_value:,.2f}")
    print(f"Total P&L:   ${total_pl:,.2f}")
    print("=" * 55)

get_portfolio_summary(portfolio)