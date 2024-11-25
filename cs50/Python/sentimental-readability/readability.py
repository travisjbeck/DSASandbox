from cs50 import get_string


#compute the Coleman-Liau index
# L = letters / words * 100
# S = sentences / words * 100
# C1 * L - C2 * S - C3

C1 = 0.0588
C2 = 0.296
C3 = 15.8


def main():

    input = ""

    while (len(input) < 2):
        input = get_string("Text: ")

    letters = countLetters(input)
    words = countWords(input)
    sentences = countSentences(input)


    l = (letters / words)  * 100
    s = (sentences / words) * 100
    index = C1 * l - C2 * s - C3

    if index >= 16:
        print("Grade 16+")
        return

    if index < 1:
        print("Before Grade 1")
        return

    if index > 1:
        print(f"Grade {round(index)}")

def countLetters(input):
    return len([i for i in input if i.isalpha()])


def countWords(input):
    return len(input.strip().split(" "))


# You can consider any sequence of characters that ends with a . or a ! or a ? to be a sentence.
def countSentences(input):
    eos = [".", "!", "?"]
    prev = ""
    sentences = 0
    for c in input:
      if(c in eos and prev and prev not in eos):
          sentences += 1
      prev = c

    return sentences


main()
