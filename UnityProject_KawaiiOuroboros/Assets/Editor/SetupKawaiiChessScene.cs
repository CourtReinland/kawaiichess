using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using System.IO;
using System.Linq;
using System.Reflection;

/// <summary>
/// One-click minimal scene setup for KawaiiChess.
/// Menu: KawaiiChess → Setup Minimal MainTest Scene (and Wire Systems)
///
/// This creates:
/// - Assets/Scenes/MainTest.unity (if missing)
/// - A "Systems" GameObject with all core components attached
/// - Basic Camera + Light
/// - Attempts to auto-wire references between components
///
/// Run this once after opening the project for the first time.
/// Then use KawaiiChess → Build Android APK
/// </summary>
public static class SetupKawaiiChessScene
{
    private const string ScenePath = "Assets/Scenes/MainTest.unity";
    private const string SystemsName = "Systems";

    [MenuItem("KawaiiChess/Setup Minimal MainTest Scene (and Wire Systems)")]
    public static void SetupMinimalScene()
    {
        // Ensure Scenes folder exists
        string scenesDir = Path.GetDirectoryName(ScenePath);
        if (!Directory.Exists(scenesDir))
            Directory.CreateDirectory(scenesDir);

        Scene scene;

        if (File.Exists(ScenePath))
        {
            scene = EditorSceneManager.OpenScene(ScenePath);
            Debug.Log("[KawaiiChess] Opened existing MainTest scene.");
        }
        else
        {
            scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            Debug.Log("[KawaiiChess] Created new MainTest scene.");
        }

        // === Create or find Systems GameObject ===
        GameObject systems = GameObject.Find(SystemsName);
        if (systems == null)
        {
            systems = new GameObject(SystemsName);
            Debug.Log("[KawaiiChess] Created 'Systems' GameObject.");
        }

        // === Add all required components (order matters for wiring) ===
        var bootstrap     = GetOrAddComponent(systems, "Bootstrap");
        var board         = GetOrAddComponent(systems, "Board");
        var gameManager   = GetOrAddComponent(systems, "GameManager");
        var turnSystem    = GetOrAddComponent(systems, "TurnSystem");
        var inputHandler  = GetOrAddComponent(systems, "InputHandler");
        var moveHighlighter = GetOrAddComponent(systems, "MoveHighlighter");
        var boardSetup    = GetOrAddComponent(systems, "BoardSetup");
        var enemyAI       = GetOrAddComponent(systems, "SimpleEnemyAI");
        var winCondition  = GetOrAddComponent(systems, "WinCondition");

        // === Try to wire references using reflection (best effort) ===
        TrySetField(bootstrap, "board", board);
        TrySetField(bootstrap, "gameManager", gameManager);
        TrySetField(bootstrap, "turnSystem", turnSystem);
        TrySetField(bootstrap, "inputHandler", inputHandler);
        TrySetField(bootstrap, "moveHighlighter", moveHighlighter);
        TrySetField(bootstrap, "boardSetup", boardSetup);
        TrySetField(bootstrap, "enemyAI", enemyAI);

        TrySetField(gameManager, "board", board);
        TrySetField(gameManager, "turnSystem", turnSystem);
        TrySetField(gameManager, "winCondition", winCondition);

        TrySetField(turnSystem, "board", board);
        TrySetField(turnSystem, "gameManager", gameManager);

        TrySetField(inputHandler, "board", board);
        TrySetField(inputHandler, "gameManager", gameManager);

        TrySetField(moveHighlighter, "board", board);

        TrySetField(boardSetup, "board", board);

        // Note: BoardSetup.playerPieces is an array of prefabs.
        // For a truly minimal build we leave it empty. The game will need real piece prefabs later.
        Debug.LogWarning("[KawaiiChess] BoardSetup.playerPieces is empty. You will need to create simple piece prefabs and assign them for full gameplay.");

        // === Add basic scene objects if missing ===
        if (Camera.main == null)
        {
            GameObject camGO = new GameObject("Main Camera");
            Camera cam = camGO.AddComponent<Camera>();
            cam.orthographic = true;
            cam.orthographicSize = 4.5f;
            camGO.transform.position = new Vector3(0, 0, -10);
            camGO.tag = "MainCamera";
            Debug.Log("[KawaiiChess] Added basic orthographic Main Camera.");
        }

        if (FindObjectOfType<Light>() == null)
        {
            GameObject lightGO = new GameObject("Directional Light");
            Light light = lightGO.AddComponent<Light>();
            light.type = LightType.Directional;
            light.intensity = 1f;
            lightGO.transform.rotation = Quaternion.Euler(50, -30, 0);
            Debug.Log("[KawaiiChess] Added basic Directional Light.");
        }

        // Create a very basic board visual placeholder (user can replace with sprite later)
        if (GameObject.Find("BoardVisual") == null)
        {
            GameObject boardVis = GameObject.CreatePrimitive(PrimitiveType.Quad);
            boardVis.name = "BoardVisual";
            boardVis.transform.localScale = new Vector3(8, 8, 1);
            boardVis.transform.position = Vector3.zero;
            var renderer = boardVis.GetComponent<Renderer>();
            if (renderer != null)
            {
                renderer.sharedMaterial = new Material(Shader.Find("Sprites/Default"));
                renderer.sharedMaterial.color = new Color(0.9f, 0.85f, 0.75f); // light wood-ish
            }
            Debug.Log("[KawaiiChess] Added temporary board visual Quad (replace with your KawaiiChessboard sprite).");
        }

        // Save the scene
        EditorSceneManager.MarkSceneDirty(scene);
        EditorSceneManager.SaveScene(scene, ScenePath);

        // Make sure the scene is in build settings
        AddSceneToBuildSettings(ScenePath);

        Debug.Log("✅ [KawaiiChess] Minimal MainTest scene setup complete!");
        Debug.Log("   Scene saved to: " + ScenePath);
        Debug.Log("   You can now use 'KawaiiChess → Build Android APK' or the build-android.sh script.");
        Debug.LogWarning("   Next steps: Create simple piece prefabs and assign them to BoardSetup.playerPieces for actual gameplay.");
    }

    private static Component GetOrAddComponent(GameObject go, string typeName)
    {
        // Try to find the type in all loaded assemblies
        System.Type type = System.AppDomain.CurrentDomain.GetAssemblies()
            .SelectMany(a => a.GetTypes())
            .FirstOrDefault(t => t.Name == typeName && typeof(Component).IsAssignableFrom(t));

        if (type == null)
        {
            Debug.LogError($"[KawaiiChess] Could not find component type named '{typeName}'. Make sure the script is in the project.");
            return null;
        }

        Component existing = go.GetComponent(type);
        if (existing != null) return existing;

        return go.AddComponent(type);
    }

    private static void TrySetField(object target, string fieldName, object value)
    {
        if (target == null || value == null) return;

        FieldInfo field = target.GetType().GetField(fieldName, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
        if (field != null && field.FieldType.IsAssignableFrom(value.GetType()))
        {
            field.SetValue(target, value);
        }
    }

    private static void AddSceneToBuildSettings(string scenePath)
    {
        var scenes = EditorBuildSettings.scenes.ToList();
        if (!scenes.Any(s => s.path == scenePath))
        {
            scenes.Add(new EditorBuildSettingsScene(scenePath, true));
            EditorBuildSettings.scenes = scenes.ToArray();
            Debug.Log("[KawaiiChess] Added MainTest scene to Build Settings.");
        }
    }
}
