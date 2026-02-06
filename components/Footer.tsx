'use client'

import { TrendingUp, Twitter, Youtube, Instagram, Mail } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Learn: [
      { name: 'The Doctrine', href: '/doctrine' },
      { name: 'Learning Path', href: '/learning-path' },
      { name: 'Trading Dashboard', href: '/dashboard' },
      { name: 'Free Resources', href: '/resources' },
    ],
    Company: [
      { name: 'About J Supreme', href: '/about' },
      { name: 'Community', href: '/community' },
      { name: 'Success Stories', href: '/testimonials' },
      { name: 'Contact', href: '/contact' },
    ],
    Legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Risk Disclaimer', href: '/disclaimer' },
      { name: 'Refund Policy', href: '/refund-policy' },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Mail, href: 'mailto:info@jsupreme.com', label: 'Email' },
  ]

  return (
    <footer className="bg-matte-black text-white">
      <div className="section-container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-royal-green to-royal-emerald rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-cinzel text-xl font-bold">J SUPREME</h3>
                <p className="text-accent-gold text-xs tracking-wider">MARKET INSTITUTE</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Elite trading education focused on institutional concepts, order blocks, and smart money theory. 
              Transform your trading with the Royal Flow doctrine.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-playfair font-bold text-lg mb-4 text-accent-gold">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="font-playfair font-bold text-2xl mb-4">
              Stay Updated with Market Insights
            </h4>
            <p className="text-gray-400 mb-6">
              Get weekly trading tips, market analysis, and exclusive content delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:border-royal-green text-white placeholder-gray-400"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} J Supreme Market Institute. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs max-w-md text-center md:text-right">
            Trading involves substantial risk. Past performance is not indicative of future results. 
            This is educational content, not financial advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
