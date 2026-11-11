FROM ghcr.io/pnpm/pnpm:latest AS base
RUN pnpm runtime set node 26 -g

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN pnpm install --store-dir /var/cache/pnpm --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=web --prod /prod/web
RUN pnpm deploy --filter=api --prod /prod/api

FROM base AS web
COPY --from=build /prod/web /prod/web
WORKDIR /prod/web
EXPOSE 3001
CMD [ "pnpm", "start" ]

FROM base AS api
COPY --from=build /prod/api /prod/api
WORKDIR /prod/api
EXPOSE 3000
CMD [ "pnpm", "start" ]