#include <iostream>
#include "Minecraft.cpp"

using namespace std;

// long long longPow(long long a, long long x) {
//   long long res;
//   for (int i = 0; i < x; i++) {
//     res *= a;
//   }
//   return res;
// }

// long long tetration(long long a, int x) {
//   long long res;
//   for (int i = 0; i < x; i++) {
//     res = longPow(res, a);
//   }
//   return res;
// }

// int main() {
//   cout << tetration(5, 4);
//   return 0;
// }

bool Minecraft::isPlayingMinecraft = false;

string toString(bool x) {
  if (x) return "true";
  else return "false";
}

int main() {
  bool minecraft = true;
  if (minecraft) {
    while (minecraft) {
      cout << "Hello, World! " << toString(Minecraft::isPlayingMinecraft) << "\n";
      Minecraft::play();
    }
  }
}
