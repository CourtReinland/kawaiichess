import { useRef, useMemo, Suspense, useCallback, useEffect, useState, Component, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { BattleState, Move, PieceInstance, Position } from '../../game';
import { getDefinition, positionsEqual } from '../../game/board';
import { Board } from './Board';

interface Board3DProps {
  state: BattleState;
  selectedPieceId?: string;
  onSelectPiece: (pieceId: string) => void;
  onMove: (move: Move) => void;
  rotation?: 0 | 180;
  theme?: string;
}

const BOARD_SIZE = 8;
const HALF = BOARD_SIZE / 2;
const TILE_SIZE = 0.96;
const TILE_THICKNESS = 0.04;
const TILE_TOP_Y = TILE_THICKNESS;

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return Boolean(gl && gl.getParameter(gl.VERSION));
  } catch {
    return false;
  }
}

function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    setSupported(supportsWebGL());
  }, []);
  return supported;
}

function posKey(pos: Position): string {
  return `${pos.x},${pos.y}`;
}

function posToWorld(pos: Position): THREE.Vector3 {
  return new THREE.Vector3(pos.x - HALF + 0.5, 0, HALF - pos.y - 0.5);
}

function useBoardTexture(theme?: string): THREE.Texture | null {
  const path = theme ? `/academies/${theme}-board.jpg` : null;
  const texture = useTexture(path ?? '/academies/alishan-board.jpg', (tex) => {
    const t = Array.isArray(tex) ? tex[0] : tex;
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
  });
  return path ? (Array.isArray(texture) ? texture[0] : texture) : null;
}

const TILE_COLORS: Record<string, { light: string; dark: string }> = {
  alishan: { light: '#fff0f5', dark: '#ffb7d5' },
  'seishin-high': { light: '#d4f0d4', dark: '#5a6f9e' },
  'candy-forest-prep': { light: '#fff0f5', dark: '#ffb7d5' },
  'thunder-samurai-institute': { light: '#f0f4ff', dark: '#8da9c4' },
  'kitsune-illusion-academy': { light: '#fff8f0', dark: '#ffcdb2' },
  'celestial-mage-collegium': { light: '#f0f6ff', dark: '#a9b4c2' },
  'final-boss-throne-academy': { light: '#fff0f3', dark: '#c77dff' },
  'yami-no-gakuen': { light: '#f0f0f0', dark: '#8e9aaf' },
};

function getTileColors(theme?: string): { light: string; dark: string } {
  return TILE_COLORS[theme ?? 'alishan'] ?? TILE_COLORS.alishan;
}

function BaseBoard({ theme }: { theme?: string }) {
  const texture = useBoardTexture(theme);
  return (
    <mesh receiveShadow position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[14, 14]} />
      {texture ? (
        <meshStandardMaterial map={texture} roughness={0.6} metalness={0.05} />
      ) : (
        <meshStandardMaterial color="#fff0f5" />
      )}
    </mesh>
  );
}

function TileHighlight({
  pos,
  selected,
  validMove,
  validCapture,
  enemyRange,
  enemyCapture,
  onClick,
  theme,
}: {
  pos: Position;
  selected: boolean;
  validMove: boolean;
  validCapture: boolean;
  enemyRange: boolean;
  enemyCapture: boolean;
  onClick: (pos: Position) => void;
  theme?: string;
}) {
  const world = useMemo(() => posToWorld(pos), [pos]);
  const isLight = (pos.x + pos.y) % 2 === 0;
  const { light, dark } = getTileColors(theme);
  const tileColor = isLight ? light : dark;

  return (
    <group position={world} onClick={(e) => { e.stopPropagation(); onClick(pos); }}>
      <mesh position={[0, TILE_THICKNESS / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[TILE_SIZE, TILE_THICKNESS, TILE_SIZE]} />
        <meshStandardMaterial color={tileColor} roughness={0.5} metalness={0.05} />
      </mesh>
      {selected && (
        <mesh position={[0, TILE_TOP_Y + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.92, 0.92]} />
          <meshStandardMaterial color="#90ee90" transparent opacity={0.5} emissive="#90ee90" emissiveIntensity={0.3} depthWrite={false} />
        </mesh>
      )}
      {validMove && !validCapture && (
        <mesh position={[0, TILE_TOP_Y + 0.03, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
          <meshStandardMaterial color="#90ee90" emissive="#90ee90" emissiveIntensity={0.5} transparent opacity={0.85} />
        </mesh>
      )}
      {(validCapture || enemyCapture) && (
        <mesh position={[0, TILE_TOP_Y + 0.03, 0]}>
          <torusGeometry args={[0.32, 0.06, 16, 32]} />
          <meshStandardMaterial color={enemyCapture ? '#ff1493' : '#ff6b6b'} emissive={enemyCapture ? '#ff1493' : '#ff6b6b'} emissiveIntensity={0.5} />
        </mesh>
      )}
      {enemyRange && !enemyCapture && (
        <mesh position={[0, TILE_TOP_Y + 0.03, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 32]} />
          <meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.4} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}

function removeWhiteBackground(source: THREE.Texture): THREE.CanvasTexture {
  const image = source.image as HTMLImageElement;
  const size = Math.max(image.width, image.height);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, size, size);
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 230 && g > 230 && b > 230) {
      data[i + 3] = 0;
    } else if (r > 200 && g > 200 && b > 200) {
      const whiteness = (r + g + b) / 3;
      const alpha = Math.max(0, 1 - (whiteness - 200) / 55);
      data[i + 3] = Math.floor(data[i + 3] * alpha);
    }
  }
  ctx.putImageData(imageData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

const TOKEN_SIZE = 0.62;
const TOKEN_THICKNESS = 0.04;
const BASE_CENTER_Y = TILE_TOP_Y + 0.03;
const TOKEN_Y = TILE_TOP_Y + 0.06 + TOKEN_THICKNESS / 2;

function Piece3D({
  piece,
  isSelected,
  captureMove,
  onSelect,
  onCapture,
}: {
  piece: PieceInstance;
  isSelected: boolean;
  captureMove?: Move;
  onSelect: (piece: PieceInstance) => void;
  onCapture: (move: Move) => void;
}) {
  const def = getDefinition(piece);
  const miniPath = def.miniImage ? `/characters/minis/${def.miniImage}` : null;
  const sourceTexture = useTexture(miniPath ?? '/characters/minis/hana-mini.jpg', (tex) => {
    const t = Array.isArray(tex) ? tex[0] : tex;
    t.colorSpace = THREE.SRGBColorSpace;
  });
  const safeSource = miniPath ? (Array.isArray(sourceTexture) ? sourceTexture[0] : sourceTexture) : null;

  const portraitTexture = useMemo(() => {
    if (!safeSource) return null;
    return removeWhiteBackground(safeSource);
  }, [safeSource]);

  const groupRef = useRef<THREE.Group>(null);
  const target = useMemo(() => posToWorld(piece.position), [piece.position]);

  const sideColor = piece.side === 'player' ? '#a2d2ff' : '#ff9aa2';
  const royalColor = piece.side === 'player' ? '#ffd700' : '#ff4d6d';

  const sideMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: def.isRoyal ? royalColor : sideColor, roughness: 0.5 }),
    [def.isRoyal, royalColor, sideColor],
  );
  const portraitMat = useMemo(() => {
    if (!portraitTexture) return null;
    return new THREE.MeshStandardMaterial({
      map: portraitTexture,
      transparent: false,
      alphaTest: 0.1,
      roughness: 0.4,
      metalness: 0.05,
    });
  }, [portraitTexture]);
  const materials = useMemo(() => {
    if (!portraitMat) return null;
    return [sideMat, sideMat, portraitMat, sideMat, sideMat, sideMat];
  }, [sideMat, portraitMat]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.lerp(target, Math.min(1, delta * 12));
    const scale = isSelected ? 1.08 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), Math.min(1, delta * 12));
  });

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      if (captureMove) {
        onCapture(captureMove);
      } else {
        onSelect(piece);
      }
    },
    [captureMove, onCapture, onSelect, piece],
  );

  return (
    <group ref={groupRef} position={target} onClick={handleClick}>
      <mesh position={[0, BASE_CENTER_Y, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.38, 0.06, 32]} />
        <meshStandardMaterial color={def.isRoyal ? royalColor : sideColor} roughness={0.4} metalness={0.15} />
      </mesh>
      <mesh position={[0, TILE_TOP_Y + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.41, 0.47, 48]} />
        <meshBasicMaterial color={sideColor} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      {materials ? (
        <mesh position={[0, TOKEN_Y, 0]} castShadow receiveShadow>
          <boxGeometry args={[TOKEN_SIZE, TOKEN_THICKNESS, TOKEN_SIZE]} />
          {materials.map((mat, i) => (
            <primitive key={mat.uuid} object={mat} attach={`material-${i}`} />
          ))}
        </mesh>
      ) : (
        <mesh position={[0, TOKEN_Y, 0]} castShadow>
          <boxGeometry args={[TOKEN_SIZE, TOKEN_THICKNESS, TOKEN_SIZE]} />
          <meshStandardMaterial color={sideColor} />
        </mesh>
      )}
      {def.isRoyal && (
        <mesh position={[0, TOKEN_Y + 0.04, 0]} castShadow>
          <torusGeometry args={[0.36, 0.025, 16, 48]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>
      )}
      {isSelected && (
        <mesh position={[0, TILE_TOP_Y + 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.49, 0.52, 48]} />
          <meshBasicMaterial color="#90ee90" transparent opacity={0.9} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function Scene({
  state,
  selectedPieceId,
  onSelectPiece,
  onMove,
  rotation = 0,
  theme,
}: Board3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const selectedPiece = selectedPieceId
    ? state.pieces.find((p) => p.id === selectedPieceId)
    : undefined;

  const moveMap = useMemo(() => {
    const map = new Map<string, Move>();
    for (const move of state.highlightedMoves) {
      map.set(posKey(move.to), move);
    }
    return map;
  }, [state.highlightedMoves]);

  const handleTileClick = useCallback(
    (pos: Position) => {
      const move = moveMap.get(posKey(pos));
      if (move && state.turn === 'player' && state.phase === 'battle') {
        onMove(move);
        return;
      }
    },
    [moveMap, onMove, state.turn, state.phase],
  );

  const handlePieceSelect = useCallback(
    (piece: PieceInstance) => {
      onSelectPiece(piece.id);
    },
    [onSelectPiece],
  );

  const tiles: Position[] = useMemo(() => {
    const list: Position[] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        list.push({ x, y });
      }
    }
    return list;
  }, []);

  return (
    <group ref={groupRef} rotation={[0, (rotation * Math.PI) / 180, 0]}>
      <BaseBoard theme={theme} />
      {tiles.map((pos) => {
        const move = moveMap.get(posKey(pos));
        const isSelectedTile = Boolean(selectedPiece && positionsEqual(selectedPiece.position, pos));
        const isEnemySelected = selectedPiece?.side === 'enemy';
        return (
          <TileHighlight
            key={posKey(pos)}
            pos={pos}
            selected={isSelectedTile}
            validMove={Boolean(move && !move.capture)}
            validCapture={Boolean(move?.capture && !isEnemySelected)}
            enemyRange={Boolean(move && !move.capture && isEnemySelected)}
            enemyCapture={Boolean(move?.capture && isEnemySelected)}
            onClick={handleTileClick}
            theme={theme}
          />
        );
      })}
      {state.pieces.map((piece) => {
        const move = moveMap.get(posKey(piece.position));
        const isCapture = Boolean(move?.capture);
        return (
          <Piece3D
            key={piece.id}
            piece={piece}
            isSelected={piece.id === selectedPieceId}
            captureMove={isCapture ? move : undefined}
            onSelect={handlePieceSelect}
            onCapture={onMove}
          />
        );
      })}
    </group>
  );
}

function CameraSetup() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 9, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <OrbitControls
      enablePan={false}
      minDistance={5}
      maxDistance={18}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2.2}
      target={[0, 0, 0]}
      autoRotate={false}
    />
  );
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function LoadingFallback() {
  return (
    <mesh>
      <planeGeometry args={[4, 4]} />
      <meshBasicMaterial color="#ffb7d5" />
    </mesh>
  );
}

function useWebGLContextLost(): [boolean, React.RefObject<HTMLDivElement | null>] {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lost, setLost] = useState(false);

  useEffect(() => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return undefined;
    const handleLost = () => setLost(true);
    canvas.addEventListener('webglcontextlost', handleLost);
    return () => canvas.removeEventListener('webglcontextlost', handleLost);
  }, []);

  return [lost, containerRef];
}

function TwoDBoardFallback(props: Board3DProps) {
  return (
    <Board
      state={props.state}
      selectedPieceId={props.selectedPieceId}
      onSelectPiece={props.onSelectPiece}
      onMove={props.onMove}
      rotation={props.rotation}
      theme={props.theme}
    />
  );
}

export function Board3D(props: Board3DProps) {
  const webglSupported = useWebGLSupport();
  const [contextLost, containerRef] = useWebGLContextLost();

  if (webglSupported === null) {
    return <div className="board-container board-loading" />;
  }

  if (!webglSupported || contextLost) {
    return <TwoDBoardFallback {...props} />;
  }

  return (
    <CanvasErrorBoundary fallback={<TwoDBoardFallback {...props} />}>
      <div className="board-container" ref={containerRef}>
        <Canvas
          shadows
          gl={{ antialias: true, alpha: false, powerPreference: 'default' }}
          style={{ background: '#fff0f5', width: '100%', height: '100%', borderRadius: '8px', display: 'block' }}
          camera={{ fov: 45, near: 0.1, far: 100, position: [0, 9, 8] }}
        >
          <color attach="background" args={['#fff0f5']} />
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[6, 12, 6]}
            intensity={1.4}
            castShadow
            shadow-mapSize={[512, 512]}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
          />
          <Suspense fallback={<LoadingFallback />}>
            <Scene {...props} />
          </Suspense>
          <CameraSetup />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
