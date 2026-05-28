using UnityEngine;
using UnityEngine.UI;

public class EndTurnButton : MonoBehaviour
{
    public TurnSystem turnSystem;
    public Button button;

    private void Start()
    {
        if (button != null)
        {
            button.onClick.AddListener(EndTurn);
        }
    }

    public void EndTurn()
    {
        if (turnSystem != null && turnSystem.CurrentTurn == TurnSystem.TurnState.Player)
        {
            turnSystem.EndPlayerTurn();
        }
    }
}