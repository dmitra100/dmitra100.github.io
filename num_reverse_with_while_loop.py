#!/usr/bin/env python3



reverse = 0

value = input ('Enter a positive integer: ')

while value> 0:
    
         
    reminder = value % 10

    reverse  = reverse*10 + reminder

    value //=10

print "Reverse of the num: ", reverse



