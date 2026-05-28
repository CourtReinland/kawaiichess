using UnityEngine;
using System.Collections.Generic;

public class SimpleEnemyAI : MonoBehaviour
{
    public Board board;
    public TurnSystem turnSystem;

    public void TakeTurn()
    {
        // Very basic AI: move first enemy piece found
        for (int x = 0; x < board.Width; x++)
        {
            for (int y = 0; y < board.Height; y++)
            {
                Piece piece = board.GetPiece(new Vector2Int(x, y));
                if (piece != null && !piece.IsPlayerPiece)
                {
                    // Try to move forward
                    Vector2Int target = new Vector2Int(x, y - 1);
                    if (board.IsValidPosition(target) && board.GetPiece(target) == null)
                    {
                        board.MovePiece(piece.Position, target);
                        turnSystem.EndEnemyTurn();
                        return;
                    }
                }
            }
        }

        // If no move possible, end turn
        turnSystem.EndEnemyTurn();
    }
}