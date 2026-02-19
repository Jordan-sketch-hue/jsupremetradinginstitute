/**
 * Telegram Menu Handler
 * Interactive menu in personal Telegram group for trade management
 */

interface TradeMenuContext {
  tradeId: string
  symbol: string
  signal: 'BUY' | 'SELL'
  entry: number
  sl: number
  tp: number
  confidence: number
  buyLimit?: number
  stopLimit?: number
}

interface MenuState {
  active: boolean
  currentTrade?: TradeMenuContext
  step: 'initial' | 'set_buy' | 'set_stop' | 'confirm' | 'executed'
}

// Store active menu states per user
const menuStates = new Map<number, MenuState>()

/**
 * Build main menu keyboard
 */
export function getMainMenuKeyboard(): any {
  return {
    keyboard: [
      [
        { text: '📊 View Dashboard', callback_data: 'dashboard' },
        { text: '🎯 Hourly Trades', callback_data: 'hourly_trades' },
      ],
      [
        { text: '💰 Account Info', callback_data: 'account_info' },
        { text: '📈 P&L Summary', callback_data: 'pnl_summary' },
      ],
      [
        { text: '⚙️ Settings', callback_data: 'settings' },
        { text: '🔴 Disarm Bot', callback_data: 'disarm' },
      ],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  }
}

/**
 * Start trade selection menu
 */
export function startTradeMenu(
  tradeId: string,
  symbol: string,
  signal: 'BUY' | 'SELL',
  entry: number,
  sl: number,
  tp: number,
  confidence: number,
  userId: number
): { message: string; keyboard: any } {
  const context: TradeMenuContext = {
    tradeId,
    symbol,
    signal,
    entry,
    sl,
    tp,
    confidence,
  }

  menuStates.set(userId, {
    active: true,
    currentTrade: context,
    step: 'set_buy',
  })

  const emojiSignal = signal === 'BUY' ? '🟢' : '🔴'

  const message =
    `${emojiSignal} **${symbol} ${signal}**\n\n` +
    `📍 Current Entry: ${entry.toFixed(4)}\n` +
    `🛑 SL: ${sl.toFixed(4)}\n` +
    `🎯 TP: ${tp.toFixed(4)}\n` +
    `💪 Confidence: ${confidence}%\n\n` +
    `💡 **Step 1:** Set your BUY LIMIT price (or send current entry to skip):\n` +
    `Min: ${sl.toFixed(4)} | Max: ${tp.toFixed(4)}`

  const keyboard = {
    inline_keyboard: [
      [
        { text: 'Use Current Entry', callback_data: `buy_skip_${tradeId}` },
        { text: '-2%', callback_data: `buy_minus2_${tradeId}` },
      ],
      [
        { text: '-1%', callback_data: `buy_minus1_${tradeId}` },
        { text: '+1%', callback_data: `buy_plus1_${tradeId}` },
      ],
      [{ text: '📨 Enter Custom Price', callback_data: `buy_custom_${tradeId}` }],
    ],
  }

  return { message, keyboard }
}

/**
 * Build stop loss selection keyboard
 */
export function getStopLossKeyboard(
  tradeId: string,
  buyPrice: number,
  originalSL: number
): { message: string; keyboard: any } {
  const message =
    `🛑 **Step 2:** Set your STOP LOSS\n\n` +
    `💼 Your Buy Price: ${buyPrice.toFixed(4)}\n` +
    `📏 Current SL: ${originalSL.toFixed(4)}\n` +
    `💰 Risk at current SL: $${((buyPrice - originalSL) * 10).toFixed(2)} (0.1 lot)`

  const keyboard = {
    inline_keyboard: [
      [
        { text: 'Use Default SL', callback_data: `sl_default_${tradeId}` },
        { text: '+5 pips', callback_data: `sl_plus5_${tradeId}` },
      ],
      [
        { text: '+10 pips', callback_data: `sl_plus10_${tradeId}` },
        { text: 'Tight (-5)', callback_data: `sl_minus5_${tradeId}` },
      ],
      [{ text: '📨 Custom SL', callback_data: `sl_custom_${tradeId}` }],
    ],
  }

  return { message, keyboard }
}

/**
 * Build confirmation keyboard
 */
export function getConfirmationKeyboard(
  tradeId: string,
  symbol: string,
  signal: 'BUY' | 'SELL',
  entry: number,
  sl: number,
  tp: number,
  buyLimit?: number,
  stopLimit?: number
): { message: string; keyboard: any } {
  const emojiSignal = signal === 'BUY' ? '🟢' : '🔴'
  const rr = Math.abs(tp - entry) / Math.abs(entry - sl)

  const message =
    `✅ **READY TO EXECUTE?**\n\n` +
    `${emojiSignal} ${symbol} ${signal}\n` +
    `📍 Buy Limit: ${buyLimit?.toFixed(4) || entry.toFixed(4)}\n` +
    `🛑 Stop Loss: ${stopLimit?.toFixed(4) || sl.toFixed(4)}\n` +
    `🎯 Take Profit: ${tp.toFixed(4)}\n` +
    `📊 R:R Ratio: 1:${rr.toFixed(2)}\n\n` +
    `⚡ Click **✅ CONFIRM TRADE** to execute or **❌ CANCEL**`

  const keyboard = {
    inline_keyboard: [
      [
        { text: '✅ CONFIRM TRADE', callback_data: `exec_confirm_${tradeId}` },
        { text: '❌ CANCEL', callback_data: `exec_cancel_${tradeId}` },
      ],
      [{ text: '🔙 Go Back', callback_data: 'main_menu' }],
    ],
  }

  return { message, keyboard }
}

/**
 * Process callback query from menu button
 */
export function processMenuCallback(
  userId: number,
  callbackData: string
): { action: string; data: any } {
  const state = menuStates.get(userId)

  if (!state) {
    return { action: 'error', data: { message: 'No active menu session' } }
  }

  // Parse callback data
  const [action, ...params] = callbackData.split('_')

  switch (action) {
    // BUY LIMIT SELECTION
    case 'buy':
      return processBuyLimitAction(userId, params.join('_'), state)

    // STOP LOSS SELECTION
    case 'sl':
      return processStopLossAction(userId, params.join('_'), state)

    // EXECUTION
    case 'exec':
      return processExecutionAction(userId, params.join('_'), state)

    // NAVIGATION
    case 'main':
      menuStates.delete(userId)
      return { action: 'show_main_menu', data: {} }

    case 'dashboard':
      return { action: 'open_page', data: { url: '/bot-dashboard' } }

    case 'hourly':
      return { action: 'send_hourly_trades', data: {} }

    case 'account':
      return { action: 'show_account_info', data: {} }

    default:
      return { action: 'unknown', data: { callbackData } }
  }
}

/**
 * Process buy limit action
 */
function processBuyLimitAction(userId: number, subAction: string, state: MenuState): any {
  if (!state.currentTrade) {
    return { action: 'error', data: { message: 'Invalid trade context' } }
  }

  const trade = state.currentTrade
  let buyLimit = trade.entry

  if (subAction === 'skip') {
    buyLimit = trade.entry
  } else if (subAction === 'minus2') {
    buyLimit = trade.entry * 0.98
  } else if (subAction === 'minus1') {
    buyLimit = trade.entry * 0.99
  } else if (subAction === 'plus1') {
    buyLimit = trade.entry * 1.01
  } else if (subAction === 'custom') {
    // User needs to enter custom value
    state.step = 'set_buy'
    menuStates.set(userId, state)
    return {
      action: 'ask_custom_price',
      data: { field: 'buy_limit', current: trade.entry },
    }
  }

  // Update context
  state.currentTrade.buyLimit = buyLimit
  state.step = 'set_stop'
  menuStates.set(userId, state)

  return {
    action: 'show_stop_loss_menu',
    data: {
      tradeId: trade.tradeId,
      buyPrice: buyLimit,
      originalSL: trade.sl,
    },
  }
}

/**
 * Process stop loss action
 */
function processStopLossAction(userId: number, subAction: string, state: MenuState): any {
  if (!state.currentTrade) {
    return { action: 'error', data: { message: 'Invalid trade context' } }
  }

  const trade = state.currentTrade
  let stopLimit = trade.sl

  if (subAction === 'default') {
    stopLimit = trade.sl
  } else if (subAction === 'plus5') {
    stopLimit = trade.sl + 0.0005
  } else if (subAction === 'plus10') {
    stopLimit = trade.sl + 0.001
  } else if (subAction === 'minus5') {
    stopLimit = trade.sl - 0.0005
  } else if (subAction === 'custom') {
    state.step = 'set_stop'
    menuStates.set(userId, state)
    return {
      action: 'ask_custom_price',
      data: { field: 'stop_loss', current: trade.sl },
    }
  }

  // Update context
  state.currentTrade.stopLimit = stopLimit
  state.step = 'confirm'
  menuStates.set(userId, state)

  return {
    action: 'show_confirmation_menu',
    data: {
      tradeId: trade.tradeId,
      symbol: trade.symbol,
      signal: trade.signal,
      entry: trade.entry,
      sl: stopLimit,
      tp: trade.tp,
      buyLimit: trade.buyLimit,
      stopLimit: stopLimit,
    },
  }
}

/**
 * Process execution action
 */
function processExecutionAction(userId: number, subAction: string, state: MenuState): any {
  if (!state.currentTrade) {
    return { action: 'error', data: { message: 'Invalid trade context' } }
  }

  const trade = state.currentTrade

  if (subAction === 'confirm') {
    state.step = 'executed'
    menuStates.set(userId, state)

    return {
      action: 'execute_trade',
      data: {
        tradeId: trade.tradeId,
        symbol: trade.symbol,
        signal: trade.signal,
        entry: trade.buyLimit || trade.entry,
        sl: trade.stopLimit || trade.sl,
        tp: trade.tp,
        confidence: trade.confidence,
      },
    }
  } else if (subAction === 'cancel') {
    menuStates.delete(userId)
    return { action: 'trade_cancelled', data: {} }
  }

  return { action: 'unknown', data: {} }
}

/**
 * Set custom price for a field
 */
export function setCustomPrice(userId: number, field: string, value: number): any {
  const state = menuStates.get(userId)

  if (!state || !state.currentTrade) {
    return { action: 'error', data: { message: 'No active menu' } }
  }

  if (field === 'buy_limit') {
    state.currentTrade.buyLimit = value
    state.step = 'set_stop'
  } else if (field === 'stop_loss') {
    state.currentTrade.stopLimit = value
    state.step = 'confirm'
  }

  menuStates.set(userId, state)

  return { action: 'menu_updated', data: { field, value } }
}

/**
 * Clear menu state
 */
export function clearMenuState(userId: number): void {
  menuStates.delete(userId)
}

/**
 * Get current menu state for debugging
 */
export function getMenuState(userId: number): MenuState | undefined {
  return menuStates.get(userId)
}
