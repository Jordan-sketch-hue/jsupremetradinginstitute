'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Shield, Target, Zap, CheckCircle, Trophy } from 'lucide-react'

export default function Level8Page() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const lessons = [
    {
      id: 41,
      title: 'Order Block Entries & Exits',
      duration: '30 min read',
      icon: TrendingUp,
      content: `
**Level 8: Advanced Order Block Entries & Exits**

Learn how to take precise entries and exits by identifying and using order blocks within accumulation ranges (micro and macro). This lesson covers:

- **Identifying Order Blocks:**
  - Spotting valid order blocks in both micro and macro accumulation ranges.
  - Recognizing the difference between mitigation and manipulation.

- **Marking Candles Across Timeframes:**
  - How to mark key candles (open/close, close/open) through multiple timeframes.
  - Choosing the most comfortable entry based on candle structure and expected return.

- **Entry & Exit Techniques:**
  - Placing entries at the most probable order block zones.
  - Using candle open/close logic to refine entries and exits.
  - Anticipating expected candle return for optimal risk/reward.

- **Practical Example:**
  1. Identify an accumulation range on the macro timeframe (e.g., H4).
  2. Drill down to micro timeframes (e.g., M15, M5) to spot nested order blocks.
  3. Mark the open/close of the most significant candles within these blocks.
  4. Place entries at the most comfortable zone (open/close or close/open) with a stop below/above the block.
  5. Plan exits at the next liquidity zone or upon candle return to the block.

**Tip:** Always confirm with volume and market context. Practice marking and backtesting to build confidence.
      `,
    },
  ]

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Level 8: Order Block Entries & Exits</h1>
      {lessons.map(lesson => (
        <motion.div
          key={lesson.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 bg-white dark:bg-zinc-900 rounded-lg shadow p-6"
        >
          <div className="flex items-center mb-4">
            <lesson.icon className="w-8 h-8 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold">{lesson.title}</h2>
            <span className="ml-auto text-sm text-zinc-500">{lesson.duration}</span>
          </div>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br/>') }}
          />
        </motion.div>
      ))}
    </div>
  )
}
