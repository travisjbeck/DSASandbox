#include <stdio.h>

void print_array(int arr[], int size);

int main(void)
{
  int arr[] = {8, 4, 43, 2, 1};
  int length = sizeof(arr) / sizeof(arr[0]);
  print_array(arr, length);

  int right = length - 1;
  while (right > 0)
  {
    for (int i = 0; i < right; i++)
    {
      if (arr[i] > arr[i + 1])
      {
        // swap them
        int temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
      }
    }
    right--;
  }

  print_array(arr, length);
}

void print_array(int arr[], int size)
{
  for (int i = 0; i < size; i++)
  {
    printf("%i ", arr[i]);
  }
  printf("\n");
}