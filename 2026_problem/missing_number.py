# Problem: Missing Number
# Given list of n distinct numbers from 0 to n
# Find the one missing number
# ─────────────────────────────────────────

# Approach A — Math (preferred)
# Time: O(n)  Space: O(1)

def missing_number_math(nums):
    n = len(nums)
    return n * (n + 1) // 2 - sum(nums)


# Approach B — Set lookup
# Time: O(n)  Space: O(n)

def missing_number_set(nums):
    seen = set(nums)
    for i in range(len(nums) + 1):  # 0 to n
        if i not in seen:
            return i
