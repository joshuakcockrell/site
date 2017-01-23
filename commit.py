import os
import urllib2

os.system("git status")

apiUrl = "https://baconipsum.com/api/?type=all-meat&sentences=1&start-with-lorem=0&format=text"
apiUrl = "http://www.setgetgo.com/randomword/get.php"

randomWord = urllib2.urlopen(apiUrl).read()
commitWord = urllib2.urlopen(apiUrl).read()

# Wipe contents
open('test.txt', 'w').close()

with open("test.txt", "a") as myfile:

    myfile.write(randomWord)


os.system("git status")
os.system("git add -A")
os.system("git commit -m " + commitWord)
os.system("git push")

