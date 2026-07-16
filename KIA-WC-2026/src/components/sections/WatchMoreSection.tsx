import { motion } from 'motion/react'

export default function WatchMoreSection() {
  return (
    <section className="relative flex h-screen items-center overflow-hidden">
      {/* Background */}
      <img
        src="/media/08.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] justify-end px-6 lg:px-10">
        <div className="max-w-[430px]">

          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
            className="text-[32px] font-medium leading-[42px] text-white lg:text-[48px] lg:leading-[60px]"
          >
            FIFA World Cup 2026™ —
            <br />
            Together with OMBC
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="mt-6 text-[14px] leading-7 text-white/70 lg:text-[16px]"
          >
            This journey of the 49th Team does not end with the opening
            of the match. As an official partner of the FIFA World Cup
            2026™, Kia continues to create more meaningful experiences
            for the next generation through OMBC.
          </motion.p>

          {/* Button */}
          <motion.a
            href="/videos"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{
              duration: 0.6,
              delay: 0.4,
            }}
            className="mt-8 inline-flex items-center gap-3 border border-white/25 bg-black/20 px-5 py-4 text-white backdrop-blur-sm transition hover:bg-black/35"
          >
            <div>
              <p className="text-[15px] font-medium">
                Watch more OMBC videos
              </p>
              <p className="mt-1 text-[12px] text-white/60">
                Discover the journey behind the 49th Team
              </p>
            </div>

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M7 17L17 7M17 7H9M17 7V15"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>

        </div>
      </div>
    </section>
  )
}