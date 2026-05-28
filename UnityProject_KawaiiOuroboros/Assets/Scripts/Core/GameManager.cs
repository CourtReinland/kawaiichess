using UnityEngine;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;

    public Board Board;
    public Piece SelectedPiece;
    public MoveHighlighter moveHighlighter;

    private void Awake()
    {
        Instance = this;
    }

    public void SelectPiece(Piece piece)
    {
        SelectedPiece = piece;
        piece.OnSelected();

        if (moveHighlighter != null)
        {
            List<Vector2Int> moves = Board.GetValidMoves(piece);
            moveHighlighter.ShowMoves(moves);
        }
    }

    public void TryMovePiece(Vector2Int target)
    {
        if (SelectedPiece == null) return;

        if (SelectedPiece.CanMoveTo(target, Board))
        {
            Board.MovePiece(SelectedPiece.Position, target);
            SelectedPiece.Position = target;
            SelectedPiece = null;

            if (moveHighlighter != null)
                moveHighlighter.ClearHighlights();

            // Check win condition after move
            if (FindObjectOfType<WinCondition>()?.CheckForWin() == true)
            {
                Debug.Log("Game Over");
            }
        }
    }
}