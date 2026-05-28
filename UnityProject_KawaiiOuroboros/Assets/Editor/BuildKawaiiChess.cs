using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;
using System.IO;
using System.Linq;

/// <summary>
/// One-click Android build helper for KawaiiChess (Kawaii Ouroboros).
/// Run from Unity menu: KawaiiChess > Build Android APK (or Build and Run).
/// For headless/CI use: Unity -batchmode -executeMethod BuildKawaiiChess.BuildAndroidAPK
/// Follow docs/Prototype/Android_Build_Guide.md for scene setup first.
/// </summary>
public static class BuildKawaiiChess
{
    private const string CompanyName = "CourtReinland";
    private const string ProductName = "KawaiiChess";
    private const string PackageName = "com.courtreinland.kawaiichess";
    private const string BuildFolder = "Builds";
    private const string ApkName = "KawaiiChess.apk";

    [MenuItem("KawaiiChess/Build Android APK")]
    public static void BuildAndroidAPK_Menu()
    {
        BuildAndroid(autoRun: false);
    }

    [MenuItem("KawaiiChess/Build and Run on Android Device")]
    public static void BuildAndRunAndroid_Menu()
    {
        BuildAndroid(autoRun: true);
    }

    /// <summary>
    /// Main build entry point for both menu and batchmode.
    /// </summary>
    public static void BuildAndroidAPK()
    {
        BuildAndroid(autoRun: false);
    }

    public static void BuildAndRunAndroid()
    {
        BuildAndroid(autoRun: true);
    }

    private static void BuildAndroid(bool autoRun)
    {
        Debug.Log("[KawaiiChess] Starting Android build...");

        // === Player Settings (matches Android_Build_Guide.md + Art Direction) ===
        PlayerSettings.companyName = CompanyName;
        PlayerSettings.productName = ProductName;
        PlayerSettings.applicationIdentifier = PackageName;

        // Android specific
        PlayerSettings.Android.minSdkVersion = AndroidSdkVersions.AndroidApiLevel24;
        PlayerSettings.Android.targetSdkVersion = AndroidSdkVersions.AndroidApiLevelAuto;
        PlayerSettings.Android.targetArchitectures = AndroidArchitecture.ARM64 | AndroidArchitecture.ARMv7;

        // Nice defaults for a mobile roguelike
        PlayerSettings.orientation = UIOrientation.Portrait; // or AutoRotation if you prefer landscape chess
        PlayerSettings.Android.forceSDCardPermission = false;
        PlayerSettings.Android.androidIsGame = true;

        // Optional: Set a nice icon later when you have one in Assets/Art/UI/
        // PlayerSettings.SetIconsForTargetGroup(BuildTargetGroup.Android, ...);

        // === Find scenes ===
        // Primary expectation: Assets/Scenes/MainTest.unity (see Android_Build_Guide.md)
        string[] sceneGuids = AssetDatabase.FindAssets("t:Scene", new[] { "Assets" });
        string[] scenes = sceneGuids
            .Select(guid => AssetDatabase.GUIDToAssetPath(guid))
            .Where(path => !string.IsNullOrEmpty(path))
            .ToArray();

        if (scenes.Length == 0)
        {
            Debug.LogError("[KawaiiChess] No scenes found in the project!\n" +
                           "Please follow docs/Prototype/Android_Build_Guide.md:\n" +
                           "1. Create Assets/Scenes/MainTest.unity\n" +
                           "2. Create a Systems GameObject and wire Bootstrap + Board + GameManager etc.\n" +
                           "3. Add the scene to Build Settings.");
            return;
        }

        Debug.Log($"[KawaiiChess] Using scenes: {string.Join(", ", scenes)}");

        // === Output path ===
        string projectRoot = Path.GetDirectoryName(Application.dataPath);
        string outputDir = Path.Combine(projectRoot, BuildFolder);
        Directory.CreateDirectory(outputDir);

        string apkPath = Path.Combine(outputDir, ApkName);

        // Clean old build
        if (File.Exists(apkPath))
        {
            File.Delete(apkPath);
        }

        // === Build ===
        BuildPlayerOptions options = new BuildPlayerOptions
        {
            scenes = scenes,
            locationPathName = apkPath,
            target = BuildTarget.Android,
            options = BuildOptions.None
        };

        if (autoRun)
        {
            options.options |= BuildOptions.AutoRunPlayer;
            Debug.Log("[KawaiiChess] AutoRunPlayer enabled — will attempt to install + launch on connected device.");
        }

        Debug.Log($"[KawaiiChess] Building to: {apkPath}");

        BuildReport report = BuildPipeline.BuildPlayer(options);
        BuildSummary summary = report.summary;

        if (summary.result == BuildResult.Succeeded)
        {
            Debug.Log($"[KawaiiChess] ✅ Build succeeded!\nAPK: {apkPath}\nSize: {new FileInfo(apkPath).Length / (1024 * 1024)} MB");
            Debug.Log("[KawaiiChess] You can now use adb install or the 'Build and Run' menu item.");
        }
        else
        {
            Debug.LogError($"[KawaiiChess] ❌ Build failed: {summary.result}");
            foreach (var step in report.steps)
            {
                if (step.messages.Any(m => m.type == LogType.Error || m.type == LogType.Exception))
                {
                    Debug.LogError($"Step {step.name} had errors.");
                }
            }
        }
    }
}
