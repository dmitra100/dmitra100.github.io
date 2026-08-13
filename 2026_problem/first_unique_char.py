# Problem: First Unique Character in a String
# Given a string s, return the index of the first non-repeating
# character. If every character repeats, return -1.
# ─────────────────────────────────────────
# Solved by: counting character frequencies with Counter, then scanning
# the string in order and returning the index of the first char whose
# count is 1.
# Time: O(n)  Space: O(n)

from collections import Counter

def first_unique(s):
    counts = Counter(s)
    for i, char in enumerate(s):
        if counts[char] == 1:
            return i
    return -1

# s = "leetcode"      -> 0  ('l' at index 0 appears once)
# s = "loveleetcode"  -> 2  ('v' at index 2 appears once)
# s = "aabb"          -> -1 (all chars repeat)
