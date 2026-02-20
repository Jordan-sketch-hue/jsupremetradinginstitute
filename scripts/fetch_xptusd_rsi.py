import yfinance as yf

# Example: Download 1hr candles for Platinum (XPTUSD) for the last 60 days
data = yf.download('XPTUSD=X', interval='60m', period='60d')

print(data.tail())

# Calculate RSI (14) using closing prices
def calculate_rsi(prices, period=14):
    if len(prices) < period + 1:
        return [50] * len(prices)
    deltas = prices.diff()
    gains = deltas.where(deltas > 0, 0.0)
    losses = -deltas.where(deltas < 0, 0.0)
    avg_gain = gains.rolling(window=period, min_periods=period).mean()
    avg_loss = losses.rolling(window=period, min_periods=period).mean()
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    rsi[:period] = None
    return rsi

if not data.empty:
    rsi = calculate_rsi(data['Close'])
    data['RSI'] = rsi
    print(data[['Close', 'RSI']].tail(20))
else:
    print('No data returned for XPTUSD.')
