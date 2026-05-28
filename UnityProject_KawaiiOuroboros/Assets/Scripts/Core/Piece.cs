using UnityEngine;

public class Piece : MonoBehaviour
{
    public string PieceName;
    public Vector2Int Position;
    public bool IsPlayerPiece = true;

    public virtual bool CanMoveTo(Vector2Int target, Board board)
    {
        return board.IsValidPosition(target);
    }

    public virtual void OnSelected()
    {
        Debug.Log($"{PieceName} selected");
    }
}