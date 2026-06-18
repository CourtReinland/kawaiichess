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
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
  });
  return path ? (Array.isArray(texture) ? texture[0] : texture) : null;
}

function BaseBoard({ theme }: { theme?: string }) {
  const texture = useBoardTexture(theme);
  const sideMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5a4a52' }), []);
  const topMat = useMemo(() => {
    if (!texture) return new THREE.MeshStandardMaterial({ color: '#fff0f5' });
    return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.6, metalness: 0.05 });
  }, [texture]);

  const materials = useMemo(
    () => [sideMat, sideMat, topMat, sideMat, sideMat, sideMat],
    [sideMat, topMat],
  );

  return (
    <mesh receiveShadow position={[0, -0.06, 0]}>
      <boxGeometry args={[BOARD_SIZE, 0.12, BOARD_SIZE]} />
      {materials.map((mat, i) => (
        <primitive key={mat.uuid} object={mat} attach={`material-${i}`} />
      ))}
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
}: {
  pos: Position;
  selected: boolean;
  validMove: boolean;
  validCapture: boolean;
  enemyRange: boolean;
  enemyCapture: boolean;
  onClick: (pos: Position) => void;
}) {
  const world = useMemo(() => posToWorld(pos), [pos]);
  const isLight = (pos.x + pos.y) % 2 === 0;
  const baseColor = isLight ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <group position={world} onClick={(e) => { e.stopPropagation(); onClick(pos); }}>
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[0.98, 0.98]} />
        <meshStandardMaterial color={baseColor} transparent opacity={0.3} depthWrite={false} />
      </mesh>
      {selected && (
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[0.95, 0.95]} />
          <meshStandardMaterial color="#90ee90" transparent opacity={0.45} emissive="#90ee90" emissiveIntensity={0.3} />
        </mesh>
      )}
      {validMove && !validCapture && (
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
          <meshStandardMaterial color="#90ee90" emissive="#90ee90" emissiveIntensity={0.5} transparent opacity={0.85} />
        </mesh>
      )}
      {(validCapture || enemyCapture) && (
        <mesh position={[0, 0.02, 0]}>
          <torusGeometry args={[0.32, 0.06, 16, 32]} />
          <meshStandardMaterial color={enemyCapture ? '#ff1493' : '#ff6b6b'} emissive={enemyCapture ? '#ff1493' : '#ff6b6b'} emissiveIntensity={0.5} />
        </mesh>
      )}
      {enemyRange && !enemyCapture && (
        <mesh position={[0, 0.02, 0]}>
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

const CARD_WIDTH = 0.55;
const CARD_HEIGHT = 0.7;
const CARD_DEPTH = 0.04;
const CARD_Y = 0.06 + CARD_HEIGHT / 2;

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
  const cardRef = useRef<THREE.Mesh>(null);
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
      side: THREE.DoubleSide,
      roughness: 0.4,
      metalness: 0.05,
    });
  }, [portraitTexture]);
  const materials = useMemo(() => {
    if (!portraitMat) return null;
    return [sideMat, sideMat, sideMat, sideMat, portraitMat, portraitMat];
  }, [sideMat, portraitMat]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.lerp(target, Math.min(1, delta * 12));
    const scale = isSelected ? 1.1 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), Math.min(1, delta * 12));

    if (cardRef.current) {
      const localCam = state.camera.position.clone();
      groupRef.current.worldToLocal(localCam);
      localCam.y = CARD_Y;
      cardRef.current.rotation.y = Math.atan2(localCam.x, localCam.z);
    }
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
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.36, 0.06, 32]} />
        <meshStandardMaterial color={def.isRoyal ? royalColor : sideColor} roughness={0.4} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.39, 0.45, 48]} />
        <meshBasicMaterial color={sideColor} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      {def.isRoyal && (
        <mesh position={[0, 0.07, 0]} castShadow>
          <torusGeometry args={[0.34, 0.025, 16, 48]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>
      )}
      {materials ? (
        <mesh ref={cardRef} position={[0, CARD_Y, 0]} castShadow receiveShadow>
          <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} />
          {materials.map((mat, i) => (
            <primitive key={mat.uuid} object={mat} attach={`material-${i}`} />
          ))}
        </mesh>
      ) : (
        <mesh ref={cardRef} position={[0, CARD_Y, 0]} castShadow>
          <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} />
          <meshStandardMaterial color={sideColor} />
        </mesh>
      )}
      {isSelected && (
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.47, 0.5, 48]} />
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
