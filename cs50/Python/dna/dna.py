import csv
import sys


def main():

    # Check for command-line usage
    if len(sys.argv) < 3:
        print("Usage dna.py [db file] [sequence file]")
        return

    dbName = sys.argv[1]
    sequenceName = sys.argv[2]

    strs = []  # list of STRS ['AGATC', 'AATG', ...]
    # list of dictionaries [{'name': 'Alice', 'AGATC': '2', 'AATG': '8', 'TATC': '3'}, ...]
    people = []
    sequence = ""

    # Read database file into a variable
    with open(dbName) as file:
        reader = csv.DictReader(file)
        # skip the name field and just get the strs
        strs = [field for field in reader.fieldnames[1:]]
        people = [row for row in reader]

    # Read DNA sequence file into a variable
    with open(sequenceName) as file:
        sequence = file.read()

    # Find longest match of each STR in DNA sequence
    longestMatches = {}
    for s in strs:
        longestMatches[s] = longest_match(sequence, s)

    # Check database for matching profiles
    for person in people:
        found = True
        for s in strs:
            if (int(person[s]) != longestMatches[s]):
                found = False

        if found:
            print(person["name"])
            return

    print("No match")


def longest_match(sequence, subsequence):
    """Returns length of longest run of subsequence in sequence."""

    # Initialize variables
    longest_run = 0
    subsequence_length = len(subsequence)
    sequence_length = len(sequence)

    # Check each character in sequence for most consecutive runs of subsequence
    for i in range(sequence_length):

        # Initialize count of consecutive runs
        count = 0

        # Check for a subsequence match in a "substring" (a subset of characters) within sequence
        # If a match, move substring to next potential match in sequence
        # Continue moving substring and checking for matches until out of consecutive matches
        while True:

            # Adjust substring start and end
            start = i + count * subsequence_length
            end = start + subsequence_length

            # If there is a match in the substring
            if sequence[start:end] == subsequence:
                count += 1

            # If there is no match in the substring
            else:
                break

        # Update most consecutive matches found
        longest_run = max(longest_run, count)

    # After checking for runs at each character in seqeuence, return longest run found
    return longest_run


main()
