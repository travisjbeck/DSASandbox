#include <stdio.h>

int binary_search(int arry[], int size, int value);

int main(void)
{
  int arr[] = {1, 2, 3, 4, 5};

  // variable to store size of arr
  int length = sizeof(arr) / sizeof(arr[0]);

  printf("Index of 3: %i", binary_search(arr, length, 3));
  printf("Index of 9: %i", binary_search(arr, length, 9));
  printf("Index of 4: %i", binary_search(arr, length, 4));
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
