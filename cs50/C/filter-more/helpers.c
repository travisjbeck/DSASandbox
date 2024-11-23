#include "helpers.h"
#include <math.h>

// set up our sobel kernels
//------Gx-----
//  -1   0    1
//  -2   0    2
//  -1   0    1

//------Gy-----
// -1  -2   -1
//  0   0    0
//  1   2    1
const int GX[3][3] = {{-1, 0, 1}, {-2, 0, 2}, {-1, 0, 1}};
const int GY[3][3] = {{-1, -2, -1}, {0, 0, 0}, {1, 2, 1}};

RGBTRIPLE get_3x3_average(int height, int width, RGBTRIPLE image[height][width], int row, int col);
int min(int a, int b);
void copy_array(int height, int width, RGBTRIPLE image[height][width],
                RGBTRIPLE copy[height][width]);
int max(int a, int b);
RGBTRIPLE get_edge_value(int height, int width, RGBTRIPLE image[height][width], int row, int col);

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

            double sum = (red + blue + green);
            int avg = round(sum / 3);

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
    RGBTRIPLE copy[height][width];

    // copy the array so we don't average already averaged pixels
    copy_array(height, width, image, copy);

    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            image[i][j] = get_3x3_average(height, width, copy, i, j);
        }
    }

    return;
}

// Detect edges
void edges(int height, int width, RGBTRIPLE image[height][width])
{
    RGBTRIPLE copy[height][width];

    // copy the array so we don't average already averaged pixels
    copy_array(height, width, image, copy);

    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            image[i][j] = get_edge_value(height, width, copy, i, j);
        }
    }

    return;
}

RGBTRIPLE get_3x3_average(int height, int width, RGBTRIPLE image[height][width], int row, int col)
{
    // Blur an image by averaging it with its neighbors

    int prev_row = max(0, row - 1);
    int prev_col = max(0, col - 1);
    int next_row = min(height - 1, row + 1);
    int next_col = min(width - 1, col + 1);

    double sum_blue = 0;
    double sum_green = 0;
    double sum_red = 0;
    double total_values = 0;

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

    sum_blue = round(sum_blue / total_values);
    sum_green = round(sum_green / total_values);
    sum_red = round(sum_red / total_values);
    RGBTRIPLE avg = {sum_blue, sum_green, sum_red};
    return avg;
}

RGBTRIPLE get_sobel_pixel_value(int height, int width, RGBTRIPLE image[height][width], int row, int col)
{
    RGBTRIPLE blk_px = {0, 0, 0};
    if (row < 0 || row >= height)
    {
        return blk_px;
    }
    if (col < 0 || col >= width)
    {
        return blk_px;
    }

    return image[row][col];
}

RGBTRIPLE get_edge_value(int height, int width, RGBTRIPLE image[height][width], int row, int col)

{
    double sum_blue_x = 0;
    double sum_green_x = 0;
    double sum_red_x = 0;

    double sum_blue_y = 0;
    double sum_green_y = 0;
    double sum_red_y = 0;

    int kernel = 0;

    for (int r = row - 1; r <= row + 1; r++)
    {
        for (int c = col - 1; c <= col + 1; c++)
        {

            int offset_c = c - col + 1;
            int offset_r = r - row + 1;

            kernel = GX[offset_r][offset_c];

            RGBTRIPLE pixel = get_sobel_pixel_value(height, width, image, r, c);

            sum_blue_x += pixel.rgbtBlue * kernel;   // * Gx[][]
            sum_green_x += pixel.rgbtGreen * kernel; // * Gx[][]
            sum_red_x += pixel.rgbtRed * kernel;     // * Gx[][]

            kernel = GY[offset_r][offset_c];

            sum_blue_y += pixel.rgbtBlue * kernel;   // * Gy[][]
            sum_green_y += pixel.rgbtGreen * kernel; // * Gy[][]
            sum_red_y += pixel.rgbtRed * kernel;     // * Gy[][]
        }
    }
    // The Sobel filter algorithm combines Gx and Gy into a final value by calculating the square
    // root of Gx^2 + Gy^2 rounded and set to 255 max (F) since we're dealing with hex color values

    double gxy_red = min(255, round(sqrt((pow(sum_red_x, 2) + pow(sum_red_y, 2)))));
    double gxy_blue = min(255, round(sqrt((pow(sum_blue_x, 2) + pow(sum_blue_y, 2)))));
    double gxy_green = min(255, round(sqrt((pow(sum_green_x, 2) + pow(sum_green_y, 2)))));

    RGBTRIPLE edge = {gxy_blue, gxy_green, gxy_red};
    return edge;
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
//
void copy_array(int height, int width, RGBTRIPLE image[height][width],
                RGBTRIPLE copy[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
            copy[i][j] = image[i][j];
    }
}
