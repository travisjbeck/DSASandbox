#include <stdio.h>

int binary_search(int arry[], int size, int value);

int main(void)
{
  int arr[] = {1, 2, 3, 4, 5};

  // On most systems (might vary by compiler/architecture):
  // sizeof(numbers) = 20    // Total array: 5 integers * 4 bytes per integer
  // sizeof(numbers[0]) = 4  // One integer = 4 bytes
  // int size = sizeof(numbers) / sizeof(numbers[0]);  // 20/4 = 5 elements

  int length = sizeof(arr) / sizeof(arr[0]);

  printf("Index of 3: %i\n", binary_search(arr, length, 3));
  printf("Index of 9: %i\n", binary_search(arr, length, 9));
  printf("Index of 4: %i\n", binary_search(arr, length, 4));
}

int binary_search(int arry[], int size, int value)
{
  int leftIndex = 0;
  int rightIndex = size - 1;
  while (leftIndex <= rightIndex)
  {
    int mid = (rightIndex + leftIndex) / 2;
    if (arry[mid] == value)
    {
      return mid;
    }
    if (value < arry[mid])
    {
      rightIndex = mid - 1;
    }
    else
    {
      leftIndex = mid + 1;
    }
  }
  return -1;
}
