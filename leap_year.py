#!/usr/bin/env python
# Program to find leap year
# Logic year should be divided by 4, 400 and year which are divisible by 100 is not leap year.
#1800, 1900, 2100, 2200, 2300 and 2500 are NOT leap years

def is_leap(year):
    if year % 400 ==0:
        return True
    if year % 100 == 0:
        return False
    if year % 4==0:
        return True
    else:
        return False
year = int(raw_input("Enter a year to find leap year:"))
print is_leap(year)
