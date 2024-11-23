#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

const int BLOCK_SIZE = 512; // bytes

typedef struct
{
  unsigned char first_three[3];
  unsigned char last_byte_options[16];
} HEADER_BYTES;

HEADER_BYTES header = {{0xff, 0xd8, 0xff},
                       {0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb,
                        0xec, 0xed, 0xee, 0xef}};

bool is_new_jpg_header(uint8_t buffer[BLOCK_SIZE]);

int main(int argc, char *argv[])
{

  // takes exactly one command line argument (name of the image file (*.raw)) return helpful error
  // and exit 1 if not
  if (argc != 2)
  {
    printf("Usage: ./recover FILE\n");
    return 1;
  }

  // open the memory card
  char *infile = argv[1];
  FILE *card = fopen(argv[1], "r");
  if (card == NULL)
  {
    printf("Invalid file: %s", infile);
    return 1;
  }

  uint8_t buffer[BLOCK_SIZE];
  int file_index = 0;
  char filename[8];
  FILE *out = NULL;
  // read the card 1 block at a time searching for and saving jpgs
  while (fread(buffer, 1, BLOCK_SIZE, card) == BLOCK_SIZE)
  {
    if (is_new_jpg_header(buffer))
    {
      // close out our old file and start a new one
      if (out)
      {
        fclose(out);
      }
      // create our new jpg file
      sprintf(filename, "%03i.jpg", file_index);
      out = fopen(filename, "w");
      if (out == NULL)
      {
        fclose(card);
        printf("Could not open file.\n");
        return 1;
      }
      file_index++;
    }

    if (out)
    {
      fwrite(&buffer, BLOCK_SIZE, 1, out);
    }
  }
  fclose(card);
  if (out)
  {

    fclose(out);
  }
}

bool is_new_jpg_header(uint8_t buffer[BLOCK_SIZE])
{
  if (buffer[0] == header.first_three[0] && buffer[1] == header.first_three[1] &&
      buffer[2] == header.first_three[2])
  {
    // Check if buffer[3] is one of the valid options
    for (int i = 0; i < 16; i++)
    {
      if (buffer[3] == header.last_byte_options[i])
      {
        // It's a JPEG header
        return true;
      }
    }
  }
  return false;
}
