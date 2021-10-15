#Remove all duplicates words from a given sentence
test= 'Python is great and Java is also great'
new_str= []

l = test.split(" ")
for i in l:
    if i not in new_str:
        new_str.append(i)

print (" ".join(new_str))
