FROM ghcr.io/pnpm/pnpm:latest AS base
RUN pnpm runtime set node 26 -g

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN pnpm install --store-dir /var/cache/pnpm --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=./packages/web --prod /prod/web
RUN pnpm deploy --filter=./packages/api --prod /prod/api
RUN pnpm deploy --filter=./packages/admin --prod /prod/admin

FROM base AS web
COPY --from=build /prod/web /prod/web
COPY --from=build /usr/src/app/env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
WORKDIR /prod/web
EXPOSE 3001
CMD /docker-entrypoint.d/env.sh; pnpm start

FROM base AS admin
COPY --from=build /prod/admin /prod/admin
COPY --from=build /usr/src/app/env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
WORKDIR /prod/admin
EXPOSE 3002
CMD /docker-entrypoint.d/env.sh; pnpm start

FROM base AS api
COPY --from=build /prod/api /prod/api
WORKDIR /prod/api
EXPOSE 3000
CMD [ "pnpm", "start" ]