'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Footer() {
  return (
    <footer className="my-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 flex flex-wrap items-center justify-center gap-x-1 gap-y-3 sm:gap-x-2"
      >
        <div className="mx-2 h-[30px] w-[0.5px] rotate-[20deg]"></div>
        <div className="flex items-center gap-x-1 text-xs sm:text-base">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-500"
          >
            Made with
          </motion.span>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-slate-500"
          >
            by
          </motion.span>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="https://lesteban.dev"
              target="_blank"
              className="hover:text-primary hover:underline hover:underline-offset-4 hover:transition-all hover:duration-300"
            >
              LEstebanR
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  )
}
