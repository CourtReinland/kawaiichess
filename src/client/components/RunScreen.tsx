import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  BattleState,
  CaptureScene,
  Move,
  PieceDefinition,
  Position,
  RunState,
  StoryScene,
} from '../../game';
import {
  acceptDraft,
  advanceStage,
  applyMove,
  buildDeployPieces,
  checkBattleEnd,
  createBattleState,
  createRunState,
  extractDeployments,
  generateDraft,
  getDefinition,
  getStoryScene,
  getValidMoves,
  isRunComplete,
  loadRun,
  recordDefeat,
  saveRun,
  switchTurn,
  clearSavedRun,
} from '../../game';
import { PIECE_BY_ID } from '../../game/pieces';
import { getCaptureScene } from '../../game/cinematics';
import { generateEnemyMove, hasAnyValidMoves } from '../../game/ai-engine';
import { getAcademy, PLAYER_ACADEMY_ID } from '../../game/academies';
import { Board3D } from './Board3D';
import { CaptureFinisher } from './CaptureFinisher';
import { DeploymentScreen, type DeployPiece } from './DeploymentScreen';
import { DraftScreen } from './DraftScreen';
import { VisualNovelScene } from './VisualNovelScene';
import { TournamentMap } from './TournamentMap';

type Screen = 'start' | 'map' | 'intro' | 'deploy' | 'battle' | 'draft' | 'end';

function StartScreen({ onNewRun, onContinue }: { onNewRun: () => void; onContinue?: () => void }) {
  return (
    <div className="overlay-screen start-screen rich-start">
      <div className="start-backdrop" />
      <div className="start-content">
        <h2>Kawaii Chess Academy 🎀</h2>
        <p>
          Lead Alishan Academy through the national inter-school chess tournament. Recruit club
          members, outwit rival academies, and claim the championship throne!
        </p>
        <div className="menu-buttons">
          <button className="kawaii-button" onClick={onNewRun} type="button">
            Begin Prologue
          </button>
          {onContinue && (
            <button className="kawaii-button secondary" onClick={onContinue} type="button">
              Continue Run
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EndScreen({
  run,
  isVictory,
  onRewind,
}: {
  run: RunState;
  isVictory: boolean;
  onRewind: () => void;
}) {
  return (
    <div className="overlay-screen">
      <h2>{isVictory ? 'Run Complete! 🏆' : 'Defeated... 💔'}</h2>
      <p>
        Matches cleared: {run.victories} / {run.stages.length}
        <br />
        Gold earned: {run.gold}
      </p>
      <div className="control-bar" style={{ maxWidth: '300px' }}>
        <button className="kawaii-button" onClick={onRewind} type="button">
          Rewind Run
        </button>
      </div>
    </div>
  );
}

function getPiecePortrait(pieceId: string): string | undefined {
  const def = PIECE_BY_ID[pieceId];
  if (!def?.portraitImage) return undefined;
  return `/characters/portraits/${def.portraitImage}`;
}

export function RunScreen() {
  const [run, setRun] = useState<RunState | undefined>(undefined);
  const [battle, setBattle] = useState<BattleState | undefined>(undefined);
  const [draftOptions, setDraftOptions] = useState<PieceDefinition[] | undefined>(undefined);
  const [deployPieces, setDeployPieces] = useState<DeployPiece[]>([]);
  const [screen, setScreen] = useState<Screen>('start');
  const [selectedPieceId, setSelectedPieceId] = useState<string>('');
  const [boardRotation, setBoardRotation] = useState<0 | 180>(0);

  const [pendingMove, setPendingMove] = useState<Move | undefined>(undefined);
  const [captureScene, setCaptureScene] = useState<CaptureScene | undefined>(undefined);
  const [activeStoryScene, setActiveStoryScene] = useState<StoryScene | undefined>(undefined);
  const [nextScreenAfterStory, setNextScreenAfterStory] = useState<Screen | undefined>(undefined);
  const [pendingIntroAcademyId, setPendingIntroAcademyId] = useState<string | undefined>(undefined);

  const playStoryScene = useCallback((sceneId: string, then: Screen) => {
    const scene = getStoryScene(sceneId);
    if (!scene) {
      setScreen(then);
      return;
    }
    setActiveStoryScene(scene);
    setNextScreenAfterStory(then);
  }, []);

  const startNewRun = useCallback(() => {
    const newRun = createRunState();
    setRun(newRun);
    setDeployPieces(buildDeployPieces(newRun));
    setBattle(undefined);
    setDraftOptions(undefined);
    setSelectedPieceId('');
    setPendingMove(undefined);
    setCaptureScene(undefined);
    setActiveStoryScene(undefined);
    saveRun(newRun);
    playStoryScene('start-prologue', 'map');
  }, [playStoryScene]);

  const continueRun = useCallback(() => {
    const saved = loadRun();
    if (saved) {
      setRun(saved);
      setDeployPieces(buildDeployPieces(saved));
      setBattle(undefined);
      setDraftOptions(undefined);
      setSelectedPieceId('');
      setPendingMove(undefined);
      setCaptureScene(undefined);
      setActiveStoryScene(undefined);
      setPendingIntroAcademyId(undefined);
      setScreen('map');
    }
  }, []);

  useEffect(() => {
    const saved = loadRun();
    if (!saved) {
      setScreen('start');
    }
  }, []);

  const playKiraTaunt = useCallback(
    (stageIndex: number, then: Screen) => {
      const sceneId = `kira-taunt-${stageIndex}`;
      playStoryScene(sceneId, then);
    },
    [playStoryScene],
  );

  const handleStoryDone = useCallback(() => {
    setActiveStoryScene(undefined);
    if (nextScreenAfterStory === 'intro') {
      setNextScreenAfterStory(undefined);
      const academyId = pendingIntroAcademyId;
      setPendingIntroAcademyId(undefined);
      const academy = academyId ? getAcademy(academyId) : undefined;
      if (academy?.introSceneId) {
        playStoryScene(academy.introSceneId, 'deploy');
      } else {
        setScreen('deploy');
      }
      return;
    }
    if (nextScreenAfterStory) {
      setScreen(nextScreenAfterStory);
      setNextScreenAfterStory(undefined);
    }
  }, [nextScreenAfterStory, pendingIntroAcademyId, playStoryScene]);

  const handleMatchEnd = useCallback(
    (endedBattle?: BattleState) => {
      const battleState = endedBattle ?? battle;
      if (!battleState || !run || battleState.phase === 'battle') return;

      const academy = getAcademy(run.stages[run.stageIndex].academyId);

      if (battleState.phase === 'victory') {
        const afterVictory = advanceStage(run);
        setRun(afterVictory);
        saveRun(afterVictory);
        setBattle(undefined);
        setSelectedPieceId('');
        if (isRunComplete(afterVictory)) {
          clearSavedRun();
          if (academy.outroSceneId) {
            playStoryScene(`${academy.outroSceneId}-victory`, 'end');
          } else {
            setScreen('end');
          }
          return;
        }
        if (academy.outroSceneId) {
          playStoryScene(`${academy.outroSceneId}-victory`, 'map');
        } else {
          setScreen('map');
        }
      } else if (battleState.phase === 'defeat') {
        const afterDefeat = recordDefeat(run);
        setRun(afterDefeat);
        saveRun(afterDefeat);
        setBattle(undefined);
        setSelectedPieceId('');
        clearSavedRun();
        if (academy.outroSceneId) {
          playStoryScene(`${academy.outroSceneId}-defeat`, 'end');
        } else {
          setScreen('end');
        }
      }
    },
    [battle, run, playStoryScene],
  );

  const handleMapSelect = useCallback(
    (matchIndex: number) => {
      if (!run || matchIndex !== run.stageIndex) return;
      const academyId = run.stages[matchIndex].academyId;
      const options = generateDraft(run);
      setDraftOptions(options);
      setPendingIntroAcademyId(academyId);
      if (run.stageIndex > 0) {
        playKiraTaunt(run.stageIndex, 'draft');
      } else {
        setScreen('draft');
      }
    },
    [run, playKiraTaunt],
  );

  const handleStartBattle = useCallback(() => {
    if (!run) return;
    const deployments = extractDeployments(deployPieces);
    const updatedRun = { ...run, deployments };
    setRun(updatedRun);
    saveRun(updatedRun);

    const playerPieces = deployPieces
      .filter((p) => p.position)
      .map((p) => ({ definitionId: p.definitionId, position: p.position as Position }));
    const stage = run.stages[run.stageIndex];
    setBattle(createBattleState(playerPieces, stage.enemyPieces));
    setScreen('battle');
    setSelectedPieceId('');
  }, [run, deployPieces]);

  const handleSelectPiece = useCallback((pieceId: string) => {
    setSelectedPieceId(pieceId);
  }, []);

  const finishMove = useCallback(
    (move: Move) => {
      if (!battle) return;
      const afterMove = checkBattleEnd(switchTurn(applyMove(battle, move)));
      setBattle(afterMove);
      setSelectedPieceId('');

      if (afterMove.phase === 'victory' || afterMove.phase === 'defeat') {
        handleMatchEnd(afterMove);
      }
    },
    [battle, handleMatchEnd],
  );

  const handleMove = useCallback(
    (move: Move) => {
      if (!battle || battle.turn !== 'player' || battle.phase !== 'battle') return;
      if (captureScene) return;

      if (move.capture) {
        const attacker = battle.pieces.find((p) => p.id === move.pieceId);
        const defender = move.capture;
        if (attacker && defender) {
          const scene = getCaptureScene(getDefinition(attacker), getDefinition(defender));
          setPendingMove(move);
          setCaptureScene(scene);
          return;
        }
      }

      finishMove(move);
    },
    [battle, captureScene, finishMove],
  );

  const handleCutsceneDone = useCallback(() => {
    if (pendingMove) {
      finishMove(pendingMove);
    }
    setPendingMove(undefined);
    setCaptureScene(undefined);
  }, [pendingMove, finishMove]);

  // Highlight moves when selection or the board changes.
  useEffect(() => {
    if (!selectedPieceId) {
      setBattle((prev) => (prev ? { ...prev, highlightedMoves: [] } : prev));
      return;
    }
    setBattle((prev) => {
      if (!prev) return prev;
      const moves = getValidMoves(prev, selectedPieceId);
      return { ...prev, highlightedMoves: moves };
    });
  }, [selectedPieceId, battle?.pieces.length, battle?.turn]);

  const battleRef = useRef(battle);
  battleRef.current = battle;
  const enemyTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Enemy turn handler.
  useEffect(() => {
    if (
      !battleRef.current ||
      battleRef.current.turn !== 'enemy' ||
      battleRef.current.phase !== 'battle'
    ) {
      return undefined;
    }
    if (captureScene) return undefined;

    enemyTimerRef.current = setTimeout(() => {
      setBattle((prev) => {
        if (!prev || prev.turn !== 'enemy' || prev.phase !== 'battle') return prev;
        const difficulty = run?.stages[run.stageIndex].difficulty ?? 2;
        const enemyMove = generateEnemyMove(prev, difficulty);
        if (enemyMove === null) {
          // Enemy has no legal moves: stalemate counts as a forfeit/victory for the player.
          if (!hasAnyValidMoves(prev, 'enemy')) {
            const stalemated = {
              ...prev,
              phase: 'victory' as const,
              log: [...prev.log, 'Rival team has no moves and forfeits!'],
            };
            setTimeout(() => handleMatchEnd(stalemated), 0);
            return stalemated;
          }
          // Fallback safety valve: if the engine reports no move but moves exist, pass the turn back rather than hanging.
          return {
            ...switchTurn(prev),
            log: [...prev.log, 'Rival hesitates—turn passes.'],
          };
        }
        if (enemyMove === undefined) {
          // Invalid state or not enemy turn; pass back to player to avoid getting stuck.
          return {
            ...switchTurn(prev),
            log: [...prev.log, 'Rival hesitates—turn passes.'],
          };
        }
        if (enemyMove.capture) {
          const attacker = prev.pieces.find((p) => p.id === enemyMove.pieceId);
          const defender = enemyMove.capture;
          if (attacker && defender) {
            const scene = getCaptureScene(getDefinition(attacker), getDefinition(defender));
            setPendingMove(enemyMove);
            setCaptureScene(scene);
          }
          return prev;
        }
        const afterMove = checkBattleEnd(switchTurn(applyMove(prev, enemyMove)));
        if (afterMove.phase === 'victory' || afterMove.phase === 'defeat') {
          setTimeout(() => handleMatchEnd(afterMove), 0);
        }
        return afterMove;
      });
    }, 800);
    return () => {
      if (enemyTimerRef.current) {
        clearTimeout(enemyTimerRef.current);
        enemyTimerRef.current = undefined;
      }
    };
  }, [
    battle?.turn,
    battle?.phase,
    battle?.pieces.length,
    captureScene,
    run?.stageIndex,
    run?.stages,
    handleMatchEnd,
  ]);

  const handleDraftSelect = useCallback(
    (pieceId: string) => {
      if (!run) return;
      const updatedRun = acceptDraft(run, pieceId);
      setRun(updatedRun);
      saveRun(updatedRun);
      setDraftOptions(undefined);
      setDeployPieces(buildDeployPieces(updatedRun));
      const academyId = pendingIntroAcademyId ?? run.stages[run.stageIndex].academyId;
      const academy = getAcademy(academyId);
      if (academy.introSceneId) {
        playStoryScene(academy.introSceneId, 'deploy');
      } else {
        setScreen('deploy');
      }
    },
    [run, pendingIntroAcademyId, playStoryScene],
  );

  const handleSkipDraft = useCallback(() => {
    if (!run) return;
    saveRun(run);
    setDraftOptions(undefined);
    setDeployPieces(buildDeployPieces(run));
    const academyId = pendingIntroAcademyId ?? run.stages[run.stageIndex].academyId;
    const academy = getAcademy(academyId);
    if (academy.introSceneId) {
      playStoryScene(academy.introSceneId, 'deploy');
    } else {
      setScreen('deploy');
    }
  }, [run, pendingIntroAcademyId, playStoryScene]);

  const handleRewind = useCallback(() => {
    clearSavedRun();
    startNewRun();
  }, [startNewRun]);

  const currentStageName = useMemo(() => {
    if (!run) return '';
    if (run.stageIndex >= run.stages.length) return 'Victory!';
    return run.stages[run.stageIndex].name;
  }, [run]);

  const currentDifficulty = useMemo(() => {
    if (!run) return 1;
    return run.stages[Math.min(run.stageIndex, run.stages.length - 1)].difficulty;
  }, [run]);

  const currentAcademy = useMemo(() => {
    if (!run) return getAcademy(PLAYER_ACADEMY_ID);
    if (run.stageIndex >= run.stages.length) return getAcademy(PLAYER_ACADEMY_ID);
    return getAcademy(run.stages[run.stageIndex].academyId);
  }, [run]);

  const playerAcademy = useMemo(() => getAcademy(PLAYER_ACADEMY_ID), []);

  const turnText = battle ? (battle.turn === 'player' ? 'Your turn ✨' : 'Enemy turn 👾') : '';

  const selectedPieceInfo = useMemo(() => {
    if (!battle || !selectedPieceId) return undefined;
    const piece = battle.pieces.find((p) => p.id === selectedPieceId);
    if (!piece) return undefined;
    const def = getDefinition(piece);
    return { piece, def };
  }, [battle, selectedPieceId]);

  if (activeStoryScene) {
    return <VisualNovelScene scene={activeStoryScene} onDone={handleStoryDone} />;
  }

  if (screen === 'start') {
    return <StartScreen onNewRun={startNewRun} onContinue={loadRun() ? continueRun : undefined} />;
  }

  if (!run) {
    return <StartScreen onNewRun={startNewRun} />;
  }

  const runComplete = isRunComplete(run);

  return (
    <div className="kawaii-game">
      <header className="game-header">
        <h1 className="game-title">Kawaii Chess Academy</h1>
        <div className="game-stats">
          <span className="stat-pill">Match {Math.min(run.stageIndex + 1, run.stages.length)}</span>
          <span className="stat-pill">Difficulty {currentDifficulty}</span>
          <span className="stat-pill">💰 {run.gold}</span>
          <span className="stat-pill">🏆 {run.victories}</span>
        </div>
      </header>

      {screen === 'map' && (
        <TournamentMap currentStageIndex={run.stageIndex} onSelectNode={handleMapSelect} />
      )}

      {screen === 'deploy' && (
        <DeploymentScreen
          pieces={deployPieces}
          onChange={setDeployPieces}
          onStart={handleStartBattle}
          stageName={currentStageName}
          opponentAcademy={currentAcademy}
          playerAcademy={playerAcademy}
          theme={currentAcademy.id}
        />
      )}

      {screen === 'draft' && draftOptions && (
        <DraftScreen
          options={draftOptions}
          onSelect={handleDraftSelect}
          onSkip={handleSkipDraft}
          stageName={currentStageName}
          playerAcademy={playerAcademy}
        />
      )}

      {screen === 'battle' && battle && (
        <>
          <div className="academy-banner">
            <img
              src={`/academies/${currentAcademy.crestImage}`}
              alt={currentAcademy.name}
              className="academy-crest-small"
            />
            <div className="academy-banner-text">
              <strong>{currentAcademy.name}</strong>
              <span>{currentAcademy.flavorText}</span>
            </div>
          </div>
          <div className={`turn-indicator ${battle.turn}`}>
            {currentStageName} — {turnText}
          </div>
          <Board3D
            state={battle}
            selectedPieceId={selectedPieceId}
            onSelectPiece={handleSelectPiece}
            onMove={handleMove}
            rotation={boardRotation}
            theme={currentAcademy.id}
          />
          <div className="control-bar">
            <button
              className="kawaii-button secondary"
              onClick={() => setSelectedPieceId('')}
              type="button"
            >
              Deselect
            </button>
            <button
              className="kawaii-button secondary"
              onClick={() => setBoardRotation((r) => (r === 0 ? 180 : 0))}
              type="button"
            >
              Rotate Board
            </button>
            <button className="kawaii-button secondary" onClick={handleRewind} type="button">
              Rewind Run
            </button>
          </div>

          {selectedPieceInfo && (
            <div className="piece-info-panel">
              <div className="piece-info-header">
                <span className="piece-info-icon">{selectedPieceInfo.def.icon}</span>
                <div>
                  <h3>{selectedPieceInfo.def.name}</h3>
                  <span className={`piece-info-side ${selectedPieceInfo.piece.side}`}>
                    {selectedPieceInfo.piece.side === 'player' ? 'Your piece' : 'Enemy piece'}
                  </span>
                </div>
              </div>
              <p className="piece-info-movement">
                <strong>Moves:</strong> {selectedPieceInfo.def.movement}
                {selectedPieceInfo.def.range ? ` (range ${selectedPieceInfo.def.range})` : ''}
                {selectedPieceInfo.def.canJump ? ' • jumps pieces' : ''}
              </p>
              {selectedPieceInfo.def.ability && (
                <p className="piece-info-ability">
                  <strong>{selectedPieceInfo.def.ability.name}:</strong>{' '}
                  {selectedPieceInfo.def.ability.description}
                  {selectedPieceInfo.def.ability.uses
                    ? ` (${selectedPieceInfo.piece.abilityUsesLeft ?? selectedPieceInfo.def.ability.uses}/${selectedPieceInfo.def.ability.uses})`
                    : ''}
                </p>
              )}
              {selectedPieceInfo.def.backstory && (
                <p className="piece-info-backstory">{selectedPieceInfo.def.backstory}</p>
              )}
            </div>
          )}

          <div className="army-roster">
            <h3>Your Army</h3>
            <div className="roster-pieces">
              {run.playerArmy.map((id, idx) => {
                const def = PIECE_BY_ID[id];
                if (!def) return null;
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <span key={`${id}-${idx}`} className="roster-piece">
                    {def.icon} {def.name}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="battle-log">
            {battle.log.slice(-6).map((entry, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <p key={`${entry}-${idx}`}>{entry}</p>
            ))}
          </div>
        </>
      )}

      {captureScene &&
        pendingMove &&
        battle &&
        (() => {
          const attacker = battle.pieces.find((p) => p.id === pendingMove.pieceId)!;
          const defender = pendingMove.capture!;
          const attackerDef = getDefinition(attacker);
          const defenderDef = getDefinition(defender);
          return (
            <CaptureFinisher
              scene={captureScene}
              attackerIcon={attackerDef.icon}
              attackerName={attackerDef.name}
              defenderIcon={defenderDef.icon}
              defenderName={defenderDef.name}
              attackerPortrait={getPiecePortrait(attacker.definitionId)}
              defenderPortrait={getPiecePortrait(defender.definitionId)}
              videoPath={`/videos/captures/${attackerDef.id}-captures-${defenderDef.id}.mp4`}
              onDone={handleCutsceneDone}
            />
          );
        })()}

      {screen === 'end' && (
        <EndScreen
          run={run}
          isVictory={runComplete || run.victories >= run.stages.length}
          onRewind={handleRewind}
        />
      )}
    </div>
  );
}
