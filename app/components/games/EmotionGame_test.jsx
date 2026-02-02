"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

/**
 * ✅ Professional Emotion Therapy Game (Autism Support)
 * Assets location:
 * public/images/emotion/
 * public/sounds/emotion/
 *
 * ❗IMPORTANT:
 * For "frozen frames" (stopped faces from GIF), you must export them as images.
 * Example:
 * public/images/emotion/frames/happy/1.png
 * public/images/emotion/frames/happy/2.png
 * public/images/emotion/frames/happy/3.png
 * public/images/emotion/frames/happy/4.png
 */

const EMOTIONS = [
  {
    id: "happy",
    name: "Happy",
    gif: "/images/emotions/happy.gif",
    sound: "/sounds/emotions/happy.mp3",
    color: "yellow",
    emoji: "😊",
    options: [
      { id: "happy", name: "Happy", img: "/images/emotions/happy.gif" },
      { id: "calm", name: "Calm", img: "/images/emotions/Calim.gif" },
      { id: "funny", name: "Funny", img: "/images/emotions/Funny_1.gif" },
      { id: "surprised", name: "Surprised", img: "/images/emotions/Surprised.gif" },
    ],
    correctOptionId: "happy",
  },
  {
    id: "sad",
    name: "Sad",
    gif: "/images/emotions/Sad_2.gif",
    sound: "/sounds/emotions/sad.mp3",
    color: "blue",
    emoji: "😢",
    options: [
      { id: "sad", name: "Sad", img: "/images/emotions/Sad_2.gif" },
      { id: "cry", name: "Cry", img: "/images/emotions/Cry_1.gif" },
      { id: "frighten", name: "Frighten", img: "/images/emotions/Frighten.gif" },
      { id: "angry", name: "Angry", img: "/images/emotions/Angry.png" },
    ],
    correctOptionId: "sad",
  },
  {
    id: "angry",
    name: "Angry",
    gif: "/images/emotions/Angry.png",
    sound: "/sounds/emotions/Angry.mp3",
    color: "red",
    emoji: "😠",
    options: [
      { id: "angry", name: "Angry", img: "/images/emotions/Angry.png" },
      { id: "frighten", name: "Frighten", img: "/images/emotions/Frighten.gif" },
      { id: "cry", name: "Cry", img: "/images/emotions/Cry_1.gif" },
      { id: "calm", name: "Calm", img: "/images/emotions/Calim.gif" },
    ],
    correctOptionId: "angry",
  },
  {
    id: "surprised",
    name: "Surprised",
    gif: "/images/emotions/Surprised.gif",
    sound: "/sounds/emotions/surprised.mp3",
    color: "purple",
    emoji: "😲",
    options: [
      { id: "surprised", name: "Surprised", img: "/images/emotions/Surprised.gif" },
      { id: "frighten", name: "Frighten", img: "/images/emotions/Frighten.gif" },
      { id: "happy", name: "Happy", img: "/images/emotions/happy.gif" },
      { id: "funny", name: "Funny", img: "/images/emotions/Funny_1.gif" },
    ],
    correctOptionId: "surprised",
  },
  {
    id: "calm",
    name: "Calm",
    gif: "/images/emotions/Calim.gif",
    sound: "/sounds/emotions/calm.mp3",
    color: "green",
    emoji: "😌",
    options: [
      { id: "calm", name: "Calm", img: "/images/emotions/Calim.gif" },
      { id: "sad", name: "Sad", img: "/images/emotions/Sad_2.gif" },
      { id: "happy", name: "Happy", img: "/images/emotions/happy.gif" },
      { id: "funny", name: "Funny", img: "/images/emotions/Funny_1.gif" },
    ],
    correctOptionId: "calm",
  },
  {
    id: "cry",
    name: "Cry",
    gif: "/images/emotions/Cry_1.gif",
    sound: "/sounds/emotions/crying.mp3",
    color: "indigo",
    emoji: "😭",
    options: [
      { id: "cry", name: "Cry", img: "/images/emotions/Cry_1.gif" },
      { id: "sad", name: "Sad", img: "/images/emotions/Sad_2.gif" },
      { id: "frighten", name: "Frighten", img: "/images/emotions/Frighten.gif" },
      { id: "angry", name: "Angry", img: "/images/emotions/Angry.png" },
    ],
    correctOptionId: "cry",
  },
  {
    id: "frighten",
    name: "Frighten",
    gif: "/images/emotions/Frighten.gif",
    sound: "/sounds/emotions/frightened.mp3",
    color: "orange",
    emoji: "😨",
    options: [
      { id: "frighten", name: "Frighten", img: "/images/emotions/Frighten.gif" },
      { id: "surprised", name: "Surprised", img: "/images/emotions/Surprised.gif" },
      { id: "cry", name: "Cry", img: "/images/emotions/Cry_1.gif" },
      { id: "angry", name: "Angry", img: "/images/emotions/Angry.png" },
    ],
    correctOptionId: "frighten",
  },
  {
    id: "funny",
    name: "Funny",
    gif: "/images/emotions/Funny_1.gif",
    sound: "/sounds/emotions/funny.mp3",
    color: "pink",
    emoji: "😂",
    options: [
      { id: "funny", name: "Funny", img: "/images/emotions/Funny_1.gif" },
      { id: "happy", name: "Happy", img: "/images/emotions/happy.gif" },
      { id: "surprised", name: "Surprised", img: "/images/emotions/Surprised.gif" },
      { id: "calm", name: "Calm", img: "/images/emotions/Calim.gif" },
    ],
    correctOptionId: "funny",
  },
];

export default function EmotionGame() {
  const totalRounds = EMOTIONS.length;

  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const [score, setScore] = useState({
    correct: 0,
    wrong: 0,
    streak: 0,
  });

  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // bottom label: ??? until sound clicked
  const [isRevealed, setIsRevealed] = useState(false);

  const audioRef = useRef(null);

  const current = useMemo(() => EMOTIONS[roundIndex], [roundIndex]);

  const progressValue = useMemo(() => {
    return Math.round(((roundIndex + 1) / totalRounds) * 100);
  }, [roundIndex, totalRounds]);

  useEffect(() => {
    // reset state on round change
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setIsRevealed(false);

    // reset audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [roundIndex]);

  const playSoundAndReveal = async () => {
    try {
      if (!audioRef.current) return;
      setIsRevealed(true);

      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch (err) {
      // autoplay restrictions sometimes block - user will tap again
      console.log("Audio play blocked:", err);
    }
  };

  const handleSelect = (optId) => {
    if (isAnswered) return;

    setSelectedOption(optId);

    const correct = optId === current.correctOptionId;
    setIsAnswered(true);
    setIsCorrect(correct);

    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      wrong: prev.wrong + (correct ? 0 : 1),
      streak: correct ? prev.streak + 1 : 0,
    }));
  };

  const goNext = () => {
    if (roundIndex < totalRounds - 1) {
      setRoundIndex((p) => p + 1);
      return;
    }
    // finished -> reset
    setRoundIndex(0);
    setScore({ correct: 0, wrong: 0, streak: 0 });
  };

  const resetRound = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setIsRevealed(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl grid gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">

            <Button className={"bg-red-400/80 hover:bg-red-500"}>
                <ChevronLeft className="size-4 "></ChevronLeft>
                Exit
            </Button>
            
            
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              Round {roundIndex + 1}/{totalRounds}
            </Badge>
            <Badge
              variant="outline"
              className="text-sm flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              Score: {score.correct}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          {/* LEFT OPTIONS */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Choose the Correct Face
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-3">
                {current.options.map((opt) => {
                  const active = selectedOption === opt.id;
                  const correct = opt.id === current.correctOptionId;

                  const showGreen = isAnswered && correct;
                  const showRed = isAnswered && active && !correct;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      className={cn(
                        "relative rounded-2xl overflow-hidden border transition-all group",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2",
                        active && "ring-2 ring-black/40",
                        showGreen && "border-green-500",
                        showRed && "border-red-500",
                      )}
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={opt.img}
                          alt="emotion option"
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Overlay status */}
                      {showGreen && (
                        <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                      )}
                      {showRed && (
                        <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                          <HelpCircle className="w-7 h-7" />
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 bg-black/35 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition">
                        Tap to select
                      </div>
                    </button>
                  );
                })}
              </div>

              <Separator className="my-4" />

              {/* Score card (as requested: left part of gif zone - we keep it here clean) */}
              <div className="rounded-2xl border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Score Card</p>
                  <Badge variant="secondary">Streak: {score.streak}</Badge>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl border p-2">
                    ✅ Correct:{" "}
                    <span className="font-semibold">{score.correct}</span>
                  </div>
                  <div className="rounded-xl border p-2">
                    ❌ Wrong:{" "}
                    <span className="font-semibold">{score.wrong}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="w-full rounded-2xl"
                  onClick={resetRound}
                  disabled={!selectedOption && !isAnswered}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CENTER GIF + Bottom Label */}
          <Card className="rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Watch Carefully</span>

                <Button
                  variant="secondary"
                  className="rounded-2xl"
                  onClick={playSoundAndReveal}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Play Sound
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              {/* GIF Container */}
              <div className="rounded-2xl border overflow-hidden">
                <div className="relative w-full aspect-video bg-black/5">
                  <Image
                    src={current.gif}
                    alt={`${current.name} gif`}
                    fill
                    priority
                    className="object-contain"
                  />
                </div>

                {/* Bottom label */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-xl">
                      Emotion
                    </Badge>

                    <p className="text-lg font-semibold tracking-tight">
                      {isRevealed ? current.name : "???"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* status */}
                    {isAnswered && (
                      <Badge
                        variant={isCorrect ? "secondary" : "destructive"}
                        className="rounded-xl"
                      >
                        {isCorrect ? "Correct ✅" : "Try Again ❌"}
                      </Badge>
                    )}

                    <Button
                      onClick={goNext}
                      className="rounded-2xl"
                      disabled={!isAnswered}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Hidden audio element */}
              <audio ref={audioRef} src={current.sound} preload="auto" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
