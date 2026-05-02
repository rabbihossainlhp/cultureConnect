import { motion } from "framer-motion";
import heroImage from '/images/hero_world_map.jpg';
import { Globe, Video, Users, Languages } from 'lucide-react'; // Install: npm i lucide-react

const Hero = () => {
    return (
      <div
         className="hero min-h-[70vh] lg:min-h-[80vh] relative overflow-hidden px-4 sm:px-6 lg:px-8"
         style={{
           backgroundImage:`url(${heroImage})`,
           backgroundSize:'cover',
           backgroundPosition:'center',
           backgroundRepeat:'no-repeat'
         }}
      >  
        <div className=" hero-overlay bg-linear-to-r from-slate-950/70 via-orange-950/45 to-pink-950/55 "></div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
          <motion.div
            className="absolute top-20 left-10 text-white/80"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Globe size={52} />
          </motion.div>
          <motion.div
            className="absolute bottom-24 right-10 text-white/80"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Languages size={44} />
          </motion.div>
        </div>

        <div className="hero-content w-full max-w-7xl text-center text-white relative z-10 py-16 sm:py-20 lg:py-24">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 bg-orange-500/20 border border-orange-400/60 rounded-full text-sm font-medium backdrop-blur-sm">
                Join 50,000+ Cultural Learners Worldwide
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Connect <span className="bg-linear-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Cultures</span>.
              <br />
              Connect <span className="bg-linear-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Humanity</span>.
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-slate-100/90 max-w-2xl mx-auto leading-relaxed">
              Break language barriers through real cultural exchange. 
              Learn from real people, not textbooks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold text-base sm:text-lg shadow-2xl hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Video size={20} />
                Start Connecting Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold text-base sm:text-lg border-2 border-white/30 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Users size={20} />
                How It Works
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-slate-100/80"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span>150+ Countries</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💬</span>
                <span>80+ Languages</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span>4.9/5 Rating</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
};

export default Hero;