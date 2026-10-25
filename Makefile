.PHONY: start stop logs \
	dev dev/logs dev/down \
	dev/frontend dev/frontend/logs dev/frotnend/down

DC = docker-compose

# HIGH LEVEL SETUP
# start containers for develpment
start: dev

# stop all development containers
stop:
	$(DC) down

# logs of all containers
logs:
	$(DC) logs -f


# DEVELOPMENT SETUP
dev:
	$(DC) up -d --build

dev/logs:
	$(DC) logs -f

dev/down:
	$(DC) down

# INDIVIDUAL CONTAINER RULES
# FRONTEND
dev/frontend:
	$(DC) up -d --build frontend

dev/frontend/logs:
	$(DC) logs -f frontend

dev/frontend/down:
	$(DC) down frontend

dev/web-server:
	$(DC) up -d --build web-server

dev/web-server/logs:
	$(DC) logs -f web-server

dev/web-server/down:
	$(DC) down web-server
