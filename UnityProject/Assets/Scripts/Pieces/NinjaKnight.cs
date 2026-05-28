using UnityEngine;

public class NinjaKnight : Piece
{
    private int shadowStepsLeft = 2;

    public override bool CanMoveTo(Vector2Int target, Board board)
    {
        // Classic Knight L-move
        int dx = Mathf.Abs(target.x - Position.x);
        int dy = Mathf.Abs(target.y - Position.y);
        return (dx == 1 && dy == 2) || (dx == 2 && dy == 1);
    }

    public void UseShadowStep()
    {
        if (shadowStepsLeft > 0)
        {
            shadowStepsLeft--;
            Debug.Log($"{PieceName} used Shadow Step. {shadowStepsLeft} remaining.");
        }
    }
}