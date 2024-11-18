#include <stdio.h>
#include <cs50.h>

// $ ./mario
// Height: 8
//        #  #
//       ##  ##
//      ###  ###
//     ####  ####
//    #####  #####
//   ######  ######
//  #######  #######
// ########  ########
void printntimes(int n, char c);

const int MIN_ROWS = 1;
const int MAX_ROWS = 8;
const char SPACE = ' ';
const char BLOCK = '#';

int main(void)
{
  int n = 0;
  // only allow answers between 1 and 8
  while (n < MIN_ROWS || n > MAX_ROWS)
  {
    n = get_int("how many rows: ");
  }

  // we're making rows of reflected bricks
  // each row contains space(n-(i+1)) bricks(i(+1)) staticSpace bricks(i(+1))
  for (int i = 0; i < n; i++)
  {

    // print first spaces
    printntimes(n - (i + 1), SPACE);

    // print blocks
    printntimes(i + 1, BLOCK);

    // print static blocks
    printf(" ");

    // print block
    printntimes(i + 1, BLOCK);

    // return line
    printf("\n");
  }
}

void printntimes(int n, char c)
{
  for (int i = 0; i < n; i++)
  {
    printf("%c", c);
  }
}
