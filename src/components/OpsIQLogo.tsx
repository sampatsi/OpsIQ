"use client";

import { useId, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface OpsIQLogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  markOnly?: boolean;
  loop?: boolean;
  tagline?: string;
  variant?: "dark" | "light";
}

export function OpsIQLogo({
  size = 96,
  markOnly = false,
  loop = true,
  tagline = "Operations · Grounded AI",
  variant = "dark",
  className,
  style,
  onClick,
  ...rest
}: OpsIQLogoProps) {
  const gid = useId().replace(/:/g, "");
  const wordColor = variant === "dark" ? "#EEF3F0" : "#0F1A2B";
  const tagColor = variant === "dark" ? "#6E93A0" : "#5B6472";
  const coreSize = size * 0.3125;
  const coreOffset = size * 0.156;

  const ringStyle: CSSProperties = {
    animation: "opsiq-ring 1.5s cubic-bezier(.5,0,.2,1) both",
    transformOrigin: "70px 70px",
    transform: "rotate(-90deg)",
  };

  const orbitStyle: CSSProperties = {
    transformOrigin: "70px 70px",
    animation: loop ? "opsiq-orbit 7s linear 1.5s infinite" : undefined,
  };

  const nodeStyle: CSSProperties = {
    transformOrigin: "70px 7.5px",
    animation: "opsiq-node-pop .8s cubic-bezier(.3,1.4,.5,1) .55s both",
  };

  const coreStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: coreSize,
    height: coreSize,
    margin: `${-coreOffset}px 0 0 ${-coreOffset}px`,
    borderRadius: "50%",
    background: "radial-gradient(circle at 35% 30%,#4FD6C6,#0E8C7F 70%)",
    animation: loop
      ? "opsiq-core .9s cubic-bezier(.3,1.3,.5,1) .35s both, opsiq-pulse 2.4s ease-in-out 1.4s infinite"
      : "opsiq-core .9s cubic-bezier(.3,1.3,.5,1) .35s both",
  };

  return (
    <div
      onClick={onClick}
      className={cn("inline-flex select-none items-center font-display", className)}
      style={{
        gap: size * 0.27,
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
      {...rest}
    >
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 140 140"
          width={size}
          height={size}
          className="absolute inset-0 overflow-visible"
          aria-hidden
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3FB9AB" />
              <stop offset="1" stopColor="#0E8C7F" />
            </linearGradient>
          </defs>
          <circle
            cx="70"
            cy="70"
            r="62.5"
            fill="none"
            stroke={`url(#${gid})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="392"
            style={ringStyle}
          />
          <g style={orbitStyle}>
            <circle cx="70" cy="7.5" r="8.5" fill="#3FB9AB" style={nodeStyle} />
          </g>
        </svg>
        <span className="opsiq-logo-core" style={coreStyle} aria-hidden />
      </div>

      {!markOnly && (
        <div className="flex flex-col gap-2">
          <div className="relative overflow-hidden">
            <span
              className="block font-bold leading-none"
              style={{
                fontSize: size * 0.6,
                letterSpacing: "-0.03em",
                color: wordColor,
              }}
            >
              <span className="opsiq-l" style={{ animationDelay: ".30s" }}>
                O
              </span>
              <span className="opsiq-l" style={{ animationDelay: ".38s" }}>
                p
              </span>
              <span className="opsiq-l" style={{ animationDelay: ".46s" }}>
                s
              </span>
              <span className="opsiq-l text-[#3FB9AB]" style={{ animationDelay: ".56s" }}>
                I
              </span>
              <span className="opsiq-l text-[#3FB9AB]" style={{ animationDelay: ".64s" }}>
                Q
              </span>
            </span>
            <span className="opsiq-logo-gloss" aria-hidden />
          </div>
          {tagline ? (
            <div
              className="opsiq-logo-tag font-mono uppercase"
              style={{ fontSize: 11, color: tagColor }}
            >
              {tagline}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
