using UnityEngine;

public class RookMovement : Piece
{
    public override bool CanMoveTo(Vector2Int target, Board board)
    {
        if (Position.x == target.x)
        {
            int step = Position.y < target.y ? 1 : -1;
            for (int y = Position.y + step; y != target.y; y += step)
            {
                if (board.GetPiece(new Vector2Int(Position.x, y)) != null)
                    return false;
            }
            return true;
        }

        if (Position.y == target.y)
        {
            int step = Position.x < target.x ? 1 : -1;
            for (int x = Position.x + step; x != target.x; x += step)
            {
                if (board.GetPiece(new Vector2Int(x, Position.y)) != null)
                    return false;
            }
            return true;
        }

        return false;
    }
}