.PHONY: help

help: ##          List all commands
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

docker_build: ##  Build relevant containers from latest images.
	docker-compose build --pull

start: ##         Start localdev monty and relevant containers
	docker-compose up monty

start_nodemon: ## Start monty with nodemon code change monitoring
	docker-compose run monty nodemon -L --watch src --delay 10 --harmony index.js

start_d: ##       Start localdev monty and relevant containers in detached mode
	docker-compose up -d monty	

debug: ##         Start localdev monty with node debugging enabled
	docker-compose stop monty
	docker-compose run --rm -T -p 9229:9229 -p 3000:3000 monty node --harmony --inspect=0.0.0.0:9229 index.js

stop: ##          Attempt to stop all localdev monty containers
	docker-compose stop

down: ##          Attempt to stop and remove monty and relevant containers. Usefull for cleaning things up
	docker-compose down

build: ##         Build monty for dev
	docker-compose run --no-deps -e NODE_ENV=development --rm monty npm run build:dev

build_prod: ##    Build monty with prod assets
	docker-compose run --no-deps -e NODE_ENV=production --rm monty npm run build

install: ##       NPM install dev vendors inside the container
	docker-compose run --no-deps -e NODE_ENV=development --rm monty npm install --no-optional --no-save

install_local: ## NPM install vendors to your local filesystem through the container. Usually you would want this for your IDE to pick things up nicely. Might be rather slow
	docker-compose run --no-deps -e NODE_ENV=development --rm monty_build npm install --no-optional --no-save

server_dev: ##    Start webpack for localdev.
	docker-compose run -T --rm -e SERVER_HOST=monty --name=monty_dev --no-deps -l "traefik.dev.enable=true" -l "traefik.dev.frontend.priority=100" -l "traefik.dev.frontend.rule=PathPrefix:/__webpack_hmr;HostRegexp:local.m.{domain:.+}" -l "traefik.dev.port=8080" -l "traefik.dev.backend=monty_backend_webpack" monty node --harmony build/webpack-dev-server.js

shell: ##         Login into the monty container for some bespoke commands
	docker exec -ti monty sh

run_lint: ##      NPM install dev vendors inside the container
	docker-compose run --no-deps --rm monty npm run lint

run_unit_test: ## NPM install dev vendors inside the container
	docker-compose run --no-deps --rm -e NODE_ENV=development -e CMS_TEST_MODE=true -e WCS_ENVIRONMENT= monty npm run jest:fast
