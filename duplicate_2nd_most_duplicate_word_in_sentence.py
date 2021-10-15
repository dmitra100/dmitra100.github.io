#Remove all duplicates words from a given sentence
#test= 'Python is great and Java is also great'
new_str= {}

l = ['ddd','aaa', 'bbb', 'ccc', 'bbb', 'aaa', 'aaa', 'ddd', 'eee', 'ddd']

for i in l:
    if i in new_str:
        new_str[i] +=1
    else:
        new_str[i] = 1
    
print ("new_str", new_str)
value = max(sorted(new_str.values(), reverse= True))
#secondlarge = value [1]
print (value)

#print (max(new_str.values))

