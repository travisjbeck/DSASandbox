#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{

  // takes exactly one command line argument (name of the image file (*.raw)) return helpful error and exit 1 if not
  if (argc != 2)
  {
    printf("Usage: ./recover FILE\n");
    return 1;
  }

  // open the memory card
  FILE *card = fopen(argv[1], 'r');
  if (card == NULL)
  {
    printf("Invalid file");
    return 1;
  }
  // if the image file (.raw) cannot be opened return a helpful message and exit 1;

  // read image file 512B (1 block) at a time.
  // if has jpg header pattern
  //    close previous file if exists
  //    increase our jpg counter
  //    open new file and write
  // else
  //    if we have an image we're writing to,
  //         write to it
  //    else
  //         continue searching for the next jpg header

  // free any memory
  // close input file
  // close output file

  // save each jpg as ###.jpg starting at 000;
}