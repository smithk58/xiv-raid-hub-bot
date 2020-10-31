import { Inject, Singleton } from 'typescript-ioc';
import fetch, { Response } from 'node-fetch';
import { URL } from 'url';

import { EnvService } from './env-service';
import { Alarm } from '../interfaces/Alarm';

@Singleton
export class RaidHubService {
    @Inject private envService: EnvService;
    async getAlarms(utcHour: number, utcMinute: number): Promise<Alarm[]> {
        const url = this.createUrl('/bot/scheduled-alarms', {
            utcHour: utcHour.toString(),
            utcMinute: utcMinute.toString()
        });
        const response = await fetch(url);
        return this.handleResponse(response);
    }
    async getSchedule(discordUserId: string): Promise<any> {
        const url = this.createUrl(`/discord-user/${discordUserId}/schedule`);
        const response = await fetch(url);
        return this.handleResponse(response);
    }
    private async handleResponse(response: Response) {
        if (response.status !== 200) {
            return Promise.reject(response);
        }
        return response.json();
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
