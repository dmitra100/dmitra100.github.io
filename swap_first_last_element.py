list1 = [12, 12, 10, 12, 13, 25, 9, 10]
first=list1.pop(0)
last=list1.pop(-1)
list1.insert(0, last)
list1.append(first)

print (list1)
