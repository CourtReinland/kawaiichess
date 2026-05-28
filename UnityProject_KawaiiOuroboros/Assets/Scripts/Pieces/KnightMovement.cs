using UnityEngine;

public class KnightMovement : Piece
{
    public override bool CanMoveTo(Vector2Int target, Board board)
    {
        int dx = Mathf.Abs(target.x - Position.x);
        int dy = Mathf.Abs(target.y - Position.y);
        return (dx == 1 && dy == 2) || (dx == 2 && dy == 1);
    }
}