# Python3 program to sort an array of
# numbers in range from 1 to n.

def sortarr(arr, n):
    for i in range(n):
        arr[i] =i+1

# Driver code
if __name__=='__main__':
    arr = [10, 7, 9, 2, 8, 3, 5, 4, 6, 1 ]
    n = len(arr)
    sortarr(arr,n)
    for i in range(n):
        print (arr[i]),

