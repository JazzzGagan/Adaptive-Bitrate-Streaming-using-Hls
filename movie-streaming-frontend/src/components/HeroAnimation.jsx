// HeroAnimation.jsx
import { motion } from "framer-motion";
import mandalorain from "../assets/mandalorain.jpeg";
import interstellar from "../assets/interstellar.jpeg";
import johnwick from "../assets/johnwick.jpg";
import spiderman from "../assets/spiderman.webp";
import minion from "../assets/minion.jpg";
import revenant from "../assets/revenant.jpg";
import { Link } from "react-router-dom";

const images = [
  mandalorain,
  interstellar,
  johnwick,
  minion,
  revenant,
  spiderman,
];

const imageVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const textVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { delay: 1.2, duration: 0.8, ease: "easeOut" },
  },
};

export default function HeroAnimation() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 ">
      <motion.div
        className="flex gap-4  flex-wrap justify-center"
        initial="hidden"
        animate="visible"
        variants={imageVariants}
      >
        {images.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            className="w-40 h-80 object-cover border border-background2  shadow-lg"
            variants={imageVariants}
          />
        ))}
      </motion.div>

      <motion.h1
        className="text-4xl font-bold mt-10 text-center"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        WELCOME TO CINEPHILE
      </motion.h1>

      <motion.p
        className="text-sm mt-2 mb-4 text-center max-w-md"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        Join CINEPHILE to watch the latest movies, TV shows, and Originals from
        different platforms all in one place.
      </motion.p>
      <Link to="/signup">
        <motion.button
          className="bg-background2 px-6 py-2 rounded-full text-white font-semibold"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.5 }}
        >
          Sign Up Now
        </motion.button>
      </Link>
    </div>
  );
}
