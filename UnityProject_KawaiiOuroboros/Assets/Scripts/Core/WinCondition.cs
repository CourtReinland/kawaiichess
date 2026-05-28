using UnityEngine;

public class WinCondition : MonoBehaviour
{
    public Board board;

    public bool CheckForWin()
    {
        bool playerKingAlive = false;
        bool enemyKingAlive = false;

        for (int x = 0; x < board.Width; x++)
        {
            for (int y = 0; y < board.Height; y++)
            {
                Piece piece = board.GetPiece(new Vector2Int(x, y));
                if (piece != null && piece.PieceName == "King")
                {
                    if (piece.IsPlayerPiece) playerKingAlive = true;
                    else enemyKingAlive = true;
                }
            }
        }

        if (!playerKingAlive)
        {
            Debug.Log("Player lost - King captured");
            // TODO: Show lose screen
            return true;
        }

        if (!enemyKingAlive)
        {
            Debug.Log("Player won - Enemy King captured");
            // TODO: Show win screen
            return true;
        }

        return false;
    }
}