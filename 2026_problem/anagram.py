# Problem: Valid Anagram
# Given two strings s1 and s2, determine whether s2 is an anagram of s1
# (i.e. both strings contain exactly the same characters with the same
# frequencies, just possibly in a different order).
# ─────────────────────────────────────────
# Solved by: sorting both strings and comparing the results — if the
# sorted character sequences match, the strings are anagrams of each other.
# Time: O(n log n)  Space: O(n)

def anagram(s1, s2):
    if sorted(s1) == sorted(s2):
        return True
    else:
        return False
