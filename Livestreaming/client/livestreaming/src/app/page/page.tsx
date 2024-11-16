"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "./logo1.png";

const navbarAnimation = {
  hidden: { y: -100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
};

const linkAnimation = {
  hover: {
    scale: 1.1,
    color: "#F59E0B", // Yellow color on hover
    transition: { duration: 0.3 },
  },
};

const StreamingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Animated Navbar */}
      <motion.div
        className="bg-gray-800 p-5 shadow-md fixed w-full top-0 z-50"
        variants={navbarAnimation}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          {/* Logo Section */}
          <motion.div
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Image src={Logo} alt="Videos Logo" width={50} height={50} />
            <span className="text-2xl font-semibold text-white">Videos</span>
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href="/login">
              <Button
                variant="outline"
                className="text-sm text-black hover:bg-green-500 border-gray-600 hover:border-green-500 transition duration-300 ease-in-out"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                className="text-sm text-black hover:bg-green-500 border-gray-600 hover:border-green-500 transition duration-300 ease-in-out"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center space-y-16 py-24 px-6 sm:px-10 mt-16">
        <motion.div
          className="bg-gray-800 p-10 rounded-3xl shadow-2xl max-w-screen-xl w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <h2 className="text-5xl font-bold text-white mb-8 text-center">
            Welcome to Live Streaming!
          </h2>
          <p className="text-lg text-gray-300 sm:text-xl text-center mb-8">
            Explore a variety of live streaming events. Watch your favorite
            shows, sports, gaming streams, and more in real-time. Join the
            community now and never miss out on the action! Whether you’re
            looking to catch up on the latest eSports tournaments, enjoy live
            music, or simply chat with creators, our platform has it all. Get
            ready to immerse yourself in a seamless live streaming experience
            designed for everyone.
          </p>
          <Button className="text-white bg-yellow-500 hover:bg-yellow-600 px-8 py-3 rounded-full mx-auto mt-4">
            Start Watching Now
          </Button>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-10 rounded-3xl shadow-2xl max-w-screen-xl w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <h3 className="text-3xl font-semibold text-white mb-8 text-center">
            How to Stream
          </h3>
          <p className="text-lg text-gray-300 sm:text-xl text-center mb-8">
            Ready to stream your own content? Our platform makes it easy for
            creators to go live and connect with their audience. Start streaming
            in just a few simple steps and engage with viewers instantly. It’s
            fun, simple, and the best way to grow your fan base. Whether you’re
            streaming games, tutorials, or live events, our tools are built to
            give you the best streaming experience possible. Get started now and
            share your passion with the world!
          </p>
          <Button className="text-white bg-yellow-500 hover:bg-yellow-600 px-8 py-3 rounded-full mx-auto mt-4">
            Start Streaming Now
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-screen-xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 Videos, All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreamingPage;
