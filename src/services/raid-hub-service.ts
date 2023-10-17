import { Inject, Singleton } from 'typescript-ioc';
import fetch, { Response } from 'node-fetch';
import { URL } from 'url';

import { EnvService } from './env-service';
import { Alarm } from '../models/Alarm';
import { RaidHubCharacter } from '../models/RaidHubCharacter';
import { WeeklyRaidTime } from '../models/WeeklyRaidTime';

@Singleton
export class RaidHubService {
    @Inject private envService: EnvService;
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
    private async handleResponse<T>(response: Response, url: URL): Promise<T> {
        let result = await response.json() as T | Error;
        if (response.status !== 200) {
            result = result as Error;
            const error = result.message ? result.message : response.statusText;
            console.error('response error', url.pathname, error);
            return Promise.reject(null as T);
        }
        return result as T;
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
