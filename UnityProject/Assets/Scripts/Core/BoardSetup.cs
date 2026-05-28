using UnityEngine;

public class BoardSetup : MonoBehaviour
{
    public Board board;
    public Piece[] playerPieces;
    public Piece[] enemyPieces;

    private void Start()
    {
        // Spawn player pieces on bottom row
        for (int i = 0; i < playerPieces.Length && i < 8; i++)
        {
            if (playerPieces[i] != null)
            {
                Piece p = Instantiate(playerPieces[i]);
                board.SetPiece(new Vector2Int(i, 0), p);
                p.IsPlayerPiece = true;
            }
        }

        // Spawn enemy pieces on top row
        for (int i = 0; i < enemyPieces.Length && i < 8; i++)
        {
            if (enemyPieces[i] != null)
            {
                Piece p = Instantiate(enemyPieces[i]);
                board.SetPiece(new Vector2Int(i, 7), p);
                p.IsPlayerPiece = false;
            }
        }
    }
}