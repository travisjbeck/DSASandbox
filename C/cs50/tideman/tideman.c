#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <cs50.h>

// Max number of candidates
#define MAX 9

// preferences[i][j] is number of voters who prefer i over j
int preferences[MAX][MAX];

// locked[i][j] means i is locked in over j
bool locked[MAX][MAX];

// Each pair has a winner, loser
typedef struct
{
    int winner;
    int loser;
} pair;

// Array of candidates
string candidates[MAX];
pair pairs[MAX * (MAX - 1) / 2];

int pair_count;
int candidate_count;

// Function prototypes
bool vote(int rank, string name, int ranks[]);
void record_preferences(int ranks[]);
void add_pairs(void);
void sort_pairs(void);
void lock_pairs(void);
void print_winner(void);
bool has_path(int start, int current);
bool column_ulocked(int column);
void print_string(char *s);
void print_locks_table();
void print_preferences();
void print_pairs();

int main(int argc, string argv[])
{
    // Check for invalid usage
    if (argc < 2)
    {
        printf("Usage: tideman [candidate ...]\n");
        return 1;
    }

    // Populate array of candidates
    candidate_count = argc - 1;
    if (candidate_count > MAX)
    {
        printf("Maximum number of candidates is %i\n", MAX);
        return 2;
    }
    for (int i = 0; i < candidate_count; i++)
    {
        candidates[i] = argv[i + 1];
    }

    // Clear graph of locked in pairs & set preferences to zero
    for (int i = 0; i < candidate_count; i++)
    {
        for (int j = 0; j < candidate_count; j++)
        {
            locked[i][j] = false;
            preferences[i][j] = 0;
        }
    }

    pair_count = 0;
    int voter_count = get_int("Number of voters: ");

    // Query for votes
    for (int i = 0; i < voter_count; i++)
    {
        // ranks[i] is voter's ith preference
        int ranks[candidate_count];

        // Query for each rank
        for (int j = 0; j < candidate_count; j++)
        {
            string name = get_string("Rank %i: ", j + 1);

            if (!vote(j, name, ranks))
            {
                printf("Invalid vote.\n");
                return 3;
            }
        }
        record_preferences(ranks);

        printf("\n");
    }

    add_pairs();
    sort_pairs();
    lock_pairs();
    print_winner();
    return 0;
}

// Update ranks given a new vote
bool vote(int rank, string name, int ranks[])
{
    // make sure the candidate exists, then add the ranking
    for (int i = 0; i < candidate_count; i++)
    {
        if (strcmp(name, candidates[i]) == 0)
        {
            // make sure they havent already ranked this candidate
            for (int j = 0; j < rank; j++)
            {
                if (ranks[j] == i)
                {
                    return false; // theyve already ranked this candidate
                }
            }
            ranks[rank] = i; // i is the index of the candidate in the dandidates array
            return true;
        }
    }
    return false;
}

// Update preferences given one voter's ranks
void record_preferences(int ranks[])
{
    // record in preferences[i][j] the number of voters that prefer candidate i over j
    // only iterates to length - 1, never the last one cause it has no pairs
    for (int i = 0; i < candidate_count - 1; i++)
    {
        // record each preference down the line so if 4 options:
        // a->b, a->c, a->d | b->c, b->d| c->d |
        for (int j = i; j < candidate_count - 1; j++)
        {
            preferences[ranks[i]][ranks[j + 1]]++;
        }
    }
    return;
}

// Record pairs of candidates where one is preferred over the other
void add_pairs(void)
{
    // compare each candidate against each other
    // if the value is > 0 they have a vote for i over j,
    // dont think we need to worry about candidate[n][n] checks they should all be zero since we're
    // enforcing unique rankings
    pair_count = 0;
    for (int i = 0; i < candidate_count; i++)
    {
        for (int j = 0; j < candidate_count; j++)
        {

            // see how many people preferred candidate i over j compared to j over i.
            if (preferences[i][j] > preferences[j][i])
            {
                // i is our winner, lets add the pair
                pairs[pair_count].winner = i;
                pairs[pair_count].loser = j;
                pair_count++;
            }
        }
    }
    return;
}

// Sort pairs in decreasing order by strength of victory
void sort_pairs(void)
{

    int right = pair_count - 1;
    pair *p1;
    pair *p2;
    while (right > 0)
    {
        for (int i = 0; i < right; i++)
        {
            p1 = &pairs[i];
            p2 = &pairs[i + 1];
            // strength of victory is preferences[p->winner][p->loser] minus its invers:
            // ([p->l][p->w])
            int cur_str = preferences[p1->winner][p1->loser] - preferences[p1->loser][p1->winner];
            int nex_str = preferences[p2->winner][p2->loser] - preferences[p2->loser][p2->winner];
            if (nex_str > cur_str)
            {
                // swap them
                pair temp = pairs[i];
                pairs[i] = pairs[i + 1];
                pairs[i + 1] = temp;
            }
        }
        right--;
    }
    return;
}

// Lock pairs into the candidate graph in order, without creating cycles
void lock_pairs(void)
{
    // for each pairs in our sorted pairs array
    // set locked[p.winner][p.loser] to 1 UNLESS it creates a cycle
    // a cycle is when... you can follow a locked path back to the item
    //  set locked[w][l] == 1 unless has_path(l, w);
    for (int i = 0; i < pair_count; i++)
    {
        pair p = pairs[i];
        if (!has_path(p.winner, p.loser))
        {
            locked[p.winner][p.loser] = true;
        }
    }

    return;
}

bool has_path(int start, int current)
{
    // recursively check if there is a path from start to current
    if (current == start)
    {
        return true;
    }

    for (int i = 0; i < candidate_count; i++)
    {
        if (locked[current][i])
        {
            // follow the path
            if (has_path(start, i))
            {
                return true;
            }
        }
    }

    return false;
}

// Print the winner of the election
void print_winner(void)
{

    // the winner has a fully unlocked column
    // so locked[n-length][candidate] all equals false
    for (int i = 0; i < candidate_count; i++)
    {
        if (column_ulocked(i))
        {
            char *candidate = candidates[i];
            print_string(candidate);
            printf("\n");
            return;
        }
    }
    return;
}

bool column_ulocked(int column)
{
    for (int i = 0; i < candidate_count; i++)
    {
        if (locked[i][column] == true)
        {
            return false;
        }
    }
    return true;
}

void print_preferences()
{
    printf("\nPREFERENCES: \n");
    for (int i = 0; i < candidate_count; i++)
    {
        print_string(candidates[i]);
        printf(" ");
    }
    printf("\n");

    for (int i = 0; i < candidate_count; i++)
    {
        for (int j = 0; j < candidate_count; j++)
        {
            printf("%i ", preferences[i][j]);
        }
        printf("\n");
    }
    printf("\n");
}
void print_locks_table()
{

    printf("\nLOCKED: \n");
    for (int i = 0; i < candidate_count; i++)
    {
        print_string(candidates[i]);
        printf(" ");
    }
    printf("\n");

    for (int i = 0; i < candidate_count; i++)
    {
        for (int j = 0; j < candidate_count; j++)
        {
            printf("%i ", locked[i][j]);
        }
        printf("\n");
    }
    printf("\n");
}

void print_pairs()
{
    printf("\nPAIRS: \n |");
    for (int i = 0; i < pair_count; i++)
    {
        pair p = pairs[i];
        printf("w->%i : l->%i |", p.winner, p.loser);
    }
    printf("\n");
}

void print_string(char *s)
{
    int length = strlen(s);
    for (int i = 0; i < length; i++)
    {
        printf("%c", s[i]);
    }
}
