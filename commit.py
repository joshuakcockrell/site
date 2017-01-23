import os
import urllib2
import random
import time

apiUrl = "https://baconipsum.com/api/?type=all-meat&sentences=1&start-with-lorem=0&format=text"
apiUrl = "http://www.setgetgo.com/randomword/get.php"

words = ['uhh', 'what the..', 'okay', 
		 'help', 'not sure', 'yep', 
		 'k thanks', 'made sense to me', 
		 'well then', 'nope', 'dont ask',
		 'changed somethingggg', 'yeah',
		 'my site is lit', 'too lit to quit',
		 'all I do is bleh', 'dont look at me']


def run():
	# Get random words
	randomWord = urllib2.urlopen(apiUrl).read()
	commitWord = random.choice(words)

	print randomWord
	print commitWord

	# Wipe contents of file
	open('test.txt', 'w').close()

	# Write to file
	with open("test.txt", "a") as myfile:
	    myfile.write(randomWord)

	# Commit
	# os.system("git status")
	os.system("git add -A")
	os.system("git commit -m " + commitWord)
	os.system("git push")



while True:
	run()
	time.sleep(5)