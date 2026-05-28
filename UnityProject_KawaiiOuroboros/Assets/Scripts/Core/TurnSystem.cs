using UnityEngine;

public class TurnSystem : MonoBehaviour
{
    public enum TurnState { Player, Enemy }
    public TurnState CurrentTurn = TurnState.Player;

    public SimpleEnemyAI enemyAI;

    public void EndPlayerTurn()
    {
        CurrentTurn = TurnState.Enemy;
        Debug.Log("Enemy turn started");

        if (enemyAI != null)
        {
            enemyAI.TakeTurn();
        }
        else
        {
            EndEnemyTurn();
        }
    }

    public void EndEnemyTurn()
    {
        CurrentTurn = TurnState.Player;
        Debug.Log("Player turn started");
    }
}