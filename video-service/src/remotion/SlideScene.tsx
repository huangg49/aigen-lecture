import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Audio,
} from 'remotion';
import type { Slide } from '../types';

interface SlideCompositionProps {
  slides: Slide[];
  /** Thời lượng mỗi slide (ms) — tính từ TTS durationMs */
  slideDurationsMs: number[];
}

/**
 * SlideCompositionProps.slides render từng slide tuần tự với animation:
 * - Background gradient tím-xanh
 * - Title fade-in + slide up
 * - Bullet points lần lượt xuất hiện (stagger 15 frames mỗi point)
 */
export const SlideScene: React.FC<{ slide: Slide; isActive: boolean }> = ({
  slide,
  isActive,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleY = spring({
    frame,
    fps,
    config: { damping: 80, stiffness: 200, mass: 0.8 },
    from: 40,
    to: 0,
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 120px',
        fontFamily: '"Inter", "Segoe UI", sans-serif',
      }}
    >
      {/* Audio thực tế từ TTS (nếu có) */}
      {slide.audioUrl && <Audio src={slide.audioUrl} />}

      {/* Background decorative circles */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.15)',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.12)',
          filter: 'blur(50px)',
        }}
      />

      {/* Slide number indicator */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 60,
          color: 'rgba(255,255,255,0.4)',
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: 2,
        }}
      >
        AI Lecture
      </div>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 48,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
            borderRadius: 8,
            padding: '6px 20px',
            marginBottom: 20,
            fontSize: 16,
            color: 'white',
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          BÀI GIẢNG
        </div>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: 'white',
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: -1,
          }}
        >
          {slide.title}
        </h1>
      </div>

      {/* Bullet Points */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {slide.bulletPoints.map((point, i) => {
          const bulletDelay = 25 + i * 15;
          const bulletOpacity = interpolate(frame, [bulletDelay, bulletDelay + 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const bulletX = interpolate(frame, [bulletDelay, bulletDelay + 20], [-30, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
                opacity: bulletOpacity,
                transform: `translateX(${bulletX}px)`,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                  flexShrink: 0,
                  marginTop: 10,
                }}
              />
              <p
                style={{
                  fontSize: 28,
                  color: 'rgba(255,255,255,0.9)',
                  margin: 0,
                  lineHeight: 1.5,
                  fontWeight: 400,
                }}
              >
                {point}
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export type { SlideCompositionProps };
