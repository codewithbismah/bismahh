"use client";

import React from "react";
import Link from "next/link"; // Import Link for navigation
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import Logo from "./logo1.png";

const StreamingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-foreground">
      {/* Custom Navbar */}
      <div className="bg-gray-800 p-4 shadow-md" style={{ padding: "0.8rem" }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image src={Logo} alt="Videos Logo" width={50} height={0} />
            <span className="text-xl font-bold ml-2 text-white">Videos</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline" className="ml-2">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="ml-2">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-8">
        <h1 className="text-center text-4xl font-bold mb-6 text-white">
          Streaming Options
        </h1>

        <div className="flex justify-center gap-8 mb-12">
          {/* Card for Live Streaming */}
          <Card className="p-6 w-72 h-auto bg-card shadow-lg rounded-2xl transition-transform transform hover:scale-105">
            <AspectRatio ratio={16 / 9} className="mb-4">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPx4PgU_Kug4jYxH1hL8LPJ0fa3qWMR8v8YA&s"
                alt="Live Streaming"
                className="w-full h-48 object-cover rounded-lg"
              />
            </AspectRatio>
            <h2
              className="text-center font-semibold mb-2"
              style={{ fontSize: "1.7rem", marginTop: "31%" }}
            >
              Live Streaming
            </h2>

            <p className="text-center mb-4">
              Stream live content in real-time for your audience.
            </p>
            <Link href="/home">
              <Button className="w-full">Start Live Stream</Button>
            </Link>
          </Card>

          {/* Card for Streaming Video */}
          <Card className="p-6 w-72 h-auto bg-card shadow-lg rounded-2xl transition-transform transform hover:scale-105">
            <AspectRatio ratio={16 / 9} className="mb-4">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpGI5AeXINZ4l9wCygf_oGnmWDvILUfawE0Q&s"
                alt="Streaming Video"
                className="w-full h-48 object-cover rounded-lg"
              />
            </AspectRatio>
            <h2
              className="text-center font-semibold mb-2"
              style={{ fontSize: "1.7rem", marginTop: "31%" }}
            >
              Streaming Video
            </h2>
            <p className="text-center mb-4">
              Stream pre-recorded videos to your audience anytime.
            </p>
            <Link href="/streamingvideo">
              <Button className="w-full">Watch Video</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StreamingPage;
