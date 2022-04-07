# which service (from docker-compose.yml:services) to run commands agains
SERVICE ?=

EXEC_ARGS ?=
RUN_ARGS ?=
BUILD_ARGS ?=
TEST_ARGS ?=

COMPOSE_FILE_ARGS ?= -f docker/docker-compose.yml

DOCKER_COMPOSE_LOCAL = docker/docker-compose.local.yml
ifeq ($(shell test -f $(DOCKER_COMPOSE_LOCAL) && echo yes),yes)
COMPOSE_FILE_ARGS := -f docker/docker-compose.local.yml
endif

DOCKER_COMPOSE = docker-compose $(COMPOSE_FILE_ARGS)

run:
	$(DOCKER_COMPOSE) up -d $(RUN_ARGS)

logs:
	$(DOCKER_COMPOSE) logs --tail=100 -f

build:
	$(DOCKER_COMPOSE) up -d --build --force-recreate

stop:
	$(DOCKER_COMPOSE) stop

restart:
	$(DOCKER_COMPOSE) restart $(SERVICE)

clean:
	- $(DOCKER_COMPOSE) down

exec: run
	$(DOCKER_COMPOSE) exec $(SERVICE) $(EXEC_ARGS)

backend: run
	$(DOCKER_COMPOSE) exec php bash

frontend: run
	$(DOCKER_COMPOSE) exec frontend bash

ps:
	$(DOCKER_COMPOSE) ps

composer-install: run
	$(DOCKER_COMPOSE) exec -T php composer install

install: run
	$(DOCKER_COMPOSE) exec -T php phing setup
	$(DOCKER_COMPOSE) exec -T php bin/console cache:clear
	$(DOCKER_COMPOSE) exec -T php chown -R www-data:www-data var/

cache-clear: run
	$(DOCKER_COMPOSE) exec -T php bin/console cache:clear
	$(DOCKER_COMPOSE) exec -T php chown -R www-data:www-data var/

ci-setup-test: run
	$(DOCKER_COMPOSE) exec -T php phing ci-setup-test

test-security: run
	$(DOCKER_COMPOSE) exec -T php phing test-security

test: run
	$(DOCKER_COMPOSE) exec -T php phing generate-jwt-keys
	$(DOCKER_COMPOSE) exec -T php bin/console doctrine:schema:drop --env=test --force
	$(DOCKER_COMPOSE) exec -T php bin/console doctrine:schema:create --env=test
	$(DOCKER_COMPOSE) exec -T php bin/console oloy:user:projections:index:create --drop-old
	$(DOCKER_COMPOSE) exec -T php bin/console doctrine:schema:update --env=test -n --force
	$(DOCKER_COMPOSE) exec -T php bin/console broadway:event-store:schema:drop
	$(DOCKER_COMPOSE) exec -T php bin/console broadway:event-store:schema:init
	$(DOCKER_COMPOSE) exec -T php bin/console doctrine:fixtures:load --env=test -n
	$(DOCKER_COMPOSE) exec -T php bin/console assets:install --env=test
	$(DOCKER_COMPOSE) exec -T php bin/console doctrine:schema:validate --env=test --skip-sync
	$(DOCKER_COMPOSE) exec -T php bash -c "SYMFONY_DEPRECATIONS_HELPER=disabled vendor/phpunit/phpunit/phpunit -d memory_limit=-1 $(TEST_ARGS)"

# compatibility to pre docker-compose rules & aliases
$(RUN_IMAGE): run
$(BUILD_IMAGE): image
start: run
cli: bash
update: image clean run

# all is phony...
.PHONY: %
.DEFAULT: run
