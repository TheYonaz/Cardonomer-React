import React, { useState } from "react";
import { Box, Typography, keyframes } from "@mui/material";

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1) rotate(-5deg);
  }
  75% {
    transform: scale(1.1) rotate(5deg);
  }
`;

const heartPop = keyframes`
  0% {
    transform: translateY(0) scale(0);
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-50px) scale(0.5);
    opacity: 0;
  }
`;

const expressions = [
  {
    message: "Pikachu and Eevee are gathering posts for you! ⚡💖",
    emoji: "⚡",
    filter: "hue-rotate(0deg) brightness(1)",
  },
  {
    message: "Pika-Pika! Almost there! Keep tapping! 🌟✨",
    emoji: "✨",
    filter: "hue-rotate(10deg) brightness(1.1)",
  },
  {
    message: "Eevee is so excited to show you the posts! 🎉💫",
    emoji: "💖",
    filter: "hue-rotate(-10deg) brightness(1.05)",
  },
  {
    message: "Best friends loading your best posts! 🌈⚡",
    emoji: "🌈",
    filter: "hue-rotate(5deg) brightness(1.08)",
  },
  {
    message: "Pikachu used Thunderbolt... on the server! 😄⚡",
    emoji: "⚡",
    filter: "hue-rotate(15deg) brightness(1.15) saturate(1.2)",
  },
  {
    message: "Eevee is evolving... your feed! 🔥💕",
    emoji: "💕",
    filter: "hue-rotate(-5deg) brightness(1.12)",
  },
];

const CuteSpinner = ({ height = "50vh", message = "Loading your adventure..." }) => {
  const [expressionIndex, setExpressionIndex] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [hearts, setHearts] = useState([]);

  const currentExpression = expressions[expressionIndex];

  const handleClick = (e) => {
    // Cycle through expressions
    setExpressionIndex((prev) => (prev + 1) % expressions.length);
    
    // Trigger bounce animation
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);

    // Create floating emoji at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newHeart = {
      id: Date.now(),
      x,
      y,
      emoji: currentExpression.emoji,
    };
    
    setHearts((prev) => [...prev, newHeart]);
    
    // Remove heart after animation
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: height,
        gap: 3,
      }}
    >
      <Box
        sx={{
          position: "relative",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={handleClick}
      >
        <Box
          component="img"
          src="/pikachu-eevee-loading.png"
          alt="Loading..."
          sx={{
            width: { xs: 200, sm: 250 },
            height: "auto",
            animation: isClicked
              ? `${bounce} 0.6s ease-in-out`
              : `${float} 2s ease-in-out infinite`,
            filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.1)) ${currentExpression.filter}`,
            transition: "filter 0.5s ease-in-out",
            "&:hover": {
              filter: `drop-shadow(0 6px 12px rgba(0,0,0,0.15)) ${currentExpression.filter} brightness(1.1)`,
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        />
        
        {/* Floating emojis on click */}
        {hearts.map((heart) => (
          <Box
            key={heart.id}
            sx={{
              position: "absolute",
              left: heart.x,
              top: heart.y,
              fontSize: "2rem",
              pointerEvents: "none",
              animation: `${heartPop} 1s ease-out forwards`,
            }}
          >
            {heart.emoji}
          </Box>
        ))}
      </Box>

      <Typography
        variant="h6"
        sx={{
          color: "primary.main",
          fontWeight: 500,
          animation: `${pulse} 2s ease-in-out infinite`,
          textAlign: "center",
          px: 2,
          transition: "all 0.3s ease-in-out",
        }}
      >
        {currentExpression.message}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontStyle: "italic",
          opacity: 0.7,
          fontSize: "0.875rem",
        }}
      >
        💡 Tap Pikachu & Eevee for a surprise!
      </Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "primary.main",
              animation: `${pulse} 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default React.memo(CuteSpinner);

