#Palindrom no within a range of numbers

num=int(input("Enter a num"))
temp=num
rev=0
pal= []
for i in range(11,num+1):
    while(num>0):
        rem=num%10
        rev=rev*10+rem
        num=num//10
    if rev==temp:
       pal.append(i)

print (pal)
