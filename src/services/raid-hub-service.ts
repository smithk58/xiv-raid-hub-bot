import { Inject, Singleton } from 'typescript-ioc';
import fetch, { Response } from 'node-fetch';
import { URL } from 'url';

import { EnvService } from './env-service';
import { Alarm } from '../models/Alarm';
import { RaidHubCharacter } from '../models/RaidHubCharacter';
import { WeeklyRaidTime } from '../models/WeeklyRaidTime';
import { LoggerService } from './logger-service';

@Singleton
export class RaidHubService {
    @Inject private envService: EnvService;
    @Inject private logger: LoggerService;
    async getAlarms(utcHour: number, utcMinute: number): Promise<Alarm[]> {
        const url = this.createUrl('/bot/scheduled-alarms', {
            utcHour: utcHour.toString(),
            utcMinute: utcMinute.toString()
        });
        const response = await fetch(url);
        return this.handleResponse<Alarm[]>(response, url);
    }
    async getRaidTimes(discordUserId: string): Promise<WeeklyRaidTime[]> {
        const url = this.createUrl(`/discord-user/${discordUserId}/raid-times`);
        const response = await fetch(url);
        return this.handleResponse(response, url);
    }
    async getCharacters(discordUserId: string): Promise<RaidHubCharacter[]> {
        const url = this.createUrl(`/discord-user/${discordUserId}/characters`);
        const response = await fetch(url);
        return this.handleResponse(response, url);
    }
    async toggleAlarmStatus(isEnabled: boolean, discordUserId: string, channelId?: string): Promise<{amountUpdated: number}> {
        const url = this.createUrl(`/discord-user/${discordUserId}/alarms`);
        if (channelId) {
            url.searchParams.set('targetGuildId', channelId);
        }
        const response = await fetch(url, {
            method: 'put',
            body: JSON.stringify({isEnabled}),
            headers: {'Content-Type': 'application/json'}
        });
        return this.handleResponse(response, url);
    }
    private async handleResponse<T>(response: Response, url: URL): Promise<T> {
        if (response.ok) {
            return await response.json() as T;
        } else {
            const error = await response.text();
            this.logger.log.error({url: url.pathname, error});
           return Promise.reject(error);
        }
    }
    /**
     * Creates a URL using the provided relative path with the xiv-apis base URL and API key taken care of.
     * @param path - A relative resource path to hit.
     * @param queryParams - Extra query params to add to the request.
     */
    private createUrl(path: string, queryParams?: Record<string, string>): URL {
        const baseUrl = this.envService.baseAPIUrl;
        const url = new URL(baseUrl + '/api' + path);
        // Append query params
        const params = queryParams ? queryParams : {};
        params.api_key = this.envService.raidHubAPIKey;
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        return url;
    }
}
