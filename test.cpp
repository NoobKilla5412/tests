#include <iostream>

using namespace std;

int main() {
  auto startTime = time(0);

  int num = 1000000;

  int i = 0;

  while (i < num) {
    cout << "Text" << i << "\n";
    i++;
  }

  auto endTime = time(0);

  cout << (((double)(endTime - startTime) / num)) << endl;
  return 0;
}
