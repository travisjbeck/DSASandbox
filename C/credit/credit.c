
#include <stdio.h>
#include <cs50.h>
#include <stdlib.h>
#include <string.h>

const int MAX_DIGITS = 16;
const int MIN_DIGITS = 13;

int *get_number_array(long number, int length);
void print_array(int *array, int size);
int num_size(long num);
void unzip_array(int *input, int length, int *left, int *right);
void multiply_array(int *arr, int length, int multiplier);

typedef struct
{
  int *items;
  int size;
} Array;

int main(void)
{
  long number = 0;
  while (number <= 0)
  {
    number = get_long("Number: ");
  }

  int length = num_size(number);

  if (length > MAX_DIGITS || length < MIN_DIGITS)
  {
    printf("INVALID\n");
    return 1;
  }

  // put each digit of our number into an array so we can work with each digit separately
  int *nums = get_number_array(number, length);

  // STEP 1:
  // Multiply every other digit by 2, starting with the number’s second-to-last digit, and then add those products’ digits together.

  // Unzip our array into left and right.
  // Which one is left and which is right and what size are they?
  // If the length is even, then they're both sized length / 2
  // if the length is odd, the they're sized (length / 2 + 1) and (length / 2)

  int remainder = length % 2;
  int evenLength = (length / 2) + remainder;
  int oddLength = (length / 2);
  int *even = malloc(evenLength * sizeof(int));
  int *odd = malloc(oddLength * sizeof(int));

  unzip_array(nums, length, even, odd);
  // if the length is odd (length % 2 > 0), the odd unzipped array is the one to multiply
  // if the length is even (length % 2 == 0) the even unzipped array is the one to multiply
  // create our Arrays with sizes to use for the operations
  Array *nums_to_mult = malloc(sizeof(Array));
  nums_to_mult->items = remainder == 0 ? even : odd;
  nums_to_mult->size = remainder == 0 ? evenLength : oddLength;

  Array *nums_left = malloc(sizeof(Array));
  nums_left->items = remainder == 0 ? odd : even;
  nums_left->size = remainder == 0 ? oddLength : evenLength;

  print_array(nums_to_mult->items, nums_to_mult->size);

  multiply_array(nums_to_mult->items, nums_to_mult->size, 2);

  print_array(nums_to_mult->items, nums_to_mult->size);
  free(nums);

  free(even);
  free(odd);
  return 1;
};

// takes an input arry and two empty array pointers.
// unzips the input array into the two pointer arrays
void unzip_array(int *input, int length, int *even, int *odd)
{
  int odd_index = 0;
  int even_index = 0;
  for (int i = 0; i < length; i++)
  {
    if (i % 2 == 0)
    {
      even[even_index] = input[i];
      even_index++;
    }
    else
    {
      odd[odd_index] = input[i];
      odd_index++;
    }
  }
}

void multiply_array(int *arr, int length, int multiplier)
{
  for (int i = 0; i < length; i++)
  {
    arr[i] = arr[i] * 2;
  }
}

// convert a number to an array of integers
int *get_number_array(long number, int length)
{
  int *nums = malloc(length * sizeof(int));
  // peel off each number right to eveng modulo and add to the array right to left
  int index = length - 1;
  while (number)
  {
    nums[index] = number % 10;
    number /= 10;
    index--;
  }

  return nums;
}

int num_size(long num)
{
  int length = 0;
  do
  {
    num = num / 10;
    length++;
  } while (num != 0);

  return length;
}

void print_array(int *array, int size)
{
  for (int i = 0; i < size; i++)
  {
    printf("%i", array[i]);
  }
  printf("\n");
}