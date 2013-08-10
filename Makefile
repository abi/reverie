
.PHONY : default
default:
	DEBUG="*,-connect:*,-express:*,-send" ./node_modules/.bin/nodemon .

.PHONY : update-deps
update-deps:
	npm prune
	npm install
	./node_modules/.bin/bower install

.PHONY : test
test:
	./node_modules/.bin/mocha

deploy:
	npm rebuild