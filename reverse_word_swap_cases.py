def reverse_words_order_and_swap_cases(sentence):
    # Write your code here
    # Convert string to list
    test_split =  sentence.split()
    # Reverse list
    test1= test_split[::-1]
    # Convert list to string
    test2=" ".join(test1)
    # swap string
    return test2.swapcase()
sentence= "awesome is coding"
print (reverse_words_order_and_swap_cases(sentence))
