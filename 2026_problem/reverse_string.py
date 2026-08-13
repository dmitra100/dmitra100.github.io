# Problem: Reverse a String
# ─────────────────────────────────────────

# Method A — slicing
def reverse_a(s):
    return s[::-1]

# Method B — reversed()
def reverse_b(s):
    return "".join(reversed(s))

# Method C — loop
def reverse_c(s):
    result = ""
    for char in s:
        result = char + result
    return result
