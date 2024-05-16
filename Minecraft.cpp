class Minecraft {
public:
  static bool isPlayingMinecraft;

  static void play() {
    isPlayingMinecraft = !isPlayingMinecraft;
  }
};