import os
import urllib2
import random
import time
from datetime import datetime
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
'k', 'stuff', 'yessir', 'this is a commit',
'merge', 'merge some stuff', 'merged yep', 
'I should know what this is', 'here ya go',
'is umm yeah', 'Added profile image', 'Updated pic', 
'Updated thumbnail image', 'Added backup image', 
'Update meta', 'Update particle_demo.js', 
'Updated css', 'Update CNAME', 
'Updated site colors and footer', 
'Added link to projects', 'Updated resume', 
'Fixed broken link', 'Smaller diamond', 
'Removed a bunch of junk files', 'update album info', 
'add song link', 'update spotify', 'media player', 
'soundcloud', 'linkedin', 'broken player', 
'followers link', 'profile pic', 'profile', 
'assets folder', 'assets changes', 'changed assets',
'work on static files', 'update static files', 
'remove static files', 'Update meta',
'Updated meta tags',
'Updated pic',
'Word',
'Updated resume',
'Updated pic again',
'Updated thumbnail image',
'Added backup image',
'Added text file',
'Added mobile touch event',
'Updated link styles on mobile',
'fixed spelling',
'Updated description',
'Changed name.. again',
'Added video',
'Updated to auto images',
'Updated shed image',
'Uploaded generator image',
'Updated responsive text size',
'Changed name font',
'Added small versions of images',
'Added sql specs',
'Oh hi. My site looks like garbage',
'Undo that ish',
'Add what the',
'Added extra fonts',
'Compressed a bunch of images',
'Edit',
'Test image size',
'changed to jpg',
'Remove index from link',
'Looks good on mobile',
'Changed image size for Open Graph',
'Changed description',
'MS Recommendation',
'Cleaned up old book scroll code',
'Added books',
'Hot dang',
'Changes to box fade',
'Linked resume to all pages',
'25000 particles',
'Optimizations to animate boxes',
'Background color adjustment',
'No bounds',
'soundcloud link',
'Added some hot animations',
'web and music sections',
'Modified the landing page image']














def run():

	try:
		# Wait 30 seconds to wait for network to connect
		time.sleep(30)

		print ''
		print ''
		print 'Ran at: ' + time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())

		# Get random words
		# randomWord = urllib2.urlopen(apiUrl).read()
		commitWord = random.choice(words)

		# Wipe contents of file
		open('test.txt', 'w').close()

		# Write to file
		with open('test.txt', 'a') as myfile:
		    myfile.write(commitWord)

		# Commit
		print '$ git status -s'
		os.system('git status -s')
		time.sleep(4)
		print '$ git add -A'
		os.system('git add -A')
		time.sleep(4)
		print '$ git commit -m ' + commitWord
		os.system('git commit -m \"' + commitWord + "\"")
		time.sleep(4)
		print '$ git status -s'
		os.system('git status -s')
		time.sleep(4)
		print '$ git push'
		os.system('git push')
		time.sleep(4)
		print '$ git status -s'
		os.system('git status -s')

	except:
		print("Unexpected error:", sys.exc_info()[0])
		time.sleep(10)

		# Try again
		run()

secInDay = 60 * 60 * 24

def sleepLoop(startTime, waitSeconds):

	while True:

		curTime = datetime.now()
		diff = curTime - startTime
		remainingSeconds = waitSeconds - diff.seconds

		print("Days till next commit: " + str(remainingSeconds / secInDay)[:7])

		# Print in place
		sys.stdout.write("\033[F") # Cursor up one line
		sys.stdout.write("\033[K") # Clear to the end of line

		# Wait 1 second
		time.sleep(1)

		if remainingSeconds < 0:
			return


print 'Starting scheduler..'
while True:
	run()

	waitSeconds = secInDay * random.uniform(0.1, 0.4) # Time range
	# waitSeconds = secInDay * random.uniform(0.0001, 0.0005)

	# Wait for a certain amount of time
	sleepLoop(datetime.now(), waitSeconds)



