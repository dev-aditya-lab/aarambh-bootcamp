'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaChalkboardTeacher, FaCode, FaProjectDiagram, FaLinkedin, FaGithub } from 'react-icons/fa'

export default function Instructors() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const instructors = [
    {
      name: 'Aditya Gupta',
      role: 'Lead Instructor',
      focus: 'Teaching & Mentorship',
      description: 'Passionate about teaching web development and helping students build real-world projects. Specializes in MERN stack and modern JavaScript frameworks.',
      skills: ['React', 'Node.js', 'MongoDB', 'Next.js', 'Teaching','Leadership'],
      linkedin: 'https://www.linkedin.com/in/aditya-gupta9608/',
      github: 'https://github.com/dev-aditya-lab',
      image: 'https://avatars.githubusercontent.com/u/111672157?v=4', // You can add actual image later
      color: 'from-code-green to-emerald-500'
    },
    {
      name: 'Sumit Jha',
      role: 'Project Lead',
      focus: 'Project Development',
      description: 'Expert in building full-stack applications and guiding students through real-world project implementation. Focuses on best practices and industry standards.',
      skills: ['React', 'Node.js', 'MongoDB', 'Next.js', 'Teaching' ,'Project Management'],
      linkedin: 'https://www.linkedin.com/in/sumit-jha-137aaa300',
      github: 'https://github.com/freak-bad16',
      image: 'https://avatars.githubusercontent.com/u/165133873?v=4', // You can add actual image later
      color: 'from-code-blue to-cyan-500'
    }
  ]

  return (
    <section ref={ref} className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6 px-6 py-3 bg-code-green/20 border border-code-green rounded-full">
            <span className="text-code-green font-bold text-sm">
              <FaChalkboardTeacher className="inline-block mr-2 text-xl" />
              MEET YOUR MENTORS
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-code-yellow">{'class '}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-code-green to-code-blue">
              Instructors
            </span>
            <span className="text-code-purple">{' { }'}</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Learn from experienced developers who are passionate about teaching
          </p>
        </motion.div>

        {/* Instructors Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {instructors.map((instructor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
              className="code-block group hover:scale-105 transition-transform duration-300"
            >
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-xs text-gray-500 font-mono">
                  {instructor.name.toLowerCase().replace(' ', '_')}.js
                </span>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Avatar & Name */}
                <div className="flex items-start gap-4">
                  <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${instructor.color} flex items-center justify-center overflow-hidden`}>
                    {instructor.image ? (
                      <img 
                        src={instructor.image} 
                        alt={instructor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-white">
                        {instructor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-code-green mb-1">{instructor.name}</h3>
                    <p className="text-code-blue font-mono text-sm mb-1">{instructor.role}</p>
                    <div className="flex items-center gap-2 text-code-purple">
                      {instructor.focus === 'Teaching & Mentorship' ? (
                        <FaChalkboardTeacher className="text-lg" />
                      ) : (
                        <FaProjectDiagram className="text-lg" />
                      )}
                      <span className="text-sm">{instructor.focus}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-[#0d1117] rounded-lg p-4">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    <span className="text-code-yellow font-mono text-xs">// </span>
                    {instructor.description}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-xs text-gray-500 font-mono mb-2">
                    <span className="text-code-yellow">const</span> skills = [
                  </p>
                  <div className="flex flex-wrap gap-2 ml-4 mb-2">
                    {instructor.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-code-blue/20 text-code-blue rounded-full text-xs font-mono"
                      >
                        "{skill}"
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-mono">];</p>
                </div>

                {/* Social Links */}
                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  {instructor.linkedin !== '#' && (
                    <motion.a
                      href={instructor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#0077b5]/20 text-[#0077b5] rounded-lg hover:bg-[#0077b5]/30 transition-colors"
                    >
                      <FaLinkedin />
                      <span className="text-xs">LinkedIn</span>
                    </motion.a>
                  )}
                  {instructor.github !== '#' && (
                    <motion.a
                      href={instructor.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <FaGithub />
                      <span className="text-xs">GitHub</span>
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-block px-6 py-4 bg-gradient-to-r from-code-green/10 to-code-blue/10 border border-code-green/30 rounded-lg">
            <p className="text-gray-400 font-mono text-sm">
              <span className="text-code-yellow">{'// '}</span>
              <span className="text-code-green">Both instructors</span> will guide you through every step of your learning journey
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
