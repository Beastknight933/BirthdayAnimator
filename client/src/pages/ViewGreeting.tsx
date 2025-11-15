
import { useState, useEffect, type CSSProperties } from "react";
import { Volume2, VolumeX, Gift as GiftIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Greeting } from "@shared/schema";
import { useRoute } from "wouter";

type DecorationType = "balloon-left" | "balloon-right" | "confetti-left" | "confetti-right" | "ribbon";

interface DecorationItem {
  id: string;
  type: DecorationType;
  delay?: number;
}

const decorationConfig: Record<DecorationType, { src: string; className: string; style?: CSSProperties }> = {
  "balloon-left": {
    src: "/decorations/left_balloon-removebg-preview.png",
    className:
      "absolute -left-16 md:-left-24 top-1/2 -translate-y-1/2 w-24 h-24 md:w-36 md:h-36 animate-scale-in animate-float pointer-events-none z-10",
  },
  "balloon-right": {
    src: "/decorations/right_balloon-removebg-preview.png",
    className:
      "absolute -right-16 md:-right-24 top-1/2 -translate-y-1/2 w-24 h-24 md:w-36 md:h-36 animate-scale-in animate-float pointer-events-none z-10",
  },
  "confetti-left": {
    src: "/decorations/confetti.gif",
    className:
      "absolute -left-10 md:-left-16 top-0 h-full md:h-[28rem] w-20 md:w-28 animate-scale-in animate-fade-in pointer-events-none z-0",
  },
  "confetti-right": {
    src: "/decorations/confetti.gif",
    className:
      "absolute -right-10 md:-right-16 top-0 h-full md:h-[28rem] w-20 md:w-28 animate-scale-in animate-fade-in pointer-events-none z-0",
    style: { transform: "scaleX(-1)" },
  },
  ribbon: {
    src: "/decorations/ribbon.png",
    className:
      "fixed top-4 md:top-8 left-1/2 -translate-x-1/2 w-48 md:w-72 animate-scale-in animate-slide-up pointer-events-none z-20",
  },
};


export default function ViewGreeting() {
  const [, params] = useRoute("/wish/:id");
  const greetingId = params?.id || "";

  const { data: greeting, isLoading } = useQuery<Greeting>({
    queryKey: [`/api/greetings/${greetingId}`],
    enabled: !!greetingId,
  });

  const [stage, setStage] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [showIntro, setShowIntro] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [cakeStage, setCakeStage] = useState(0); // 0: decorate, 1: light candle, 2: lit, 3: transition
  const [balloons, setBalloons] = useState([false, false, false, false]);
  const [revealedWords, setRevealedWords] = useState([false, false, false, false]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [sparkles, setSparkles] = useState(false);
  const [decorations, setDecorations] = useState<DecorationItem[]>([]);

  useEffect(() => {
    if (stage === 0 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (stage === 0 && countdown === 0) {
      setShowIntro(true);
    }
  }, [stage, countdown]);

  const toggleMusic = () => setMusicPlaying(!musicPlaying);

  const decorateCake = () => {
    if (decorations.length > 0) return;

    const newDecorations: DecorationItem[] = [
      { id: "balloon-left", type: "balloon-left", delay: 0 },
      { id: "balloon-right", type: "balloon-right", delay: 0.1 },
      { id: "confetti-left", type: "confetti-left", delay: 0.2 },
      { id: "confetti-right", type: "confetti-right", delay: 0.3 },
      { id: "ribbon", type: "ribbon", delay: 0.4 },
    ];

    setDecorations(newDecorations);
    // Don't automatically move to next stage - user clicks button manually
  };

  const lightCandle = () => {
    setCakeStage(2);
    setConfetti(true);
    setSparkles(true);
  };

  const popBalloon = (index: number) => {
    const newBalloons = [...balloons];
    const newRevealedWords = [...revealedWords];
    newBalloons[index] = true;
    newRevealedWords[index] = true;
    setBalloons(newBalloons);
    setRevealedWords(newRevealedWords);
    
    // Trigger sparkles
    setSparkles(true);
    setTimeout(() => setSparkles(false), 500);
    
    if (newBalloons.every(b => b)) {
      setTimeout(() => {
        setConfetti(true);
        setStage(3);
      }, 1000);
    }
  };

  const nextPhoto = () => {
    if (greeting && currentPhotoIndex < greeting.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading your surprise...</div>
      </div>
    );
  }

  if (!greeting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">Greeting not found</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 overflow-hidden">
      {/* Decorative bunting */}
      <div className="absolute top-0 left-0 right-0 h-16 z-10">
        <svg className="w-full h-full" viewBox="0 0 1000 60">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <polygon
              key={i}
              points={`${i * 100},0 ${i * 100 + 40},0 ${i * 100 + 50},40 ${i * 100 + 60},0 ${i * 100 + 100},0 ${i * 100 + 90},20 ${i * 100 + 80},40 ${i * 100 + 70},60 ${i * 100 + 60},40 ${i * 100 + 50},20`}
              fill={['#FF1493', '#00CED1', '#FFD700', '#FF6347', '#9370DB'][i % 5]}
            />
          ))}
        </svg>
      </div>

      {/* Music toggle */}
      <Button
        onClick={toggleMusic}
        className="absolute top-4 right-4 z-20 bg-pink-600 hover:bg-pink-700"
        size="icon"
      >
        {musicPlaying ? <Volume2 /> : <VolumeX />}
      </Button>

      {/* Confetti overlay */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-[fall_3s_linear_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#FF1493', '#00CED1', '#FFD700', '#FF6347', '#9370DB'][i % 5],
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {/* Stage 0: Intro with countdown */}
        {stage === 0 && (
          <div className="text-center animate-fade-in">
            {!showIntro ? (
              <div className="text-9xl font-bold text-pink-300 animate-bounce">
                {countdown > 0 ? countdown : '🎉'}
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="text-8xl mb-4 animate-bounce-slow">🐻</div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-pink-300 mb-4 font-serif">
                  A Cutiepie was born today,
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold text-pink-200 mb-6 font-serif">
                  {greeting.recipientAge} years ago!
                </h2>
                <p className="text-xl text-pink-100 mb-8 italic">
                  Yes, it's YOU! A little surprise awaits...
                </p>
                <Button
                  onClick={() => setStage(1)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-12 py-6 text-xl rounded-full shadow-lg transform hover:scale-105 transition-all"
                >
                  <GiftIcon className="mr-2" /> Start the surprise
                </Button>
              </>
            )}
          </div>
        )}

        {/* Stage 1: Cake - 4 sub-stages */}
        {stage === 1 && (
          <div className="text-center animate-fade-in relative flex flex-col items-center justify-center min-h-[80vh]">
            {/* Ribbon decoration - positioned at top of viewport */}
            {decorations.some(d => d.type === 'ribbon') && (() => {
              const ribbon = decorations.find(d => d.type === 'ribbon');
              if (!ribbon) return null;
              const config = decorationConfig.ribbon;
              const combinedStyle: CSSProperties = {
                ...config.style,
                animationDelay: ribbon.delay !== undefined ? `${ribbon.delay}s` : undefined,
              };
              return (
                <img
                  key={ribbon.id}
                  src={config.src}
                  alt=""
                  className={config.className}
                  style={combinedStyle}
                  loading="eager"
                  aria-hidden="true"
                />
              );
            })()}
            
            {/* Cake image */}
            <div className="mb-12 relative cake-image-container inline-block">
              <div
                className="w-80 h-80 md:w-96 md:h-96 mx-auto transition-all duration-500 drop-shadow-2xl cake-image relative"
                style={{
                  backgroundImage: `url(${cakeStage >= 2 ? "/cake-lit.png" : "/cake-unlit.png"})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  imageRendering: 'crisp-edges',
                  backgroundColor: 'transparent'
                }}
                role="img"
                aria-label="Birthday Cake"
              >
                {/* Decorative elements (balloons and confetti) */}
                {decorations.filter(d => d.type !== 'ribbon').map((decoration) => {
                  const config = decorationConfig[decoration.type];
                  if (!config) return null;

                  const combinedStyle: CSSProperties = {
                    ...config.style,
                    animationDelay:
                      decoration.delay !== undefined
                        ? `${decoration.delay}s`
                        : config.style?.animationDelay,
                  };

                  return (
                    <img
                      key={decoration.id}
                      src={config.src}
                      alt=""
                      className={config.className}
                      style={combinedStyle}
                      loading="eager"
                      aria-hidden="true"
                    />
                  );
                })}
              </div>
            </div>

            {/* Birthday message (only when candle is lit) */}
            {cakeStage >= 2 && (
              <h2 className="text-5xl font-bold text-pink-300 mb-12 animate-pulse italic">
                Happy Birthday, Cutiepie!
              </h2>
            )}

            {/* Action buttons */}
            <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-center">
              {cakeStage === 0 && (
                <Button
                  onClick={decorateCake}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-12 py-6 text-xl rounded-full shadow-lg w-full md:w-auto"
                  disabled={decorations.length > 0}
                >
                  {decorations.length > 0 ? '✨ Decorated!' : '🎨 Decorate'}
                </Button>
              )}
              
              {cakeStage === 0 && decorations.length > 0 && (
                <Button
                  onClick={() => setCakeStage(1)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-12 py-6 text-xl rounded-full shadow-lg w-full md:w-auto"
                >
                  Next: Light Candle →
                </Button>
              )}
              
              {cakeStage === 1 && (
                <Button
                  onClick={lightCandle}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-12 py-6 text-xl rounded-full shadow-lg"
                >
                  🔥 Light the Candle
                </Button>
              )}

              {cakeStage === 2 && (
                <Button
                  onClick={() => {
                    setConfetti(false);
                    setSparkles(false);
                    setStage(2);
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-12 py-6 text-xl rounded-full shadow-lg"
                >
                  Pop the Balloons →
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Stage 2: Balloons */}
        {stage === 2 && (
          <div className="text-center animate-fade-in relative">
            <h2 className="text-3xl font-bold text-pink-200 mb-8">Pop all 4 balloons</h2>
            
            {/* Sparkles effect */}
            {sparkles && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-2xl animate-ping"
                    style={{
                      left: `${30 + Math.random() * 40}%`,
                      top: `${30 + Math.random() * 40}%`,
                      animationDelay: `${Math.random() * 0.5}s`,
                    }}
                  >
                    ✨
                  </div>
                ))}
              </div>
            )}
            
            {/* Balloons grouped together */}
            <div className="flex gap-4 justify-center mb-12 relative">
              {['🎈', '🎈', '🎈', '🎈'].map((balloon, i) => (
                <button
                  key={i}
                  onClick={() => popBalloon(i)}
                  disabled={balloons[i]}
                  className={`text-7xl transform hover:scale-110 transition-all ${
                    balloons[i] ? 'opacity-0 scale-0' : 'animate-float'
                  }`}
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    filter: `hue-rotate(${i * 90}deg)`,
                  }}
                >
                  {balloon}
                </button>
              ))}
            </div>
            
            {/* Revealed message */}
            <div className="text-5xl font-bold text-pink-200 min-h-[80px] flex gap-4 justify-center items-center">
              {revealedWords[0] && <span className="animate-scale-in">You</span>}
              {revealedWords[1] && <span className="animate-scale-in" style={{ animationDelay: '0.1s' }}>are</span>}
              {revealedWords[2] && <span className="animate-scale-in" style={{ animationDelay: '0.2s' }}>a</span>}
              {revealedWords[3] && <span className="animate-scale-in text-pink-300" style={{ animationDelay: '0.3s' }}>Cutiee</span>}
            </div>
          </div>
        )}

        {/* Stage 3: Message reveal */}
        {stage === 3 && (
          <div className="text-center animate-fade-in">
            <div className="text-7xl mb-8 space-x-4">
              <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>You</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>are</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>a</span>
              <span className="inline-block animate-bounce text-pink-300" style={{ animationDelay: '0.3s' }}>Cutiee</span>
            </div>
            <Button
              onClick={() => setStage(4)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-12 py-6 text-xl rounded-full shadow-lg mt-8"
            >
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>
        )}

        {/* Stage 4: Photo carousel */}
        {stage === 4 && (
          <div className="text-center animate-fade-in max-w-2xl w-full">
            <h2 className="text-3xl font-bold text-pink-200 mb-4">Some Sweet Moments</h2>
            <p className="text-pink-100 mb-6 italic">(Swipe the cards)</p>
            <div className="relative bg-gradient-to-br from-pink-400 to-purple-400 p-4 rounded-3xl shadow-2xl">
              <img
                src={greeting.photos[currentPhotoIndex]}
                alt={`Memory ${currentPhotoIndex + 1}`}
                className="w-full h-96 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button
                  onClick={prevPhoto}
                  disabled={currentPhotoIndex === 0}
                  className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  onClick={nextPhoto}
                  disabled={currentPhotoIndex === greeting.photos.length - 1}
                  className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full disabled:opacity-30"
                >
                  →
                </button>
              </div>
            </div>
            <div className="mt-6 flex gap-2 justify-center">
              {greeting.photos.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentPhotoIndex ? 'bg-pink-300 w-8' : 'bg-pink-500/50'
                  }`}
                />
              ))}
            </div>
            <Button
              onClick={() => setStage(5)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-12 py-6 text-xl rounded-full shadow-lg mt-8"
            >
              💌 Open My Message
            </Button>
          </div>
        )}

        {/* Stage 5: Special message card */}
        {stage === 5 && (
          <div className="text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-pink-200 mb-8">A Special Message</h2>
            <div className="bg-gradient-to-br from-pink-300 to-purple-300 p-8 rounded-3xl shadow-2xl max-w-md">
              <div className="text-7xl mb-4">🎈🎈🎈</div>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-2xl text-white">
                <h3 className="text-3xl font-bold mb-4">Happy</h3>
                <h3 className="text-4xl font-bold mb-4">BIRTHDAY</h3>
                <h3 className="text-2xl italic">to you</h3>
              </div>
            </div>
            <Button
              onClick={() => setStage(6)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-12 py-6 text-xl rounded-full shadow-lg mt-8"
            >
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>
        )}

        {/* Stage 6: Final gift */}
        {stage === 6 && (
          <div className="text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-pink-200 mb-12 italic">One Last Thing...</h2>
            <div className="text-9xl mb-12 animate-bounce-slow">🎁</div>
            <p className="text-2xl text-pink-100 mb-8">
              Wishing you the most amazing year ahead, {greeting.recipientName}! 🎉
            </p>
            <Button 
              onClick={() => {
                // Reset all state to restart the experience
                setStage(0);
                setCountdown(3);
                setShowIntro(false);
                setCakeStage(0);
                setBalloons([false, false, false, false]);
                setRevealedWords([false, false, false, false]);
                setCurrentPhotoIndex(0);
                setConfetti(false);
                setSparkles(false);
                setDecorations([]);
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-12 py-6 text-xl rounded-full shadow-lg"
            >
              🎂 Watch Again
            </Button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
