#Remove ith element from a string

test = "mynameisram"
new_str= ""

for i in (range(len(test))):
    if i !=2:
        new_str = new_str + test[i]

print (new_str)
