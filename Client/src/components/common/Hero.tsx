import { motion } from "framer-motion";
import heroImage from '/images/hero_world_map.jpg';
import { Globe, Video, Users, Languages } from 'lucide-react'; // Install: npm i lucide-react

const Hero = () => {
    return (
      <div
         className="hero h-auto lg:h-[80vh] relative overflow-hidden  "
         style={{
           backgroundImage:`url(${heroImage})`,
           backgroundSize:'cover',
           backgroundPosition:'center',
           backgroundRepeat:'no-repeat'
         }}
      >  
        <div className=" hero-overlay bg-linear-to-r from-blue-900/60 via-purple-900/50 to-orange-900/60  "></div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 text-white/90"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Globe size={60} />
          </motion.div>
          <motion.div
            className="absolute bottom-32 right-20 text-white/90"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Languages size={50} />
          </motion.div>
        </div>

        <div className="hero-content text-center text-white relative z-10">
          <motion.div
            className="max-w-3xl"
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
              <span className="px-4 py-2 bg-orange-500/20 border border-orange-500 rounded-full text-sm font-medium backdrop-blur-sm">
                🌍 Join 50,000+ Cultural Learners Worldwide
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Connect <span className="bg-linear-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Cultures</span>.
              <br />
              Connect <span className="bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Humanity</span>.
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Break language barriers through real cultural exchange. 
              Learn from real people, not textbooks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center ">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-linear-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all flex items-center gap-2   "
              >
                <Video size={20} />
                Start Connecting Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Users size={20} />
                How It Works
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-300"
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