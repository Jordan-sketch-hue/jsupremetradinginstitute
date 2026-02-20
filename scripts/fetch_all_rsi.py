import yfinance as yf
import pandas as pd

# List of asset symbols for Yahoo Finance (modify as needed)
assets = {
    'Gold': 'GC=F',
    'Silver': 'SI=F',
    'Platinum': 'PL=F',
    'WTI_Oil': 'CL=F',
    'EURUSD': 'EURUSD=X',
    'GBPUSD': 'GBPUSD=X',
    'USDJPY': 'JPY=X',
    'AUDUSD': 'AUDUSD=X',
    'NZDUSD': 'NZDUSD=X',
    'USDCAD': 'CAD=X',
    'USDCHF': 'CHF=X',
    'USDMXN': 'MXN=X',
    'USDZAR': 'ZAR=X',
    'USDHKD': 'HKD=X',
    'USDTRY': 'TRY=X',
    'USDSEK': 'SEK=X',
    'USDNOK': 'NOK=X',
    'USDCNH': 'CNH=X',
    'USDSGD': 'SGD=X',
    'USDINR': 'INR=X',
    'USDPLN': 'PLN=X',
    'USDTHB': 'THB=X',
    'USDIDR': 'IDR=X',
    'USDHUF': 'HUF=X',
}

results = {}

# RSI calculation function
def calculate_rsi(prices, period=14):
    if len(prices) < period + 1:
        # Not enough data, return NaN series with same index
        return pd.Series([float('nan')] * len(prices), index=prices.index)
    deltas = prices.diff()
    gains = deltas.where(deltas > 0, 0.0)
    losses = -deltas.where(deltas < 0, 0.0)
    avg_gain = gains.rolling(window=period, min_periods=period).mean()
    avg_loss = losses.rolling(window=period, min_periods=period).mean()
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    rsi[:period] = None
    return rsi

for name, symbol in assets.items():
    print(f"Fetching {name} ({symbol})...")
    data = yf.download(symbol, interval='60m', period='60d', progress=False)
    if not data.empty and 'Close' in data:
        close = data['Close']
        # If Close is a DataFrame (multi-asset), flatten to Series
        if isinstance(close, pd.DataFrame):
            close = close.squeeze()
        rsi = calculate_rsi(close)
        # Ensure RSI is a Series with the same index as Close
        if not isinstance(rsi, pd.Series) or len(rsi) != len(close):
            rsi = pd.Series([float('nan')] * len(close), index=close.index)
        results[name] = pd.DataFrame({'Close': close, 'RSI': rsi})
        print(results[name].tail(3))
    else:
        print(f"No data for {name} ({symbol})")

# Optionally, save all results to CSVs
# for name, df in results.items():
#     df.to_csv(f"{name}_RSI.csv")
