"use client"

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 py-8">
      <motion.h1 
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to Lanternade
      </motion.h1>
      
      <motion.p 
        className="text-lg sm:text-xl md:text-2xl dark:text-secondary-foreground text-secondary text-center max-w-xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Illuminate your creativity with AI-powered content creation
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <Link href="/creator" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full text-lg font-semibold transition-colors duration-300">
          Get Started
        </Link>
      </motion.div>
    </div>
  );
}
