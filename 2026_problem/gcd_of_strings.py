# Problem: GCD of Strings
# Given two strings str1 and str2, return the largest string x
# such that x divides both str1 and str2 (i.e. str1 and str2 are
# each made up of one or more concatenations of x).
# ─────────────────────────────────────────
# Time: O((len(str1) + len(str2)) * min(len(str1), len(str2)))
# Space: O(min(len(str1), len(str2)))

def divides(x, s):
    if len(s) % len(x) != 0:
        return False
    return x * (len(s) // len(x)) == s

def gcdOfStrings(str1, str2):
    # shorter string gives us all candidates
    shorter = str1 if len(str1) <= len(str2) else str2

    # try longest prefix first — return first that works
    for length in range(len(shorter), 0, -1):
        candidate = shorter[:length]
        if divides(candidate, str1) and divides(candidate, str2):
            return candidate

    return ""
