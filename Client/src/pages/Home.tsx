import { motion } from "framer-motion";


function Home() {
  return (
    <div>
        <div
  className="hero min-h-screen"
  style={{
    backgroundImage:
      "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
  }}
>
  <div className="hero-overlay"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w-md">
     <section className="min-h-screen flex items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold">
          Connect Cultures. Connect Humanity.
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Break language barriers through real cultural exchange.
        </p>
        <button className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-full">
          Join CultureConnect
        </button>
      </motion.div>
    </section>
    </div>
  </div>
</div>

    </div>
  )
}

export default Home