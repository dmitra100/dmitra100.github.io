#Given an array of integers, where all elements but one occur twice, find the unique element.
#!/bin/python3

import math
import os
import random
import re
import sys

def lonelyinteger(a):
    b= {}
    l=[]
    for i in a:
        if i in b:
            b[i]+=1
        else:
            b[i]=1
    for key, value in b.items():
        if value ==1:
            return key 
               

if __name__ == '__main__':
    fptr = open(os.environ['OUTPUT_PATH'], 'w')

    n = int(input().strip())

    a = list(map(int, input().rstrip().split()))

    result = lonelyinteger(a)

    fptr.write(str(result) + '\n')

    fptr.close()
