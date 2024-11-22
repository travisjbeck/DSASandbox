// Luhn's Algorithm Implementation

#include <cs50.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

const int MAX_DIGITS = 16;
const int MIN_DIGITS = 13;
const char *VISA = "VISA";
const char *INVALID = "INVALID";
const char *AMEX = "AMEX";
const char *MASTERCARD = "MASTERCARD";

int *get_number_array(long number, int length);
void print_array(int *array, int size);
int num_size(long num);
void multiply_eod(int *arr, int start);
int sum_eod(int *arr, int start);
const char *categorize_card(int nums[], int length);

int main(void)
{

  // get valid input
  while (number <= 0)
  {
    number = get_long("Number: ");
  }

  // how many digits did we get?
  int length = num_size(number);

  if (length > MAX_DIGITS || length < MIN_DIGITS)
  {
    printf("%s\n", INVALID);
    return 0;
  }

  // put each digit of our number into an array
  int *nums = get_number_array(number, length);

  // before the destory our orignal data, test basic validation

  const char *CARD_TYPE = categorize_card(nums, length);

  if (CARD_TYPE == INVALID)
  {
    printf("%s\n", INVALID);
    free(nums);
    return 0;
  }

  // STEP 1:
  // Multiply every other digit by 2, starting with the number’s second-to-last digit.
  multiply_eod(nums, length - 2);

  // get the sum of the sum of digits from each array
  int sum = sum_eod(nums, length - 2) + sum_eod(nums, length - 1);
  if (sum % 10 != 0)
  {
    printf("%s\n", INVALID);
  }
  else
  {
    printf("%s\n", CARD_TYPE);
  }
  free(nums);
  return 0;
};

const char *categorize_card(int nums[], int length)
{
  if (nums[0] == 4 && (length == 13 || length == 16))
  {
    return VISA;
  }

  if (nums[0] == 5 && (nums[1] > 0 && nums[1] < 6) && length == 16)
  {
    return MASTERCARD;
  }
  if (nums[0] == 3 && (nums[1] == 4 || nums[1] == 7) && length == 15)
  {
    return AMEX;
  }

  return INVALID;
}

// adds each individual digit from an array of ints from right to left
int sum_eod(int *arr, int start)
{
  int total = 0;
  for (int i = start; i >= 0; i -= 2) // every other digit
  {
    if (arr[i] > 9)
    {
      // break it into its two digits and add them
      int *nums = get_number_array(arr[i], 2);
      total += (nums[0] + nums[1]);
      free(nums);
    }
    else
    {
      total += arr[i];
    }
  }
  return total;
}

// multiplies every other int in an array * 2 in place from right to left
void multiply_eod(int *arr, int start)
{
  for (int i = start; i >= 0; i -= 2)
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
    printf("%i ", array[i]);
  }
  printf("\n");
}