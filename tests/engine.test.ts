import { Battle } from '../src/core/battle';
import { chooseEnemyMove } from '../src/core/ai';
import { deployment } from '../src/core/run';

let failures = 0;
function check(name: string, cond: boolean): void {
  console.log(`${cond ? 'PASS' : 'FAIL'} ${name}`);
  if (!cond) failures++;
}

// --- pawn basics: forward push, diagonal capture, no forward capture ---
{
  const b = new Battle();
  const pawn = b.spawn('pawn', 'player', { x: 3, y: 3 });
  b.spawn('pawn', 'enemy', { x: 3, y: 4 }); // blocks forward
  b.spawn('pawn', 'enemy', { x: 4, y: 4 }); // diagonal target
  const moves = b.movesFor(pawn).map((m) => `${m.x},${m.y}`);
  check('pawn cannot capture forward', !moves.includes('3,4'));
  check('pawn captures diagonally', moves.includes('4,4'));
}

// --- sliding pieces blocked by friends, capture foes ---
{
  const b = new Battle();
  const rook = b.spawn('rook', 'player', { x: 0, y: 0 });
  b.spawn('pawn', 'player', { x: 0, y: 2 });
  b.spawn('pawn', 'enemy', { x: 3, y: 0 });
  const moves = b.movesFor(rook).map((m) => `${m.x},${m.y}`);
  check('rook stops before friendly piece', moves.includes('0,1') && !moves.includes('0,2'));
  check('rook captures first enemy on ray', moves.includes('3,0') && !moves.includes('4,0'));
}

// --- magical girl barrier: survives first capture, attacker stays put ---
{
  const b = new Battle();
  const rook = b.spawn('rook', 'player', { x: 0, y: 0 });
  const mg = b.spawn('magicalGirl', 'enemy', { x: 0, y: 5 });
  const move = b.allMoves('player').find((m) => m.captureId === mg.id)!;
  check('capture move flags barrier', move.barrierPopped === true);
  b.apply(move);
  check('barrier popped, target survives', !mg.barrier && b.pieces.includes(mg));
  check('attacker did not move', rook.pos.x === 0 && rook.pos.y === 0);
  b.turn = 'player';
  const second = b.allMoves('player').find((m) => m.captureId === mg.id)!;
  b.apply(second);
  check('second capture removes her', !b.pieces.includes(mg));
  check('attacker took her square', rook.pos.y === 5);
}

// --- promotion ---
{
  const b = new Battle();
  const pawn = b.spawn('pawn', 'player', { x: 2, y: 6 });
  b.spawn('king', 'enemy', { x: 7, y: 7 });
  const move = b.allMoves('player').find((m) => m.to.y === 7 && m.pieceId === pawn.id)!;
  check('promotion flagged', move.promotion === true);
  b.apply(move);
  check('pawn became queen', pawn.kind === 'queen');
}

// --- undo restores state exactly ---
{
  const b = new Battle();
  const rook = b.spawn('rook', 'player', { x: 0, y: 0 });
  const victim = b.spawn('pawn', 'enemy', { x: 0, y: 4 });
  const move = b.allMoves('player').find((m) => m.captureId === victim.id)!;
  const undo = b.apply(move);
  undo();
  check('undo restores position', rook.pos.y === 0);
  check('undo restores victim', b.pieces.includes(victim));
  check('undo restores turn', b.turn === 'player');
}

// --- AI takes a hanging queen ---
{
  const b = new Battle();
  b.spawn('king', 'player', { x: 4, y: 0 });
  b.spawn('queen', 'player', { x: 4, y: 4 });
  b.spawn('king', 'enemy', { x: 4, y: 7 });
  b.spawn('rook', 'enemy', { x: 0, y: 4 });
  b.turn = 'enemy';
  const move = chooseEnemyMove(b, 3)!;
  const target = move.captureId ? b.pieceById(move.captureId)!.kind : 'none';
  check('AI captures the hanging queen', target === 'queen');
}

// --- AI never suicides its king into a defended square needlessly ---
{
  const b = new Battle();
  b.spawn('king', 'player', { x: 0, y: 0 });
  b.spawn('rook', 'player', { x: 7, y: 6 });
  b.spawn('king', 'enemy', { x: 5, y: 7 });
  b.spawn('pawn', 'enemy', { x: 0, y: 6 });
  b.turn = 'enemy';
  const move = chooseEnemyMove(b, 3)!;
  const piece = b.pieceById(move.pieceId)!;
  const movedIntoRookRay = piece.kind === 'king' && (move.to.y === 6 || move.to.x === 7);
  check('AI king avoids the rook ray', !movedIntoRookRay);
}

// --- deployment: king centered back row, pawns front, no overlaps ---
{
  const spots = deployment(['king', 'knight', 'bishop', 'pawn', 'pawn', 'ninja', 'pawn'], 'player');
  const seen = new Set(spots.map((s) => `${s.x},${s.y}`));
  check('no overlapping deployment squares', seen.size === spots.length);
  const king = spots.find((s) => s.kind === 'king')!;
  check('king centered on back row', king.x === 3 && king.y === 0);
  check('pawns on front row', spots.filter((s) => s.kind === 'pawn').every((s) => s.y === 1));
}

console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
