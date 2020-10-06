
# XIV Riadhub Bot
## Developing

* `npm run start:dev` to run in dev mode
* `npm run start` to run in prod mode

## Environment Variables

Put these values in a [`.env`](https://www.npmjs.com/package/dotenv) file or in the projects environment variables.

### Required

* `NODE_DEV` = development, for deving
* `DISCORD_BOT_TOKEN` - the Discord token for the bot.
* `XIV_RAID_HUB_API_KEY` - API key for accessing raid hubs API.
* `API_KEY` - The API key this app will lock down its API with.
* `ALLOWED_ORIGIN` - Restricts webservers origin in prod.
### Optional

* `COMMAND_PREFIX` - the command prefix for the bot. Defaults to `!`. 
* `XIV_RAID_HUB_BASE_URL` - override for base URL to use for raid hub API.
