#RearrangeString

s = raw_input()

a =str()
n =0

for i in s:
    if i.isdigit():
        n+=int(i)
    else:
        a+=i
print ''.join(sorted(a))+str(n)
        
