import React from 'react';
import Svg, {
  Defs, RadialGradient, LinearGradient, Stop,
  Circle, Ellipse, Path, Rect, G,
} from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
}

export default function ArenaCaverna({ width = 300, height = 300 }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 300 300">
      <Defs>
        {/* Sky gradient — deep cave */}
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#0a0a0f" />
          <Stop offset="0.6" stopColor="#16121e" />
          <Stop offset="1" stopColor="#1c1412" />
        </LinearGradient>

        {/* Rock gradient */}
        <LinearGradient id="rock" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#3d3530" />
          <Stop offset="1" stopColor="#1a1512" />
        </LinearGradient>

        {/* Glowing lava crack */}
        <LinearGradient id="lava" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#ff4500" stopOpacity="0" />
          <Stop offset="0.5" stopColor="#ff6b00" stopOpacity="0.9" />
          <Stop offset="1" stopColor="#ff4500" stopOpacity="0" />
        </LinearGradient>

        {/* Glow */}
        <RadialGradient id="glow" cx="50%" cy="70%" rx="40%" ry="25%">
          <Stop offset="0" stopColor="#ff6b0033" />
          <Stop offset="1" stopColor="#ff6b0000" />
        </RadialGradient>

        {/* Crystal glow */}
        <RadialGradient id="crystalGlow" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor="#7b5ea7" stopOpacity="0.8" />
          <Stop offset="1" stopColor="#7b5ea7" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" fill="url(#sky)" />

      {/* Distant stalactites (top) */}
      <Path d="M0,0 L20,45 L40,0" fill="#1a1512" opacity="0.7" />
      <Path d="M50,0 L65,30 L80,0" fill="#1e1815" opacity="0.6" />
      <Path d="M120,0 L140,60 L160,0" fill="#1a1512" opacity="0.8" />
      <Path d="M200,0 L215,40 L230,0" fill="#1e1815" opacity="0.7" />
      <Path d="M255,0 L272,50 L290,0" fill="#1a1512" opacity="0.6" />

      {/* Far background rock layers */}
      <Path
        d="M0,200 Q50,160 100,180 Q150,200 200,165 Q250,130 300,155 L300,300 L0,300 Z"
        fill="#1a1512"
        opacity="0.5"
      />
      <Path
        d="M0,220 Q75,185 130,205 Q185,225 240,195 Q270,180 300,190 L300,300 L0,300 Z"
        fill="#221c18"
        opacity="0.7"
      />

      {/* Lava glow on ground */}
      <Ellipse cx="150" cy="260" rx="120" ry="30" fill="url(#glow)" />

      {/* Lava cracks */}
      <Path d="M60,270 Q100,260 150,265 Q200,270 240,260" stroke="url(#lava)" strokeWidth="2" fill="none" />
      <Path d="M90,280 Q130,272 165,278 Q195,284 220,275" stroke="url(#lava)" strokeWidth="1.5" fill="none" />

      {/* Foreground left rock wall */}
      <Path
        d="M0,130 Q30,100 55,120 Q70,135 60,180 Q50,220 30,250 L0,260 Z"
        fill="url(#rock)"
      />

      {/* Foreground right rock wall */}
      <Path
        d="M300,110 Q270,85 245,108 Q230,122 238,175 Q245,215 268,248 L300,258 Z"
        fill="url(#rock)"
      />

      {/* Crystal cluster left */}
      <G opacity="0.85">
        <Circle cx="48" cy="185" r="18" fill="#7b5ea700" />
        <Path d="M35,195 L42,165 L50,195" fill="#9b7ec8" opacity="0.7" />
        <Path d="M44,198 L52,162 L60,198" fill="#b09ad4" opacity="0.9" />
        <Path d="M53,196 L58,172 L64,196" fill="#9b7ec8" opacity="0.7" />
      </G>

      {/* Crystal cluster right */}
      <G opacity="0.85">
        <Path d="M236,192 L242,163 L248,192" fill="#9b7ec8" opacity="0.7" />
        <Path d="M244,196 L252,159 L260,196" fill="#b09ad4" opacity="0.9" />
        <Path d="M255,193 L260,170 L266,193" fill="#9b7ec8" opacity="0.7" />
      </G>

      {/* Floating dust particles */}
      <Circle cx="80" cy="120" r="1.5" fill="#ffffff" opacity="0.3" />
      <Circle cx="150" cy="90" r="1" fill="#ffffff" opacity="0.2" />
      <Circle cx="220" cy="130" r="1.5" fill="#ffffff" opacity="0.25" />
      <Circle cx="110" cy="155" r="1" fill="#ffffff" opacity="0.2" />
      <Circle cx="185" cy="108" r="1.2" fill="#ffffff" opacity="0.3" />

      {/* Center glowing rune on ground */}
      <Ellipse cx="150" cy="268" rx="28" ry="6" fill="#ff6b00" opacity="0.15" />
      <Path
        d="M138,268 L150,255 L162,268 L150,281 Z"
        fill="none"
        stroke="#ff6b00"
        strokeWidth="1.5"
        opacity="0.5"
      />

      {/* Top cave opening — faint light from above */}
      <Ellipse cx="150" cy="0" rx="80" ry="40" fill="#2a2035" opacity="0.4" />
    </Svg>
  );
}
