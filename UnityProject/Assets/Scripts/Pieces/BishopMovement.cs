using UnityEngine;

public class BishopMovement : Piece
{
    public override bool CanMoveTo(Vector2Int target, Board board)
    {
        int dx = Mathf.Abs(target.x - Position.x);
        int dy = Mathf.Abs(target.y - Position.y);

        if (dx != dy) return false; // Must be diagonal

        int stepX = Position.x < target.x ? 1 : -1;
        int stepY = Position.y < target.y ? 1 : -1;

        for (int i = 1; i < dx; i++)
        {
            Vector2Int check = new Vector2Int(Position.x + i * stepX, Position.y + i * stepY);
            if (board.GetPiece(check) != null)
                return false;
        }

        return true;
    }
}