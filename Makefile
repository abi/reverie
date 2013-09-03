APP_DIR = /home/abi/reverie
SERVER_IP = 66.175.221.170

.PHONY : default
default: tunnel
	DEBUG="*,-connect:*,-express:*,-send" ./node_modules/.bin/nodemon .

.PHONY : update-deps
update-deps:
	npm prune
	npm install
	./node_modules/.bin/bower install

.PHONY : tunnel
tunnel:
	ssh -L 27017:localhost:27017 -N abi@$(SERVER_IP) -p 33333 &

.PHONY : test
test:
	./node_modules/.bin/mocha

.PHONY : rebuild
rebuild:
	npm rebuild

.PHONY : deploy
deploy:
	ssh abi@66.175.221.170 -p 33333 make -f $(APP_DIR)/Makefile deploy-local

.PHONY : deploy-local
deploy-local:
	cd $(APP_DIR) && git pull
	sudo supervisorctl reload && sleep 3 && sudo supervisorctl restart all