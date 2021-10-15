num = int(input())
def is_prime(num):
    if num <=0:
        return "Not Prime"
    else:
        return "Prime"
       
    for i in range (2, num):
        if num % i ==0:
           return "Not Prime"
    return "Prime"
print (is_prime(num))
