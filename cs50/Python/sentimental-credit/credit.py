from cs50 import get_string

MAX_DIGITS = 16
MIN_DIGITS = 13
VISA = "VISA"
INVALID = "INVALID"
AMEX = "AMEX"
MASTERCARD = "MASTERCARD"

#luhns algorithm for validating credit cards
# list comprehension ftw
def main():
    cardNumber = ""
    cardNumber = get_string("Number: ")
    if not isValidInput(cardNumber):
        print(INVALID)
        return


    # put each digit into a list as an int
    digits = [int(s) for s in cardNumber]

    category = categorizeCard(digits)

    if (category == INVALID):
        print(INVALID)
        return

    multiplyEod(digits)

    total = sum([sumOfDigits(i) for i in digits])
    if total % 10 != 0:
        print(INVALID)
        return

    print(category)




def sumOfDigits(num):
    if (len(str(num)) == 1):
        return num

    return sum([int(i) for i in str(num)])



def multiplyEod(digits):
    # multiply every other digit *2 in place from right to left
    i = len(digits) - 2
    while i >= 0:
        digits[i] = digits[i] * 2
        i -= 2


def categorizeCard(digits):
    length = len(digits)
    if (digits[0] == 4 and (length == 13 or length == 16)):
        return VISA

    if ((digits[1] > 0 and digits[1] < 6) and length == 16):
        return MASTERCARD

    if (digits[0] == 3 and (digits[1] == 4 or digits[1] == 7) and length == 15):
        return AMEX

    return INVALID



def isValidInput(cardNumber):
    if not cardNumber:
        return False

    if not cardNumber.isdigit():
        return False

    length = len(cardNumber)
    if length < MIN_DIGITS or length > MAX_DIGITS:
        return False

    return True


main()
