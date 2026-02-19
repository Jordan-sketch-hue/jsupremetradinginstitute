import json
import math
import sys

try:
    import yfinance as yf
except Exception as exc:
    print(json.dumps({"ok": False, "error": f"yfinance import failed: {exc}"}))
    sys.exit(1)


def to_float(value):
    try:
        if value is None:
            return None
        number = float(value)
        if math.isfinite(number):
            return number
        return None
    except Exception:
        return None


def quote_mode(ticker_symbol: str):
    ticker = yf.Ticker(ticker_symbol)
    hist = ticker.history(period="5d", interval="1d")

    if hist is None or hist.empty:
        print(json.dumps({"ok": False, "error": "No historical rows for quote"}))
        return

    closes = hist["Close"].dropna().tolist()
    if not closes:
        print(json.dumps({"ok": False, "error": "No close prices"}))
        return

    current_price = to_float(closes[-1])
    previous_close = to_float(closes[-2]) if len(closes) > 1 else current_price

    if current_price is None:
        print(json.dumps({"ok": False, "error": "Invalid current price"}))
        return

    if previous_close and previous_close != 0:
        change = current_price - previous_close
        change_percent = (change / previous_close) * 100
    else:
        change = 0.0
        change_percent = 0.0

    print(
        json.dumps(
            {
                "ok": True,
                "price": current_price,
                "change": change,
                "changePercent": change_percent,
            }
        )
    )


def history_mode(ticker_symbol: str, interval: str, period: str):
    ticker = yf.Ticker(ticker_symbol)
    hist = ticker.history(period=period, interval=interval)

    if hist is None or hist.empty:
        print(json.dumps({"ok": False, "error": "No historical rows"}))
        return

    candles = []
    for timestamp, row in hist.iterrows():
        open_price = to_float(row.get("Open"))
        high_price = to_float(row.get("High"))
        low_price = to_float(row.get("Low"))
        close_price = to_float(row.get("Close"))
        volume = to_float(row.get("Volume")) or 0

        if (
            open_price is None
            or high_price is None
            or low_price is None
            or close_price is None
        ):
            continue

        timestamp_ms = int(timestamp.to_pydatetime().timestamp() * 1000)
        candles.append(
            {
                "timestamp": timestamp_ms,
                "open": open_price,
                "high": high_price,
                "low": low_price,
                "close": close_price,
                "volume": volume,
            }
        )

    if not candles:
        print(json.dumps({"ok": False, "error": "No valid candles"}))
        return

    print(json.dumps({"ok": True, "candles": candles}))


def main():
    if len(sys.argv) < 3:
        print(json.dumps({"ok": False, "error": "Usage: yfinance_fallback.py <quote|history> <symbol> [interval] [period]"}))
        sys.exit(1)

    mode = sys.argv[1].strip().lower()
    symbol = sys.argv[2].strip()

    if mode == "quote":
        quote_mode(symbol)
        return

    if mode == "history":
        interval = sys.argv[3].strip() if len(sys.argv) > 3 else "1d"
        period = sys.argv[4].strip() if len(sys.argv) > 4 else "6mo"
        history_mode(symbol, interval, period)
        return

    print(json.dumps({"ok": False, "error": f"Unknown mode: {mode}"}))
    sys.exit(1)


if __name__ == "__main__":
    main()
