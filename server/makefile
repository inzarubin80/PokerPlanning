LOCAL_BIN:=$(CURDIR)/bin

.PHONY: .install-sqlc
.install-sqlc:
	$(info Installing sqlc...)
	GOBIN=$(LOCAL_BIN) go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest

.PHONY: .sqlc-generate
.sqlc-generate:
	$(info sqlc-generate...)
	bin/sqlc generate


.PHONY: .install-goose
.install-goose:
	$(info Installing binary dependencies...)
	GOBIN=$(LOCAL_BIN) go install github.com/pressly/goose/v3/cmd/goose@v3.22.1
	
.PHONY: .apply-migrations
.apply-migrations:
	bin/goose -dir migrations postgres "postgresql://user:password@127.0.0.1:5432/route256?sslmode=disable" up

.PHONY: .reset-migrations
.reset-migrations:
	bin/goose -dir migrations postgres "postgresql://user:password@127.0.0.1:5432/route256?sslmode=disable" down-to 0
	bin/goose -dir migrations postgres "postgresql://user:password@127.0.0.1:5432/route256?sslmode=disable" up                                                                               

MIGRATIONS_DIR=./migrations
.PHONY: create-migration
create-migration:
	@read -p "Введите имя миграции: " name; \
	bin/goose -dir $(MIGRATIONS_DIR) create $$name sql