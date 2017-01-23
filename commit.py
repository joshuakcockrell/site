import os
import urllib2
import random
import time

apiUrl = 'https://baconipsum.com/api/?type=all-meat&sentences=1&start-with-lorem=0&format=text'
apiUrl = 'http://www.setgetgo.com/randomword/get.php'

words = ['uhh', 'what the..', 'okay', 
		 'help', 'not sure', 'yep', 
		 'k thanks', 'made sense to me', 
		 'well then', 'nope', 'dont ask',
		 'changed somethingggg', 'yeah',
		 'my site is lit', 'too lit to quit',
		 'all I do is bleh', 'dont look at me',
		 'not sure what this is', 'uhhh', 'uhhhh',
		 'my site is legit', 'good', 'ohh', 'hi',
		 'k', 'stuff']


def run():
	# Get random words
	randomWord = urllib2.urlopen(apiUrl).read()
	commitWord = random.choice(words)

	print randomWord
	print commitWord

	# Wipe contents of file
	open('test.txt', 'w').close()

	# Write to file
	with open('test.txt', 'a') as myfile:
	    myfile.write(randomWord)

	# Commit
	# os.system('git status')
	os.system('git add -A')
	time.sleep(1)
	os.system('git commit -m ' + commitWord)
	time.sleep(5)
	os.system('git push')

print 'Running scheduler..'
while True:
	print ''
	print 'Ran at: ' + time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
	run()
	wait = 60 * 60 * 24 * random.uniform(0.5, 2)
	print 'Seconds till next run: ' + str(wait)
	time.sleep(wait)



