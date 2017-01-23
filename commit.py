import os
import urllib2
import random

os.system("git status")

apiUrl = "https://baconipsum.com/api/?type=all-meat&sentences=1&start-with-lorem=0&format=text"
apiUrl = "http://www.setgetgo.com/randomword/get.php"

words = ['uhh', 'what the..', 'okay', 
		 'help', 'not sure', 'yep', 
		 'k thanks', 'made sense to me', 
		 'well then', 'nope', 'dont ask']

randomWord = urllib2.urlopen(apiUrl).read()
commitWord = random.choice(words)

# Wipe contents
open('test.txt', 'w').close()

with open("test.txt", "a") as myfile:

    myfile.write(randomWord)


os.system("git status")
os.system("git add -A")
os.system("git commit -m " + commitWord)
os.system("git push")

