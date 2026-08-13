# Problem: Reverse a String
# ─────────────────────────────────────────

# Method A — slicing — fastest, most Pythonic
def reverse_a(s):
    return s[::-1]

# Method B — reversed() — readable, clean
def reverse_b(s):
    return "".join(reversed(s))

# Method C — loop — shows understanding
def reverse_c(s):
    result = ""
    for char in s:
        result = char + result
    return result
