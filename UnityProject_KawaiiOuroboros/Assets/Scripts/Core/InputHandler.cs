using UnityEngine;

public class InputHandler : MonoBehaviour
{
    public GameManager gameManager;
    public Camera mainCamera;

    private void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            Vector2 mousePos = mainCamera.ScreenToWorldPoint(Input.mousePosition);
            Vector2Int boardPos = new Vector2Int(Mathf.RoundToInt(mousePos.x), Mathf.RoundToInt(mousePos.y));

            HandleClick(boardPos);
        }
    }

    private void HandleClick(Vector2Int boardPos)
    {
        Piece piece = gameManager.Board.GetPiece(boardPos);

        if (piece != null && piece.IsPlayerPiece)
        {
            gameManager.SelectPiece(piece);
        }
        else if (gameManager.SelectedPiece != null)
        {
            gameManager.TryMovePiece(boardPos);
        }
        else
        {
            // Deselect if clicking empty space
            gameManager.SelectedPiece = null;
            if (gameManager.moveHighlighter != null)
                gameManager.moveHighlighter.ClearHighlights();
        }
    }
}