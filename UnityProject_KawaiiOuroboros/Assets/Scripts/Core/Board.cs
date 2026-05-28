using UnityEngine;
using System.Collections.Generic;

public class Board : MonoBehaviour
{
    public int Width = 8;
    public int Height = 8;

    private Piece[,] grid;

    private void Awake()
    {
        grid = new Piece[Width, Height];
    }

    public bool IsValidPosition(Vector2Int pos)
    {
        return pos.x >= 0 && pos.x < Width && pos.y >= 0 && pos.y < Height;
    }

    public Piece GetPiece(Vector2Int pos)
    {
        if (!IsValidPosition(pos)) return null;
        return grid[pos.x, pos.y];
    }

    public void SetPiece(Vector2Int pos, Piece piece)
    {
        if (!IsValidPosition(pos)) return;
        grid[pos.x, pos.y] = piece;
        if (piece != null) piece.Position = pos;
    }

    public void MovePiece(Vector2Int from, Vector2Int to)
    {
        Piece piece = GetPiece(from);
        if (piece == null) return;

        Piece target = GetPiece(to);
        if (target != null && target.IsPlayerPiece != piece.IsPlayerPiece)
        {
            Destroy(target.gameObject);
        }

        SetPiece(from, null);
        SetPiece(to, piece);
        piece.transform.position = new Vector3(to.x, to.y, 0);
    }

    public List<Vector2Int> GetValidMoves(Piece piece)
    {
        List<Vector2Int> moves = new List<Vector2Int>();

        // Basic movement logic - will be expanded per piece type
        for (int x = 0; x < Width; x++)
        {
            for (int y = 0; y < Height; y++)
            {
                Vector2Int target = new Vector2Int(x, y);
                if (piece.CanMoveTo(target, this) && GetPiece(target) == null)
                {
                    moves.Add(target);
                }
            }
        }
        return moves;
    }
}