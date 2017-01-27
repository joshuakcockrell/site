import os
import urllib2
import random
import time
import sys

apiUrl = 'http://www.setgetgo.com/randomword/get.php'

words = ['uhh', 'what the..', 'okay', 'hi there'
		 'help', 'not sure', 'yep', 'commit ish'
		 'k thanks', 'made sense to me', 'some code'
		 'well then', 'nope', 'dont ask', 'brand new beretta'
		 'changed somethingggg', 'yeah', 'codecodecodehelp'
		 'my site is lit', 'too lit to quit',
		 'all I do is bleh', 'dont look at me',
		 'not sure what this is', 'uhhh', 'uhhhh',
		 'my site is legit', 'good', 'ohh', 'hi',
		 'k', 'stuff', 'yessir', 'this is a commit',]


def run():

	print ''
	print 'Ran at: ' + time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())

	# Get random words
	randomWord = urllib2.urlopen(apiUrl).read()
	commitWord = random.choice(words)

	# Wipe contents of file
	open('test.txt', 'w').close()

	# Write to file
	with open('test.txt', 'a') as myfile:
	    myfile.write(randomWord)

	# Commit
	os.system('git status')
	time.sleep(2)
	os.system('git add -A')
	time.sleep(2)
	os.system('git commit -m ' + commitWord)
	time.sleep(5)
	os.system('git push')

secInDay = 60 * 60 * 24

def sleepLoop(waitSeconds):

	while True:

		print("Days till next commit: " + str(waitSeconds / secInDay)[:7])
		sys.stdout.write("\033[F") # Cursor up one line
		sys.stdout.write("\033[K") # Clear to the end of line
		time.sleep(1)

		waitSeconds -= 1
		if waitSeconds < 0:
			return


print 'Starting scheduler..'
while True:
	run()
	waitSeconds = secInDay * random.uniform(0.2, 0.7)

	sleepLoop(waitSeconds)



