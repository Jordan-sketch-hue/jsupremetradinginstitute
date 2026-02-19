# 🎯 Complete Trading Bot Integration Guide

## Website Signals → Telegram Alerts → MT5 Execution → Telegram Updates

**Status**: ✅ **FULLY INTEGRATED & DEPLOYED**  
**Commit**: `f33a7d3`  
**Build**: ✅ **PASSING**

---

## 📊 System Architecture Overview

Your bot now has a **complete end-to-end automation pipeline**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    FOUR SIGNAL SOURCES                          │
└─────────────────────────────────────────────────────────────────┘

1️⃣  VIP TELEGRAM GROUP (Provider)
    ↓ Sends signals → Bot listens
    ↓
    📱 `/api/telegram/webhook` (RECEIVES)

2️⃣  YOUR WEBSITE (Own signals)
    ↓ Sends signals → Via API
    ↓
    🌐 `/api/bot/signal` (RECEIVES)

3️⃣  MANUAL API CALL (Testing)
    ↓ Direct POST
    ↓
    ⚡ `/api/bot/execute` (DIRECT)

4️⃣  EMAIL ALERTS (Future)
    ↓ Parse & execute
    ↓
    📧 (Coming soon)

┌─────────────────────────────────────────────────────────────────┐
│              MULTI-CRITERIA VALIDATION LAYER                    │
│  - Risk/Reward ratio check (0.5:1 - 5:1)                       │
│  - Price logic validation (SL/TP correct placement)             │
│  - Confidence scoring (7-point system)                          │
│  - Asset category filtering (FOREX/CRYPTO/etc)                  │
│  - Source credibility rating                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              EXECUTION LAYER (Two Options)                      │
└─────────────────────────────────────────────────────────────────┘

Option A: MT5 LIVE TRADING (Recommended for real money)
    ↓
    🏦 MT5 Broker Connection
    ├─ Place MARKET/LIMIT orders
    ├─ Set SL/TP automatically
    ├─ Position sizing (risk-based)
    └─ Account balance tracking

Option B: SIMULATED TRADING (For testing)
    ↓
    💻 Local Simulation Engine
    ├─ Paper trades (no real money)
    ├─ Full P&L calculation
    ├─ Trade journal tracking
    └─ Dashboard display

┌─────────────────────────────────────────────────────────────────┐
│            TELEGRAM NOTIFICATION SYSTEM                         │
│        (Auto-send updates to execution group)                   │
└─────────────────────────────────────────────────────────────────┘

    ✅ Trade Opened notification (with R/R ratio & confidence)
    ✅ Trade Closed notification (with P&L)
    ✅ Daily Summary (win/loss ratio, profit factor)
    ✅ Bot Status updates (armed, balance, equity)
    ✅ Error Alerts (validation failures, execution issues)
    ✅ Low Confidence Rejections (why alert wasn't traded)

┌─────────────────────────────────────────────────────────────────┐
│            REAL-TIME DASHBOARD                                  │
│        (/bot-dashboard - Live P&L tracking)                     │
└─────────────────────────────────────────────────────────────────┘

    📈 Open Positions (live list with entry/SL/TP)
    📊 Win Rate & Profit Factor
    💰 Total P&L with ROI%
    ⏱️ Trade History (filterable by status)
    🟢 Armed/Disarmed status indicator
    ♻️ Auto-refresh every 5 seconds
```

---

## 🔌 How Each Integration Works

### 1️⃣ TELEGRAM WEBHOOK (`/api/telegram/webhook`)

**What it does**: Automatically listens to your VIP signal provider group and executes trades

**Flow**:

```
Telegram VIP Group (PROVIDER)
    ↓ Someone posts alert
    ↓ Telegram sends to → /api/telegram/webhook
    ↓ Bot receives update
    ↓ Parses alert (3 format support)
    ↓ Validates confidence (multi-criteria scoring)
    ↓ Checks if armed → If yes, EXECUTE
    ↓ Creates MT5 order (or simulates)
    ↓ Sends Telegram update → Execution group (when done)
    ↓ Dashboard updates in real-time
```

**Configuration**:

```env
PROVIDER_GROUP_ID=-1001234567890          # Group that sends signals
EXEC_GROUP_ID=-1001111111111             # Group you receive updates in
TELEGRAM_BOT_TOKEN=123456:ABC-DEF123     # From @BotFather
TELEGRAM_WEBHOOK_SECRET=random_secret123  # Webhook validation
ALLOW_TRADING=true                        # Enable execution
ARMED=true                                # Auto-execute (or false for manual)
```

**How to set up**:

```bash
# 1. Create bot: https://t.me/BotFather (follow instructions, get token)
# 2. Add bot to your VIP signal group (give admin permission)
# 3. Find group ID: @userinfobot in group → copy chat ID
# 4. Set Telegram webhook URL to: https://yourdomain.vercel.app/api/telegram/webhook
# 5. Test: Send alert message to group → Should execute within 1 second
```

**Example alert signals the webhook recognizes**:

```
Format 1 (Text):
BUY EURUSD 1.0900 SL: 1.0880 TP: 1.0950

Format 2 (Markdown):
**BUY** BTCUSD @ 42500 | SL 41800 | TP 43200

Format 3 (JSON):
{"signal":"SELL","asset":"GOLD","entry":1950,"sl":1960,"tp":1940}
```

---

### 2️⃣ WEBSITE SIGNALS (`/api/bot/signal`)

**What it does**: Accept trading alerts directly from your website dashboard

**Flow**:

```
Your Website (Custom form/button)
    ↓ Click "Send Alert" button
    ↓ POST to → /api/bot/signal
    ↓ Sends JSON: {signal, asset, entry, sl, tp}
    ↓ Bot validates API key
    ↓ Parses & validates
    ↓ Checks confidence
    ↓ Executes if armed
    ↓ Returns trade ID + confirmation
    ↓ Telegram notified
```

**Configuration**:

```env
WEBSITE_SIGNAL_API_KEY=your_secret_api_key_123  # Generate this
ALLOW_TRADING=true
ARMED=false    # Start false to test
```

**How to use from your website**:

**JavaScript Example**:

```javascript
// From your website dashboard
async function sendTradingSignal() {
  const signal = {
    asset: 'EURUSD',
    symbol: 'EURUSD',
    signal: 'BUY',
    entryPrice: 1.09,
    stopLoss: 1.088,
    takeProfit: 1.095,
    source: 'website_dashboard',
  }

  const response = await fetch('/api/bot/signal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.WEBSITE_SIGNAL_API_KEY,
    },
    body: JSON.stringify(signal),
  })

  const result = await response.json()
  console.log(result) // { success: true, trade: {...} }
}
```

**cURL Example (for testing)**:

```bash
curl -X POST https://yourdomain.vercel.app/api/bot/signal \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_secret_api_key_123" \
  -d '{
    "asset": "BTCUSD",
    "symbol": "BTCUSD",
    "signal": "BUY",
    "entryPrice": 42500,
    "stopLoss": 41800,
    "takeProfit": 43200
  }'
```

**Response**:

```json
{
  "success": true,
  "message": "Trade executed successfully",
  "trade": {
    "id": "trade-123456",
    "asset": "BTCUSD",
    "signal": "BUY",
    "entry": 42500,
    "sl": 41800,
    "tp": 43200,
    "confidence": "87.5%",
    "status": "PENDING"
  }
}
```

---

### 3️⃣ MT5 INTEGRATION (`lib/mt5Client.ts`)

**What it does**: Connects to your broker's MT5 account for REAL TRADING

**How it works**:

```
Bot decides to execute trade
    ↓ MT5 Client sends order request
    ↓ Connects to broker API
    ↓ Authenticates with account credentials
    ↓ Places MARKET/LIMIT order
    ↓ Sets SL/TP automatically
    ↓ Tracks position open
    ↓ Monitors P&L in real-time
    ↓ Returns ticket number
    ↓ Sends Telegram update
```

**Configuration** (Required for live trading):

```env
MT5_ENABLED=true                          # Set true for live trading
MT5_ACCOUNT_TYPE=demo                     # Start with demo!
MT5_ACCOUNT=12345678                      # Your MT5 account number
MT5_PASSWORD=your_mt5_password            # Your MT5 password
MT5_SERVER=DXTrade-Demo                   # Broker server name
MT5_API_KEY=your_broker_api_key           # API key from broker
MT5_DEMO_API_URL=https://...              # Broker demo API URL
MT5_LIVE_API_URL=https://...              # Broker live API URL
```

**How to get MT5 credentials**:

1. Create MT5 account with your broker
2. Note down: Account number, password, server name
3. Generate API key in broker control panel
4. Get API endpoint URLs from broker documentation
5. Test with DEMO first (MT5_ACCOUNT_TYPE=demo)
6. Switch to LIVE only after successful demo testing

**MT5 Supported Order Types**:

- ✅ BUY - Market order for longs
- ✅ SELL - Market order for shorts
- ✅ BUY_LIMIT - Buy at better price
- ✅ SELL_LIMIT - Sell at better price
- ✅ BUY_STOP - Buy on breakout
- ✅ SELL_STOP - Sell on breakdown

**Example MT5 Connection**:

```typescript
import { initMT5 } from '@/lib/mt5Client'

const mt5 = initMT5({
  accountNumber: '12345678',
  password: 'your_password',
  server: 'DXTrade-Demo',
  accountType: 'demo',
})

// Connect
await mt5.connect()

// Place order
const order = await mt5.placeOrder({
  symbol: 'EURUSD',
  orderType: 'BUY',
  volume: 0.1,
  price: 1.09,
  stopLoss: 1.088,
  takeProfit: 1.095,
  comment: 'Bot Trade',
})

// Get account info
const account = await mt5.getAccountInfo()
console.log(`Balance: $${account.balance}`)
console.log(`Open Positions: ${account.openPositions}`)
```

---

### 4️⃣ TELEGRAM NOTIFIER (`lib/telegramNotifier.ts`)

**What it does**: Sends automatic trade updates to your execution Telegram group

**Notifications sent**:

#### 🟢 Trade Opened

```
📈 TRADE OPENED

Asset: EURUSD
Signal: BUY
Entry: $1.0900
SL: $1.0880
TP: $1.0950
Lot Size: 0.10 📊
R:R: ✅ 1:2.00
Confidence: 87% 🎯
Trade ID: trade-abc123

Status: 🟢 LIVE
Time: 14:30:12 UTC
```

#### 🏁 Trade Closed

```
✅ TRADE CLOSED

Asset: EURUSD
Signal: BUY
Entry: $1.0900
Exit: $1.0920
Lot Size: 0.10
P&L: 🟢 $20.00
P&L %: 1.85%
Duration: ⏱️ 2h 15m
Trade ID: trade-abc123

Status: 🏁 CLOSED
Time: 16:45:27 UTC
```

#### 📈 Daily Summary

```
📊 DAILY SUMMARY

Total Trades: 8
Wins: 🟢 6
Losses: 🔴 2
Win Rate: 75.0%
Profit Factor: 3.50
Largest Win: 📈 $45.00
Largest Loss: 📉 $15.00

Net P&L: 🟢 $195.00
Time: 📅 Feb 19, 2026
```

#### 🤖 Bot Status

```
🤖 BOT STATUS

Armed: 🟢 ARMED
Trading: ✅ ENABLED
Open Positions: 2
Balance: 💰 $10,045.00
Equity: 📊 $10,195.00
Total P&L: 📈 $195.00

Status: ✅ ONLINE
Time: 14:30:12 UTC
```

#### ❌ Validation Failed

```
❌ ALERT REJECTED

Asset: EURUSD
Signal: BUY
Confidence: 42.5%
Reason: Risk/Reward too low (0.3:1 < 0.5:1 minimum)

Status: NOT EXECUTED
Time: 14:30:12 UTC
```

**Configuration**:

```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF123     # Bot token
EXEC_GROUP_ID=-1001111111111             # Where updates are sent
SEND_TELEGRAM_UPDATES=true                # Enable notifications
```

---

## 🎯 Real-Time Workflow Example

**Scenario: You receive a signal from VIP provider group**

```
14:30:00 - Provider posts in VIP group:
  "BUY EURUSD 1.0900 SL: 1.0880 TP: 1.0950"

14:30:01 - Bot receives webhook
  ✅ Parsed alert successfully
  ✅ Validation checks passed
  ✅ Confidence: 87.5% (Grade: A)
  ✅ Bot is armed

14:30:02 - MT5 execution
  ✅ Connected to broker
  ✅ Order placed (Ticket #123456)
  ✅ Position opened: BUY 0.10 @ 1.0900
  ✅ SL set to 1.0880 / TP to 1.0950

14:30:03 - Telegram notified
  Sends to execution group:
  📈 TRADE OPENED - EURUSD BUY @ 1.0900

14:30:04 - Dashboard updates
  Shows new trade in real-time:
  [✅ OPEN] EURUSD BUY | Entry: 1.0900 | R:R: 2.0:1

14:35:00 - Price moves to 1.0920
  Dashboard updates:
  P&L: +$20.00 (+1.85%) ✅

14:40:00 - Price hits TP at 1.0950
  MT5 closes position automatically
  ✅ P&L: $50.00 (+4.62%)

14:40:01 - Telegram notified
  Sends to execution group:
  ✅ TRADE CLOSED - EURUSD | P&L: +$50.00
```

---

## 📋 Complete Setup Checklist

### Phase 1: Telegram Setup (30 minutes)

- [ ] Create bot with @BotFather → get token
- [ ] Add bot to VIP signal group (give admin)
- [ ] Message @userinfobot in group → get PROVIDER_GROUP_ID
- [ ] Create execution group
- [ ] Message @userinfobot in exec group → get EXEC_GROUP_ID
- [ ] Generate random TELEGRAM_WEBHOOK_SECRET
- [ ] Update .env.example with values

### Phase 2: Website Integration (30 minutes)

- [ ] Generate WEBSITE_SIGNAL_API_KEY (random string)
- [ ] Add API call to your website dashboard
- [ ] Test with cURL or Postman
- [ ] Verify trade appears in dashboard

### Phase 3: MT5 Setup (Optional, ~1 hour)

- [ ] Create demo MT5 account with broker
- [ ] Note: Account number, password, server
- [ ] Request broker API credentials
- [ ] Get API endpoint URLs
- [ ] Set MT5\_\* variables in .env
- [ ] Test with demo account first
- [ ] Verify orders appear in MT5 terminal

### Phase 4: Testing & Validation (1 hour)

- [ ] Set ALLOW_TRADING=true
- [ ] Set ARMED=false (manual test mode)
- [ ] Send test alert to Telegram group
- [ ] Check dashboard - trade appears
- [ ] Verify Telegram notification received
- [ ] Manually close trade in dashboard
- [ ] Check P&L calculation

### Phase 5: Go Live (30 minutes preparation)

- [ ] Review all settings one more time
- [ ] Set ARMED=true
- [ ] Set MIN_ALERT_CONFIDENCE=0.65 (80% recommended)
- [ ] Monitor dashboard for 24 hours
- [ ] If MT5: Start with DEMO account first
- [ ] Switch to LIVE only after successful testing

### Phase 6: Production Deployment

- [ ] Deploy to Vercel (git push main)
- [ ] Set environment variables in Vercel dashboard
- [ ] Test webhook endpoint: GET /api/telegram/webhook
- [ ] Monitor bot logs for first 24 hours
- [ ] Adjust MIN_ALERT_CONFIDENCE based on results

---

## 🛠️ Troubleshooting

### Telegram webhook not receiving alerts

```
1. Check PROVIDER_GROUP_ID is correct (should start with -100)
2. Verify bot is admin in the signal group
3. Test with GET /api/telegram/webhook (should return active status)
4. Check bot token is valid
5. Verify TELEGRAM_WEBHOOK_SECRET matches (if set)
```

### Website signal API returning 401

```
1. Verify X-API-Key header is included
2. Check API key matches WEBSITE_SIGNAL_API_KEY in .env
3. Test with cURL first to isolate issue
4. Look at server logs for details
```

### MT5 orders not executing

```
1. Verify MT5_ENABLED=true
2. Check account credentials are correct
3. Test MT5 connection manually
4. Verify API key has trade permission
5. Check account has sufficient margin
6. Ensure symbol exists on broker (check MT5_SYMBOL_PREFIX)
```

### Confidence score too low

```
1. Check MIN_ALERT_CONFIDENCE setting
2. Review validation scoring (7-point system)
3. Improve R/R ratio in signals (aim for 1:2 or better)
4. Use trusted signal source (PROVIDER = 15 points)
5. Check asset category (FOREX = 12 pts, CRYPTO = 8 pts)
```

### No Telegram notifications

```
1. Check SEND_TELEGRAM_UPDATES=true
2. Verify TELEGRAM_BOT_TOKEN is valid
3. Check EXEC_GROUP_ID is set and correct
4. Verify bot is admin in execution group
5. Check bot has message permission
```

---

## 📊 API Reference

### GET `/api/telegram/webhook`

Check webhook status

```bash
curl https://yourdomain.vercel.app/api/telegram/webhook

Response:
{
  "status": "active",
  "endpoint": "/api/telegram/webhook",
  "tradingEnabled": true,
  "botArmed": true,
  "minConfidence": "65%"
}
```

### POST `/api/telegram/webhook`

Telegram sends alerts here (automatic)

```
Sent by Telegram when message posted in provider group
No manual action needed
```

### GET `/api/bot/signal`

Check if website signal endpoint is active

```bash
curl https://yourdomain.vercel.app/api/bot/signal

Response:
{
  "status": "active",
  "endpoint": "/api/bot/signal",
  "requiresAuth": true,
  "tradingEnabled": true
}
```

### POST `/api/bot/signal`

Send trading signal from website

```bash
curl -X POST https://yourdomain.vercel.app/api/bot/signal \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "asset": "EURUSD",
    "symbol": "EURUSD",
    "signal": "BUY",
    "entryPrice": 1.0900,
    "stopLoss": 1.0880,
    "takeProfit": 1.0950
  }'

Response:
{
  "success": true,
  "trade": {
    "id": "trade-123",
    "status": "OPEN",
    "confidence": "87.5%"
  }
}
```

### GET `/api/bot/status`

Get bot status and summary

```bash
curl https://yourdomain.vercel.app/api/bot/status

Response:
{
  "status": "ONLINE",
  "armed": true,
  "trading": true,
  "summary": {
    "totalTrades": 42,
    "winRate": 0.71,
    "profitFactor": 2.3
  },
  "today": {
    "trades": 5,
    "pnl": 150.50
  },
  "openPositions": 2
}
```

### GET `/api/bot/trades`

Get trade history

```bash
curl 'https://yourdomain.vercel.app/api/bot/trades?status=CLOSED&limit=10'

Response:
{
  "trades": [...],
  "count": 10,
  "stats": {
    "winRate": 0.70,
    "profitFactor": 2.1,
    "totalPnL": 500.00
  }
}
```

---

## 🔐 Security Best Practices

1. **API Keys**
   - Generate strong random keys for WEBSITE_SIGNAL_API_KEY
   - Rotate keys quarterly
   - Don't commit .env to git (use .env.local)
   - Store in Vercel Secrets only

2. **Telegram Bot Security**
   - Set TELEGRAM_WEBHOOK_SECRET to random value
   - Only add bot to private groups
   - Regularly review bot permissions
   - Keep bot token private

3. **MT5 Credentials**
   - Never share account password
   - Use strong, unique passwords (20+ chars)
   - Enable 2FA if broker supports
   - Use demo account for testing
   - Start with small position sizes

4. **Bot Control**
   - Keep ARMED=false by default
   - Use MIN_ALERT_CONFIDENCE to filter bad signals
   - Monitor dashboard daily
   - Set MAX_TRADES_OPEN to limit risk
   - Review closed trades weekly

5. **Monitoring**
   - Check dashboard every trading day
   - Review Telegram notifications
   - Monitor P&L trends
   - Track win rate changes
   - Adjust settings if needed

---

## 🎓 Next Steps

1. **Immediate** (1-2 hours):
   - Set up Telegram webhook
   - Test with signals from provider group
   - Monitor dashboard

2. **Short-term** (1-2 days):
   - Connect MT5 account (demo first)
   - Test API signal endpoint
   - Run 10+ trades in demo mode

3. **Medium-term** (1-2 weeks):
   - Monitor win rate and P&L
   - Adjust confidence threshold
   - Fine-tune risk settings

4. **Long-term**:
   - Track monthly performance
   - Optimize validation criteria
   - Scale position sizes gradually
   - Consider advanced features

---

**Status**: ✅ All systems integrated and tested  
**Build**: ✅ Passing with zero errors  
**Dashboard**: ✅ Real-time updates working  
**API Routes**: ✅ All 4 endpoints live  
**Ready for**: 🚀 Production deployment

Visit `/bot-dashboard` to see live trading updates!
