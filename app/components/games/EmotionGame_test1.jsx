"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  Star,
  PartyPopper,
  Brain,
  Music,
  X,
} from "lucide-react";
import Confetti from "react-confetti";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Emotion data with correct paths from your folder structure
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

// Function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get emotion color classes
const getEmotionColor = (emotionName) => {
  const emotion = EMOTIONS.find(e => e.name.toLowerCase() === emotionName.toLowerCase());
  if (!emotion) return "from-blue-500 to-purple-500";
  
  const colors = {
    happy: "from-yellow-400 to-orange-400",
    sad: "from-blue-400 to-indigo-500",
    angry: "from-red-500 to-rose-600",
    surprised: "from-purple-400 to-pink-500",
    calm: "from-green-400 to-emerald-500",
    cry: "from-indigo-400 to-blue-600",
    frighten: "from-orange-400 to-amber-500",
    funny: "from-pink-400 to-rose-400",
  };
  return colors[emotion.id] || "from-blue-500 to-purple-500";
};

// Emotion glow effect component
const EmotionGlow = ({ emotion, children }) => {
  const glowColor = getEmotionColor(emotion?.name || "");
  
  return (
    <div className="relative">
      <div className={cn(
        "absolute inset-0 rounded-2xl blur-xl opacity-30 animate-pulse",
        glowColor.replace("from-", "bg-gradient-to-r ").replace("to-", " ")
      )} />
      <div className="relative">{children}</div>
    </div>
  );
};

// Emotion Thinking Loader Component
const ThinkingLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl z-10">
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Brain className="w-12 h-12 text-purple-500 animate-pulse" />
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
        </div>
      </div>
      <p className="text-lg font-medium text-gray-700 animate-bounce">
        Thinking...
      </p>
    </div>
  </div>
);

// Progress Indicator Component
const EmotionProgress = ({ progress, totalRounds, roundIndex }) => {
  const progressEmojis = ["😊", "😢", "😠", "😲", "😌", "😭", "😨", "😂"];
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Emotion Journey</span>
          <span className="text-xs text-gray-500">{roundIndex + 1}/{totalRounds}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalRounds }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                i <= roundIndex
                  ? "bg-gradient-to-br from-blue-400 to-purple-500 scale-110 shadow-md"
                  : "bg-gray-200 scale-90"
              )}
            >
              <span className="text-sm">
                {i <= roundIndex ? progressEmojis[i] || "✨" : "○"}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Progress 
        value={progress} 
        className="h-3 bg-gradient-to-r from-blue-100 to-purple-100"
      />
    </div>
  );
};

// Custom Celebration Modal Component
const CelebrationModal = ({ isOpen, onClose, score, totalRounds, onPlayAgain }) => {
  const accuracy = totalRounds > 0 ? Math.round((score.correct / totalRounds) * 100) : 0;
  
  if (!isOpen) return null;
  
  return (
    <>
      <Confetti
        width={typeof window !== 'undefined' ? window.innerWidth : 1000}
        height={typeof window !== 'undefined' ? window.innerHeight : 1000}
        recycle={false}
        numberOfPieces={200}
        gravity={0.1}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="relative mx-4 max-w-md w-full bg-gradient-to-br from-yellow-50 to-pink-50 rounded-2xl border-2 border-yellow-200 shadow-2xl overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full p-2 hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <PartyPopper className="w-16 h-16 text-yellow-500 animate-bounce" />
                <Star className="absolute -top-2 -right-2 w-8 h-8 text-pink-500 animate-spin" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              🎉 Amazing! You Did It! 🎉
            </h2>
            <p className="text-center text-gray-600 mb-6">
              You've completed all emotions recognition!
            </p>
            
            <div className="space-y-4">
              <div className="bg-white/80 rounded-2xl p-4 border border-yellow-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{score.correct}</div>
                    <div className="text-sm text-gray-600">Correct Answers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <span className="text-lg font-semibold text-gray-800">
                      Best Streak: {score.streak}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl border-2 hover:bg-gray-50"
                  onClick={onClose}
                >
                  View Results
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={onPlayAgain}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

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
  const [isRevealed, setIsRevealed] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  
  const audioRef = useRef(null);
  const clapAudioRef = useRef(null);
  const errorAudioRef = useRef(null);

  const current = useMemo(() => EMOTIONS[roundIndex], [roundIndex]);

  const progressValue = useMemo(() => {
    return Math.round(((roundIndex + 1) / totalRounds) * 100);
  }, [roundIndex, totalRounds]);

  // Load audio files on mount
  useEffect(() => {
    clapAudioRef.current = new Audio('/sounds/clap.mp3');
    errorAudioRef.current = new Audio('/sounds/error.mp3');
  }, []);

  useEffect(() => {
    // reset state on round change
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setIsRevealed(false);
    setIsThinking(false);
    setShowConfetti(false);

    // reset audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSoundPlaying(false);
    }
  }, [roundIndex]);

  const playEmotionSound = async () => {
    try {
      if (!audioRef.current) return;
      setIsRevealed(true);
      setIsSoundPlaying(true);

      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      
      // Reset sound playing state when audio ends
      audioRef.current.onended = () => setIsSoundPlaying(false);
    } catch (err) {
      console.log("Audio play blocked:", err);
      setIsSoundPlaying(false);
    }
  };

  const handleSelect = (optId) => {
    if (isAnswered) return;

    // Show thinking state
    setIsThinking(true);
    
    // Simulate thinking delay for better UX
    setTimeout(() => {
      setSelectedOption(optId);
      const correct = optId === current.correctOptionId;
      
      setIsAnswered(true);
      setIsCorrect(correct);
      setIsRevealed(true);
      setIsThinking(false);

      // Play feedback sound and show animations
      if (correct) {
        clapAudioRef.current.currentTime = 0;
        clapAudioRef.current.play().catch(() => {});
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        errorAudioRef.current.currentTime = 0;
        errorAudioRef.current.play().catch(() => {});
      }

      setScore((prev) => ({
        correct: prev.correct + (correct ? 1 : 0),
        wrong: prev.wrong + (correct ? 0 : 1),
        streak: correct ? prev.streak + 1 : 0,
      }));
    }, 800);
  };

  const goNext = () => {
    if (roundIndex < totalRounds - 1) {
      setRoundIndex((p) => p + 1);
    } else {
      // Show celebration modal instead of alert
      setShowCelebration(true);
    }
  };

  const resetRound = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setIsRevealed(false);
    setIsThinking(false);
    setShowConfetti(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSoundPlaying(false);
    }
  };

  const handlePlayAgain = () => {
    setRoundIndex(0);
    setScore({ correct: 0, wrong: 0, streak: 0 });
    setShowCelebration(false);
    resetRound();
  };

  // Shuffle options for current round
  const shuffledOptions = useMemo(() => {
    return shuffleArray(current?.options || []);
  }, [current]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 1000}
          height={typeof window !== 'undefined' ? window.innerHeight : 1000}
          recycle={false}
          numberOfPieces={150}
          gravity={0.05}
        />
      )}
      
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        score={score}
        totalRounds={totalRounds}
        onPlayAgain={handlePlayAgain}
      />

      <div className="w-full max-w-6xl grid gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-7 h-7 text-yellow-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Emotion Explorer 🎭
              </h1>
              <p className="text-sm text-gray-600">Discover and match emotions!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100"
            >
              Level {roundIndex + 1} of {totalRounds}
            </Badge>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full border border-yellow-200">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-gray-800 text-lg">{score.correct}</span>
              <span className="text-sm text-gray-600 ml-1">points</span>
            </div>
          </div>
        </div>

        {/* Progress with Emoji Indicator */}
        <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <EmotionProgress 
              progress={progressValue} 
              totalRounds={totalRounds}
              roundIndex={roundIndex}
            />
          </CardContent>
        </Card>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          {/* LEFT OPTIONS */}
          <Card className="rounded-2xl shadow-lg border-0 overflow-hidden bg-gradient-to-b from-white to-gray-50">
            <CardHeader className="pb-4 ">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <span className="text-2xl">🤔</span>
                <span>
                  Which emotion matches?
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0 relative">
              {isThinking && <ThinkingLoader />}
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                {shuffledOptions.map((opt) => {
                  const active = selectedOption === opt.id;
                  const correct = opt.id === current.correctOptionId;
                  const showGreen = isAnswered && correct;
                  const showRed = isAnswered && active && !correct;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      disabled={isAnswered}
                      className={cn(
                        "relative rounded-xl overflow-hidden border-2 transition-all duration-300 transform",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400",
                        "hover:scale-[1.03] active:scale-[0.98]",
                        active && !isAnswered && "ring-2 ring-blue-400 ring-offset-2 scale-[1.03]",
                        showGreen && "border-green-500 bg-green-50 animate-bounce-subtle",
                        showRed && "border-red-500 bg-red-50 animate-shake",
                        !showGreen && !showRed && "border-gray-200 bg-white"
                      )}
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={opt.img}
                          alt={opt.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>

                      {/* Overlay status */}
                      {showGreen && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <div className="bg-white rounded-full p-2">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                          </div>
                        </div>
                      )}
                      {showRed && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                          <div className="bg-white rounded-full p-2">
                            <HelpCircle className="w-8 h-8 text-red-600" />
                          </div>
                        </div>
                      )}

                      {/* Emotion name */}
                      <div className={cn(
                        "absolute bottom-0 left-0 right-0 text-white text-sm py-2 px-3 font-medium text-center",
                        showGreen && "bg-green-600",
                        showRed && "bg-red-600",
                        !showGreen && !showRed && "bg-black/70"
                      )}>
                        {opt.name}
                      </div>
                    </button>
                  );
                })}
              </div>

              <Separator className="my-6" />

              {/* Score card with visual improvements */}
              <div className="rounded-xl bg-gradient-to-r from-gray-50 to-white p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Your Progress
                  </h3>
                  <Badge variant="secondary" className="rounded-full px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100">
                    🔥 Streak: {score.streak}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 text-lg">✅</span>
                        </div>
                        <span className="font-semibold text-green-800">Correct</span>
                      </div>
                      <span className="text-2xl font-bold text-green-900">{score.correct}</span>
                    </div>
                  </div>
                  <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-red-600 text-lg">❌</span>
                        </div>
                        <span className="font-semibold text-red-800">Try Again</span>
                      </div>
                      <span className="text-2xl font-bold text-red-900">{score.wrong}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full rounded-xl py-6 border-2 hover:bg-gray-50 transition-all duration-300"
                  onClick={resetRound}
                  disabled={!selectedOption && !isAnswered}
                >
                  <RotateCcw className={cn(
                    "w-5 h-5 mr-2 transition-transform duration-300",
                    (!selectedOption && !isAnswered) ? "opacity-50" : "animate-spin-once"
                  )} />
                  Try This Round Again
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CENTER GIF + Bottom Label */}
          <EmotionGlow emotion={current}>
            <Card className="rounded-2xl shadow-xl border-0 overflow-hidden bg-gradient-to-b from-white to-gray-50">
              <CardHeader className="pb-4 ">
                <CardTitle className="text-lg font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">👁️</span>
                    <span>
                      Watch & Listen Carefully
                    </span>
                  </span>
                  <Button
                    variant="secondary"
                    className={cn(
                      "rounded-xl border-2 transition-all duration-300",
                      isSoundPlaying && "animate-pulse bg-gradient-to-r from-blue-100 to-purple-100 scale-105"
                    )}
                    onClick={playEmotionSound}
                  >
                    <Music className={cn(
                      "w-5 h-5 mr-2 transition-transform duration-300",
                      isSoundPlaying && "animate-bounce"
                    )} />
                    Hear Emotion
                  </Button>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                {/* GIF Container with Glow Effect */}
                <div className="rounded-xl overflow-hidden relative group">
                  <div className="relative w-full aspect-square bg-gradient-to-br from-white to-gray-100">
                    {current && (
                      <Image
                        src={current.gif}
                        alt={`${current.name} emotion`}
                        fill
                        priority
                        className="object-contain p-6"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    
                    {/* Interactive overlay for accessibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Bottom label with reveal animation */}
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className="rounded-lg px-3 py-1 border-2 bg-white/90"
                      >
                        Emotion
                      </Badge>
                      <div className={cn(
                        "transition-all duration-500 overflow-hidden",
                        isRevealed ? "max-w-48 opacity-100" : "max-w-8 opacity-70"
                      )}>
                        <p className="text-xl font-bold tracking-tight text-gray-800 whitespace-nowrap">
                          {isRevealed ? (
                            <span className="animate-fade-in-up inline-flex items-center gap-2">
                              {current.emoji} {current.name}
                            </span>
                          ) : (
                            "???"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status with animations */}
                      {isAnswered && (
                        <Badge
                          variant={isCorrect ? "secondary" : "destructive"}
                          className={cn(
                            "rounded-lg px-4 py-2 animate-scale-in",
                            isCorrect && "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200",
                            !isCorrect && "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200"
                          )}
                        >
                          {isCorrect ? (
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Correct! 🎉
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <HelpCircle className="w-4 h-4" />
                              Try Again!
                            </span>
                          )}
                        </Badge>
                      )}

                      <Button
                        onClick={goNext}
                        className={cn(
                          "rounded-xl transition-all duration-300",
                          isAnswered 
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 scale-105"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        )}
                        disabled={!isAnswered}
                      >
                        Next Emotion
                        <ChevronRight className={cn(
                          "w-4 h-4 ml-2 transition-transform duration-300",
                          isAnswered && "group-hover:translate-x-1"
                        )} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Feedback Message */}
                {isAnswered && (
                  <div className={cn(
                    "mt-4 p-4 rounded-xl border-2 transition-all duration-500 animate-fade-in",
                    isCorrect 
                      ? "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 text-green-900" 
                      : "border-red-300 bg-gradient-to-r from-red-50 to-rose-50 text-red-900"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        isCorrect ? "bg-green-100" : "bg-red-100"
                      )}>
                        {isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <HelpCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-lg">
                          {isCorrect 
                            ? `Excellent! That's ${current.name}! ${current.emoji}`
                            : "Let's try that one more time!"
                          }
                        </p>
                        <p className="text-sm opacity-90 mt-1">
                          {isCorrect 
                            ? "You're getting really good at recognizing emotions!"
                            : "Look carefully at the expression and try again."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Instructions */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    How to Play
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: "👁️", text: "Look at the face" },
                      { icon: "🔊", text: "Tap Hear Emotion" },
                      { icon: "🤔", text: "Choose matching one" },
                      { icon: "➡️", text: "Tap Next to continue" }
                    ].map((step, i) => (
                      <div 
                        key={i}
                        className="flex flex-col items-center text-center p-2 rounded-lg bg-white/80"
                      >
                        <span className="text-2xl mb-1">{step.icon}</span>
                        <span className="text-xs font-medium text-gray-700">{step.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hidden audio element */}
                <audio 
                  ref={audioRef} 
                  src={current.sound} 
                  preload="auto" 
                  onPlay={() => setIsSoundPlaying(true)}
                  onEnded={() => setIsSoundPlaying(false)}
                />
              </CardContent>
            </Card>
          </EmotionGlow>
        </div>
      </div>

      {/* Add custom CSS animations */}
      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes spin-once {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 0.5s ease-in-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-spin-once {
          animation: spin-once 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}