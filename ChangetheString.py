#Given a string S, the task is to change the complete string to Uppercase or Lowercase depending upon the case for the first character.

s = raw_input("enter the word :")

l = list(s)
print (l)

if l[0].isupper():
    print (s.upper())
else:
    print (s.lower())

    


