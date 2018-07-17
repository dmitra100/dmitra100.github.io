#!/usr/bin/env python
# Find CPU idle and utilization time every 15 min from the system from a log file.


with open ('cpu_log.txt', 'r') as f: 
    data= f.readlines()

k = data[1:] # Remove the first line
for i in k:
   out = i.split() 
   s=([i.strip('%') for i in out])
   m=100 - int(s[1])
   s[1]= str(m)+ '%'
   print 'CPU idle %', out
   print 'CPU Utilization % : ', s
         
      






