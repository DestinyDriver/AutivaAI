"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Canvas to avoid SSR issues
const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false },
);

const Model = dynamic(() => import("./DNAModel"), { ssr: false });

export default function Hero() {
  const containerRef = useRef(null);
  const overlineRef = useRef(null);
  const headingRef = useRef(null);
  const taglineRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctasRef = useRef(null);
  const visualRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      // Overline: fade in + subtle slide up
      timeline.fromTo(
        overlineRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        0,
      );

      // Heading: dramatic entrance
      timeline.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        0.15,
      );

      // Tagline: smooth fade
      timeline.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        0.35,
      );

      // Description: fade in
      timeline.fromTo(
        descriptionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" },
        0.5,
      );

      // CTAs: slide up together
      timeline.fromTo(
        ctasRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        0.65,
      );

      // Visual: subtle fade from below
      timeline.fromTo(
        visualRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        0.3,
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-white overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 pointer-events-none" />

      {/* Decorative elements */}
      {/* <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-20 -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-30 -z-10" /> */}

      <div className="relative max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-12 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center w-full">
          {/* LEFT COLUMN — CONTENT */}
          <div className="flex flex-col justify-center">
            {/* Overline */}
            <p
              ref={overlineRef}
              className="text-[10px] xs:text-xs sm:text-xs md:text-sm uppercase tracking-[1.5px] sm:tracking-[2px] font-bold text-[var(--color-accent)]/80 mb-4 xs:mb-5 sm:mb-6 md:mb-6"
            >
              ✦ AI-Powered Autism Care
            </p>

            {/* Main Heading */}
            <h1
              ref={headingRef}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] mb-4 xs:mb-5 sm:mb-6 md:mb-6"
            >
              NeuroLensAI
            </h1>

            {/* Tagline */}
            <p
              ref={taglineRef}
              className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-accent)]/80 leading-snug mb-4 xs:mb-5 sm:mb-6 md:mb-6"
            >
              <i>Early Signals. Better Outcomes.</i>
            </p>

            {/* Description */}
            <p
              ref={descriptionRef}
              className="text-sm xs:text-base sm:text-base md:text-lg text-slate-600 max-w-2xl mb-8 xs:mb-8 sm:mb-8 md:mb-10 leading-relaxed font-light"
            >
              AI-powered early autism screening combined with clinician decision
              support to improve developmental outcomes.
            </p>

            {/* CTAs */}
            <div
              ref={ctasRef}
              className="flex flex-col xs:flex-col sm:flex-row gap-3 xs:gap-3 sm:gap-4 items-stretch xs:items-start sm:items-center"
            >
              <Button
                size="lg"
                className="bg-[var(--color-accent)]/80 hover:bg-[var(--color-accent)] text-white font-bold px-6 xs:px-7 sm:px-8 py-3 xs:py-3.5 sm:py-6 text-xs xs:text-sm sm:text-base rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                Get Started
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="px-6 xs:px-7 sm:px-8 py-3 xs:py-3.5 sm:py-6 text-xs xs:text-sm sm:text-base rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-all duration-300 whitespace-nowrap"
              >
                Learn More
              </Button>
            </div>

            {/* Trust indicators */}
            <p className="mt-8 sm:mt-10 md:mt-12 text-[10px] xs:text-xs sm:text-xs text-slate-400  tracking-wider flex items-center gap-1">
              MADE BY <Github className="size-3"></Github>
              <div className="flex items-center gap-x-1 ">
                <a
                  href="https://www.github.com/DestinyDriver"
                  className="hover:underline"
                >
                  DestinyDriver,
                </a>
                <a
                  href="https://www.github.com/adi13apr"
                  className="hover:underline"
                >
                  adi13apr
                </a>
                <span>&</span>

                <a
                  href="https://www.github.com/Ayush-iiitkota"
                  className="hover:underline"
                >
                  Ayush-iiitkota
                </a>
              </div>
            </p>
          </div>

          {/* RIGHT COLUMN — VISUAL ELEMENT */}
          <div
            ref={visualRef}
            className="hidden lg:flex items-center justify-center mt-12 lg:mt-0 h-96 lg:h-full"
          >
            <div
              className="w-full h-full rounded-3xl overflow-hidden "
              onPointerEnter={() => setIsHovered(true)}
              onPointerLeave={() => setIsHovered(false)}
            >
              <Canvas
                camera={{ position: [0, 0, 3], fov: 50 }}
                style={{ width: "100%", height: "100%" }}
              >
                <Model hover={isHovered} />
              </Canvas>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
