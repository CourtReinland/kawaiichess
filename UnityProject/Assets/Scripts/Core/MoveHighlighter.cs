using UnityEngine;
using System.Collections.Generic;

public class MoveHighlighter : MonoBehaviour
{
    public GameObject highlightPrefab;
    private List<GameObject> highlights = new List<GameObject>();

    public void ShowMoves(List<Vector2Int> moves)
    {
        ClearHighlights();

        foreach (var move in moves)
        {
            Vector3 worldPos = new Vector3(move.x, move.y, -1);
            GameObject highlight = Instantiate(highlightPrefab, worldPos, Quaternion.identity);
            highlights.Add(highlight);
        }
    }

    public void ClearHighlights()
    {
        foreach (var h in highlights)
        {
            Destroy(h);
        }
        highlights.Clear();
    }
}