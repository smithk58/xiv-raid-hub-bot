
# XIV Raidhub Bot
## Developing

Run `npm run start-dev` to start the dev server.

## Lint

Run `npm run lint` to run the projects linter.

## Environment Variables

Put these values in a [`.env`](https://www.npmjs.com/package/dotenv) file or in the projects environment variables.

### Required

* `DISCORD_BOT_TOKEN` - the Discord token for the bot.
* `XIV_RAID_HUB_API_KEY` - API key for accessing raid hubs API.
* `API_KEY` - the API key this app will lock down its API with.
### Optional

* `NODE_DEV` = `development`, for dev, otherwise assumes production
* `COMMAND_PREFIX` - the command prefix for the bot. Defaults to `!`. 
* `XIV_RAID_HUB_BASE_URL` - override for the base URL to use for raid hub API. Defaults to `https://api.raidhub.com`.
* `ALLOWED_ORIGIN` - restricts webservers origin in prod mode. Defaults to `https://api.raidhub.com`.
