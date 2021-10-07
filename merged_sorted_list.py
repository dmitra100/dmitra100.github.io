
list1=[12, 12, 10, 12, 13, 25, 9, 10]

list2=[50, 51, 71, 72,73, 74]

def merge(list1, list2):
    new_list = list1 + list2
    new_list.sort()
    return new_list

print (merge(list1, list2))


