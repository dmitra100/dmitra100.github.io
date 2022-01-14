# Write a program to read in the data files from disk, it must then print the names of only the bipedal dinosaurs from fastest to slowest

import csv
import math


dict1 ={}

with open ("dataset2.csv", "r" ) as csvfile:
    dino = csv.reader(csvfile)
    for line in dino:
        NAME, STRIDE, STANCE= line
        print (NAME)
        if line[2] == "bipedal":
            dict1[NAME] = float(STRIDE)
print (sorted(dict1.items(), key=lambda x:x[1]))    
