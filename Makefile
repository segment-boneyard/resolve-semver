
test: node_modules
	@node_modules/.bin/mocha

node_modules:
	@npm install
	@touch node_modules