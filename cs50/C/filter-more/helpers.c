#include "helpers.h"

RGBTRIPLE get_3x3_average(int height, int width, RGBTRIPLE image[height][width], int row, int col);
int min(int a, int b);
void copy_array(int height, int width, RGBTRIPLE image[height][width],
                RGBTRIPLE copy[height][width]);
int max(int a, int b);

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])
{
    // set RGB to the average of R,G,B
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            int red = image[i][j].rgbtRed;
            int green = image[i][j].rgbtGreen;
            int blue = image[i][j].rgbtBlue;

            int avg = (blue + red + green) / 3;

            image[i][j].rgbtRed = avg;
            image[i][j].rgbtGreen = avg;
            image[i][j].rgbtBlue = avg;
        }
    }
    return;
}

// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width])
{
    // row[length -1] = row[i];
    RGBTRIPLE buf = {0, 0, 0};
    for (int i = 0; i < height; i++)
    {
        int left = 0;
        int right = width - 1;
        while (right > left)
        {
            // swap them
            buf = image[i][left];
            image[i][left] = image[i][right];
            image[i][right] = buf;
            left++;
            right--;
        }
    }
    return;
}

// Blur image
void blur(int height, int width, RGBTRIPLE image[height][width])
{

    // RBGTRIPLE avg = get_3x3_average(height, width, &image, row, col);
    return;
}

// Detect edges
void edges(int height, int width, RGBTRIPLE image[height][width])
{
    return;
}

RGBTRIPLE get_3x3_average(int height, int width, RGBTRIPLE image[height][width], int row, int col)
{
    // how to get neighbors?

    //   [row-1][col-1]              [row-1][col]            [row-1][col +1]
    //      topLeft                    top                      topRight
    //
    //   [row][col-1]                                          [row][col +1]
    //      left                       self                        right
    //
    //  [row + 1][col - 1]         [row +1][col]            [row +1][col +1]
    //    bottomLeft                  bottom                 bottomRight
    int prev_row = max(0, row - 1);
    int prev_col = max(0, col - 1);
    int next_row = min(height - 1, row + 1);
    int next_col = min(width - 1, col + 1);

    int sum_blue = 0;
    int sum_green = 0;
    int sum_red = 0;
    int total_values = 0;

    for (int r = prev_row; r <= next_row; r++)
    {
        for (int c = prev_col; c <= next_col; c++)
        {
            sum_blue += image[r][c].rgbtBlue;
            sum_green += image[r][c].rgbtGreen;
            sum_red += image[r][c].rgbtRed;
            total_values += 1;
        }
    }

    sum_blue = sum_blue / total_values;
    sum_green = sum_green / total_values;
    sum_red = sum_red / total_values;
    RGBTRIPLE avg = {sum_blue, sum_green, sum_red};
    return avg;
}

int max(int a, int b)
{
    if (a > b)
    {
        return a;
    }
    return b;
}

int min(int a, int b)
{
    if (a < b)
    {
        return a;
    }
    return b;
}

void copy_array(int height, int width, RGBTRIPLE image[height][width],
                RGBTRIPLE copy[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
            copy[i][j] = image[i][j];
    }
}
