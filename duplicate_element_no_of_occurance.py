#print the number of occurrences of only the duplicate elements?
#12 -> 3
#10 -> 2

test_list = [12, 12, 10, 12, 13, 25, 9, 10]

freq = {}

for i in test_list:
    if i in freq:
        freq[i] +=1
    else:
        freq[i] = 1
print (freq)
