'use client'

import { motion } from 'framer-motion'
import { HiMail, HiAcademicCap, HiHeart, HiPhoneOutgoing } from 'react-icons/hi'

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-code-border/30 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-bold text-code-green mb-4">AARAMBH</h3>
            <p className="text-gray-400 leading-relaxed">
              Empowering students to become skilled web developers through hands-on learning and real-world projects.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-code-blue mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-code-green transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#bootcamp" className="text-gray-400 hover:text-code-green transition-colors">
                  Bootcamp Details
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-code-green transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-bold text-code-purple mb-4">Connect With Us</h4>
            <div className="space-y-3">
              <motion.a
                whileHover={{ x: 5 }}
                href="mailto:ad1123itya@gmail.com"
                className="flex items-center gap-2 text-gray-400 hover:text-code-green transition-colors"
              >
                <HiMail className="text-xl" />
                <span>ad1123itya@gmail.com</span>
              </motion.a>
              <motion.a
                whileHover={{ x: 5 }}
                href="tel:+919334282988"
                className="flex items-center gap-2 text-gray-400 hover:text-code-green transition-colors"
              >
                <HiPhoneOutgoing  className="text-xl" />

                <span>+91 933 428 2988</span>
              </motion.a>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-gray-400"
              >
                <HiAcademicCap className="text-xl" />
                <span>Ramgarh Engineering College, Ramgarh</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-code-border/30 text-center">
          <p className="text-gray-500 font-mono text-sm flex items-center justify-center gap-2">
            <span className="text-code-yellow">{'// '}</span>
            Made with <HiHeart className="text-red-500" /> by <a  href="https://www.linkedin.com/in/aditya-gupta9608/" className="text-blue-500">Aditya Gupta</a> & <span className="text-blue-500">Sumit jha</span> the member of Team Aarambh
          </p>
          <p className="text-gray-600 text-xs mt-2">
            © 2025 Aarambh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
