
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


.PHONY : deploy
deploy:
	ssh abi@66.175.221.170 -p 33333 make -f /home/abi/reverie deploy-local

.PHONY : deploy-local
deploy-local:
	git pull
	npm rebuild
	sudo supervisorctl reload && sleep 3 && sudo supervisorctl restart all