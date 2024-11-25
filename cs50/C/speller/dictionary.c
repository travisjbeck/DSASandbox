// Implements a dictionary's functionality
#include "dictionary.h"
#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>

double words = 0;

// Represents a node in a hash table
typedef struct node
{
    char word[LENGTH + 1]; // an array of chars sized for the longest possible word
    struct node *next;     // pointer to the next node
} node;

(bool)insert(char *word);
void prepare_table(node **tbl);

const unsigned int N = 26 * 1000;

// Hash table
node *table[N];

// Returns true if word is in dictionary, else false
bool check(const char *word)
{
    unsigned int index = hash(word);
    for (node *cursor = table[index]; cursor != NULL; cursor = cursor->next)
    {
        if (strcasecmp(cursor->word, word) == 0)
        {
            return true;
        }
    }
    return false;
}

// Hashes word to a number
unsigned int hash(const char *word)
{
    unsigned int hash_value = 0;
    for (int i = 0; word[i] != '\0'; i++)
    {
        hash_value += toupper(word[i]);
    }
    return hash_value % N;
}

// Loads dictionary into memory, returning true if successful, else false
bool load(const char *dictionary)
{
    // dictionary is the name of a file we must read in
    // no word is longer than LENGTH
    // one word per line. each line ends in "\n"
    // hash the word.
    // insert word into trie
    // iterate a global variable on each word insertion
    prepare_table(table);

    FILE *file = fopen(dictionary, "r");

    if (file == NULL)
    {
        printf("Could not open %s.\n", dictionary);
        return false;
    }
    char word[LENGTH + 1]; // include the '\0'

    int index = 0;
    char c;
    while (fread(&c, sizeof(char), 1, file))
    {
        // Allow only alphabetical characters
        // Allow only alphabetical characters and apostrophes
        if (isalpha(c) || (c == '\'' && index > 0))
        {
            // Append character to word
            word[index] = c;
            index++;
        }
        else if (index > 0)
        {
            // We must have found a whole word
            // Terminate current word
            word[index] = '\0';

            // insert word into trie
            if (!insert(word))
            {
                fclose(file);
                printf("Error reading %s.\n", dictionary);
                return false;
            }
            // Update counter
            words++;

            // Prepare for next word
            index = 0;
        }
    }

    // Check whether there was an error
    if (ferror(file))
    {
        fclose(file);
        printf("Error reading %s.\n", dictionary);
        return false;
    }

    // Close text
    fclose(file);
    return true;
}

void prepare_table(node **tbl)
{
    // fill with nodes with null pointers
    for (int i = 0; i < N; i++)
    {
        tbl[i] = NULL;
    }
}

bool insert(char *word)
{
    unsigned int index = hash(word);
    node *new_node = malloc(sizeof(node));
    if (new_node == NULL)
    {
        return false;
    }
    strcpy(new_node->word, word);
    new_node->next = table[index];
    table[index] = new_node;
    return true;
}

// Returns number of words in dictionary if loaded, else 0 if not yet loaded
unsigned int size(void)
{
    return words;
}

// Unloads dictionary from memory, returning true if successful, else false
bool unload(void)
{
    for (int i = 0; i < N; i++)
    {
        node *cursor = table[i];
        while (cursor != NULL)
        {
            node *temp = cursor;
            cursor = cursor->next;
            free(temp);
        }
    }
    return true;
}
