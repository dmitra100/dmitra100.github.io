#!/usr/bin/env python

total_sum= 0

num = input("Enter required no of inputs to find the sum: ")
elapsed_input = num - 1
for i in range(num):

    s = float(input("Enter a num for addition: "))

    total_sum = total_sum + s
    e = elapsed_input - i #No of values yet to be entered
    print "Num of inputs pending", e

avg = total_sum/num 

print 'Avg of all the numbers: ', avg
