using UnityEngine;

public class Bootstrap : MonoBehaviour
{
    public Board board;
    public GameManager gameManager;
    public TurnSystem turnSystem;
    public InputHandler inputHandler;
    public MoveHighlighter moveHighlighter;
    public BoardSetup boardSetup;
    public SimpleEnemyAI enemyAI;

    private void Start()
    {
        // Wire systems together
        gameManager.Board = board;
        gameManager.moveHighlighter = moveHighlighter;

        inputHandler.gameManager = gameManager;
        inputHandler.mainCamera = Camera.main;

        turnSystem.enemyAI = enemyAI;
        enemyAI.board = board;
        enemyAI.turnSystem = turnSystem;

        boardSetup.board = board;

        Debug.Log("Kawaii Ouroboros - Systems initialized");
    }
}