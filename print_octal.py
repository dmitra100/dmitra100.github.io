def octal_in_range(n):
    for i in range(1, n+1):
        print (i),((oct(i)[1:]) +' '+ (hex(i)[2:]).upper() +' '+ (bin(i)[2:]))
    
octal_in_range(15)
