import csv

makes = []
with open ('free.csv', 'rb') as csvfile:
    parse = csv.reader(csvfile)
    for i in parse:
        print (i)
