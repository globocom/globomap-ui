# Version package

DOCKER_COMPOSE_FILE=$(shell make docker_file)

help:
	@echo
	@echo "Please use 'make <target>' where <target> is one of"
	@echo

	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

containers_start: ## Start containers
	docker-compose --file $(DOCKER_COMPOSE_FILE) up -d

containers_build: ## Build containers
	docker-compose --file $(DOCKER_COMPOSE_FILE) build --no-cache

containers_stop: ## Stop containers
	docker-compose --file $(DOCKER_COMPOSE_FILE) stop

containers_clean: ## Destroy containers
	docker-compose --file $(DOCKER_COMPOSE_FILE) rm -s -v -f

dynamic_ports: ## Set ports to services
	./scripts/docker/ports.sh

docker_file:
	@if [[ -f "docker-compose-temp.yml" ]]; then \
		echo "docker-compose-temp.yml"; 		 \
	else                                         \
		echo "docker-compose.yml";               \
    fi
