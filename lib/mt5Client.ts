/**
 * MT5 Client - Connect to MetaTrader 5 broker for live trading
 * Supports order placement, position management, and account info
 */

export interface MT5ConnectionConfig {
  accountNumber: string
  password: string
  server: string
  accountType: 'demo' | 'live'
}

export interface MT5OrderParams {
  symbol: string
  orderType: 'BUY' | 'SELL' | 'BUY_LIMIT' | 'SELL_LIMIT' | 'BUY_STOP' | 'SELL_STOP'
  volume: number
  price?: number
  stopLoss?: number
  takeProfit?: number
  comment?: string
  magicNumber?: number
  slippage?: number
}

export interface MT5Order {
  ticket: number
  symbol: string
  orderType: string
  volume: number
  openPrice: number
  openTime: number
  closePrice?: number
  closeTime?: number
  profit?: number
  comment: string
  magicNumber: number
}

export interface MT5Position {
  ticket: number
  symbol: string
  type: 'BUY' | 'SELL'
  volume: number
  openPrice: number
  openTime: number
  currentPrice: number
  profit: number
  profitPercent: number
  comments: string
}

export interface MT5AccountInfo {
  login: number
  currency: string
  balance: number
  equity: number
  margin: number
  marginLevel: number
  freeMargin: number
  profit: number
  leverage: number
  openPositions: number
}

// MT5 Client implementation (REST API wrapper)
export class MT5Client {
  private config: MT5ConnectionConfig
  private baseUrl: string
  private apiKey: string
  private connected: boolean = false

  constructor(config: MT5ConnectionConfig) {
    this.config = config
    this.apiKey = process.env.MT5_API_KEY || ''
    this.baseUrl =
      config.accountType === 'live'
        ? process.env.MT5_LIVE_API_URL || 'https://mt5-api.broker.com'
        : process.env.MT5_DEMO_API_URL || 'https://mt5-demo-api.broker.com'
  }

  /**
   * Connect to MT5 broker
   */
  async connect(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({
          account: this.config.accountNumber,
          password: this.config.password,
          server: this.config.server,
        }),
      })

      if (!response.ok) {
        return { success: false, message: `Connection failed: ${response.statusText}` }
      }

      const data = await response.json()
      this.connected = data.connected === true

      return {
        success: true,
        message: `Connected to ${this.config.server}`,
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed',
      }
    }
  }

  /**
   * Place a new order on MT5
   */
  async placeOrder(
    params: MT5OrderParams
  ): Promise<{ success: boolean; ticket?: number; message: string }> {
    try {
      if (!this.connected) {
        await this.connect()
      }

      const response = await fetch(`${this.baseUrl}/trade/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({
          account: this.config.accountNumber,
          request: {
            action: 'TRADE_ACTION_DEAL',
            symbol: params.symbol,
            volume: params.volume,
            type: this.mapOrderType(params.orderType),
            price: params.price || 0,
            sl: params.stopLoss || 0,
            tp: params.takeProfit || 0,
            comment: params.comment || 'Bot Trade',
            magic: params.magicNumber || 99999,
            deviation: params.slippage || 10,
          },
        }),
      })

      if (!response.ok) {
        return { success: false, message: `Order failed: ${response.statusText}` }
      }

      const data = await response.json()

      if (data.result && data.result.retcode === 'TRADE_RETCODE_DONE') {
        return {
          success: true,
          ticket: data.result.order,
          message: `Order ${data.result.order} placed successfully`,
        }
      }

      return {
        success: false,
        message: data.result?.comment || 'Order execution failed',
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Order placement failed',
      }
    }
  }

  /**
   * Close a position by ticket
   */
  async closePosition(
    ticket: number,
    symbol: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.connected) {
        await this.connect()
      }

      // First get position info to determine volume and type
      const position = await this.getPositionByTicket(ticket)
      if (!position) {
        return { success: false, message: `Position ${ticket} not found` }
      }

      // Close by placing opposite order
      const closeType = position.type === 'BUY' ? 'SELL' : 'BUY'

      const response = await fetch(`${this.baseUrl}/trade/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({
          account: this.config.accountNumber,
          request: {
            action: 'TRADE_ACTION_DEAL',
            symbol: symbol,
            volume: position.volume,
            type: closeType === 'BUY' ? 0 : 1, // 0=BUY, 1=SELL
            comment: `Close Position ${ticket}`,
            magic: 99999,
            deviation: 10,
          },
        }),
      })

      if (!response.ok) {
        return { success: false, message: `Close failed: ${response.statusText}` }
      }

      const data = await response.json()

      if (data.result && data.result.retcode === 'TRADE_RETCODE_DONE') {
        return {
          success: true,
          message: `Position ${ticket} closed successfully`,
        }
      }

      return {
        success: false,
        message: data.result?.comment || 'Position close failed',
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Close position failed',
      }
    }
  }

  /**
   * Get account information
   */
  async getAccountInfo(): Promise<MT5AccountInfo | null> {
    try {
      if (!this.connected) {
        await this.connect()
      }

      const response = await fetch(`${this.baseUrl}/account/info`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'X-Account': this.config.accountNumber,
        },
      })

      if (!response.ok) {
        console.error('Failed to get account info:', response.statusText)
        return null
      }

      const data = await response.json()

      return {
        login: data.login,
        currency: data.currency,
        balance: data.balance,
        equity: data.equity,
        margin: data.margin,
        marginLevel: data.margin_level,
        freeMargin: data.balance - data.margin,
        profit: data.profit,
        leverage: data.leverage,
        openPositions: data.positions || 0,
      }
    } catch (error) {
      console.error('Account info error:', error)
      return null
    }
  }

  /**
   * Get open positions
   */
  async getOpenPositions(): Promise<MT5Position[]> {
    try {
      if (!this.connected) {
        await this.connect()
      }

      const response = await fetch(`${this.baseUrl}/positions/list`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'X-Account': this.config.accountNumber,
        },
      })

      if (!response.ok) {
        console.error('Failed to get positions:', response.statusText)
        return []
      }

      const data = await response.json()

      return (data.positions || []).map((pos: any) => ({
        ticket: pos.ticket,
        symbol: pos.symbol,
        type: pos.type === 0 ? 'BUY' : 'SELL',
        volume: pos.volume,
        openPrice: pos.price_open,
        openTime: pos.time_open * 1000,
        currentPrice: pos.price_current,
        profit: pos.profit,
        profitPercent: (pos.profit / (pos.price_open * pos.volume)) * 100,
        comments: pos.comment,
      }))
    } catch (error) {
      console.error('Get positions error:', error)
      return []
    }
  }

  /**
   * Get position by ticket
   */
  async getPositionByTicket(ticket: number): Promise<MT5Position | null> {
    const positions = await this.getOpenPositions()
    return positions.find(p => p.ticket === ticket) || null
  }

  /**
   * Modify position stop loss and take profit
   */
  async modifyPosition(
    ticket: number,
    stopLoss?: number,
    takeProfit?: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.connected) {
        await this.connect()
      }

      const response = await fetch(`${this.baseUrl}/trade/modify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({
          account: this.config.accountNumber,
          request: {
            action: 'TRADE_ACTION_MODIFY',
            position: ticket,
            sl: stopLoss || 0,
            tp: takeProfit || 0,
          },
        }),
      })

      if (!response.ok) {
        return { success: false, message: `Modify failed: ${response.statusText}` }
      }

      const data = await response.json()

      if (data.result && data.result.retcode === 'TRADE_RETCODE_DONE') {
        return { success: true, message: `Position ${ticket} modified successfully` }
      }

      return {
        success: false,
        message: data.result?.comment || 'Position modification failed',
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Modify position failed',
      }
    }
  }

  /**
   * Get account balance
   */
  async getBalance(): Promise<number> {
    const info = await this.getAccountInfo()
    return info?.balance || 0
  }

  /**
   * Check if enough margin available
   */
  async hasEnoughMargin(symbol: string, volume: number, orderType: string): Promise<boolean> {
    const info = await this.getAccountInfo()
    if (!info) return false

    // Simplified margin check - requires symbol tick size and contract size
    // In production, fetch from symbol specifications
    const estimatedMargin = volume * 1000 // Approximate
    return info.freeMargin > estimatedMargin * 2 // Keep 50% buffer
  }

  /**
   * Map order type to MT5 format
   */
  private mapOrderType(type: string): number {
    const mapping: { [key: string]: number } = {
      BUY: 0,
      SELL: 1,
      BUY_LIMIT: 2,
      SELL_LIMIT: 3,
      BUY_STOP: 4,
      SELL_STOP: 5,
    }
    return mapping[type] || 0
  }

  /**
   * Disconnect from MT5
   */
  async disconnect(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/disconnect`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'X-Account': this.config.accountNumber,
        },
      })
      this.connected = false
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }
}

// Create singleton instance
let mt5Instance: MT5Client | null = null

export function initMT5(config?: MT5ConnectionConfig): MT5Client {
  if (!config) {
    config = {
      accountNumber: process.env.MT5_ACCOUNT || '',
      password: process.env.MT5_PASSWORD || '',
      server: process.env.MT5_SERVER || 'MT5-Demo',
      accountType: (process.env.MT5_ACCOUNT_TYPE as 'demo' | 'live') || 'demo',
    }
  }

  if (!mt5Instance) {
    mt5Instance = new MT5Client(config)
  }

  return mt5Instance
}

export function getMT5Instance(): MT5Client | null {
  return mt5Instance
}
