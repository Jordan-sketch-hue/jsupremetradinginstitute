'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, MessageSquare, TrendingUp, Award, Calendar, Video } from 'lucide-react'

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed')

  const tabs = [
    { id: 'feed', name: 'Feed', icon: MessageSquare },
    { id: 'leaderboard', name: 'Leaderboard', icon: Award },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'rooms', name: 'Trading Rooms', icon: Video },
  ]

  const posts = [
    {
      user: 'Michael Chen',
      avatar: 'MC',
      time: '2 hours ago',
      content:
        'Just caught a beautiful liquidity sweep on EUR/USD. Order block at 1.0845 played out perfectly. Remember: patience pays.',
      likes: 24,
      comments: 8,
    },
    {
      user: 'Sarah Williams',
      avatar: 'SW',
      time: '5 hours ago',
      content:
        "Quick tip: Don't force trades. If the setup doesn't meet all 6 criteria from Level 6, skip it. Better opportunities always come.",
      likes: 42,
      comments: 15,
    },
    {
      user: 'Jordan Lee',
      avatar: 'JL',
      time: '1 day ago',
      content: 'Completed Level 3. Order Block Mastery changes how you read charts.',
      likes: 67,
      comments: 23,
    },
  ]

  const leaderboard = [
    { rank: 1, name: 'Alex Morgan', level: 7, points: 8540, badge: 'Gold' },
    { rank: 2, name: 'Emma Davis', level: 7, points: 8120, badge: 'Silver' },
    { rank: 3, name: 'Ryan Taylor', level: 6, points: 7890, badge: 'Bronze' },
    { rank: 4, name: 'Sofia Martinez', level: 6, points: 7450, badge: 'Star' },
    { rank: 5, name: 'James Wilson', level: 6, points: 7210, badge: 'Star' },
  ]

  return (
    <div className="min-h-screen bg-platinum pt-24 pb-12">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-playfair font-bold text-matte-black mb-4"
          >
            Trading <span className="text-gradient">Community</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            Connect with elite traders, share insights, and grow together
          </motion.p>
        </div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            { icon: Users, value: '2,547', label: 'Active Members' },
            { icon: MessageSquare, value: '12.4K', label: 'Posts This Month' },
            { icon: TrendingUp, value: '89%', label: 'Success Rate' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-royal-green to-royal-emerald rounded-xl p-6 text-white text-center"
            >
              <stat.icon className="w-10 h-10 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-200">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-royal-green text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'feed' && (
              <div className="space-y-6">
                {/* Post Input */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <textarea
                    placeholder="Share your trading insights..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-royal-green resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-3">
                    <button className="btn-primary">Post</button>
                  </div>
                </div>

                {/* Posts */}
                {posts.map((post, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-royal-green to-royal-emerald rounded-full flex items-center justify-center text-white font-bold">
                        {post.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-matte-black">{post.user}</h3>
                          <span className="text-sm text-gray-500">{post.time}</span>
                        </div>
                        <p className="text-gray-700 mb-4">{post.content}</p>
                        <div className="flex items-center space-x-6 text-gray-600">
                          <button className="flex items-center space-x-2 hover:text-royal-green transition-colors">
                            <span>❤️</span>
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-2 hover:text-royal-green transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-gray-400 w-8">#{user.rank}</div>
                      <div className="text-3xl">{user.badge}</div>
                      <div>
                        <h3 className="font-bold text-matte-black">{user.name}</h3>
                        <p className="text-sm text-gray-600">Level {user.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-royal-green">{user.points}</div>
                      <div className="text-sm text-gray-600">points</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-matte-black mb-2">No Upcoming Events</h3>
                <p className="text-gray-600">
                  Check back soon for live trading sessions and webinars!
                </p>
              </div>
            )}

            {activeTab === 'rooms' && (
              <div className="text-center py-12">
                <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-matte-black mb-2">
                  Trading Rooms Coming Soon
                </h3>
                <p className="text-gray-600">
                  Live trading rooms with voice chat launching next month!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
