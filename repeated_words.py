from collections import Counter
test= 'Python is great and Java is also great'
l = test.split(" ")
k=(Counter(l))
for key, value in k.items():
    if value > 1:
        print (key)
#print (" ".join(new_str))
