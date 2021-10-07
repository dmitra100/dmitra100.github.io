test_list = [12, 12, 10, 12, 13, 25, 9, 10]
new_list = []
for i in test_list:
    if i not in new_list:
        new_list.append(i)
        new_list.sort(reverse = True)

print (new_list)
       
