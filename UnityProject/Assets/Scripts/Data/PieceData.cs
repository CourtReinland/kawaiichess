using UnityEngine;

[CreateAssetMenu(fileName = "NewPieceData", menuName = "KawaiiOuroboros/Piece Data")]
public class PieceData : ScriptableObject
{
    public string PieceName;
    public Sprite Icon;
    public PieceType Type;
    public int MoveRange = 1;
    public bool CanJump = false;

    public enum PieceType
    {
        Rook,
        Knight,
        Bishop,
        Queen,
        King,
        Special
    }
}