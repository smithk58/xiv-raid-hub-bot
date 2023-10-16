import { Inject, Singleton } from 'typescript-ioc';
import { Client, TextChannel } from 'discord.js';
import Timeout = NodeJS.Timeout;

import { RaidHubService } from './raid-hub-service';
import { Alarm } from '../models/Alarm';

@Singleton
export class AlarmScheduler {
    @Inject private raidHubService: RaidHubService;
    private client: Client;
    private intervalInMinutes = 15;
    private currentTimer: Timeout;
    init(client: Client) {
        this.client = client;
    }
    /**
     * Begins periodically checking for and sending alarms.
     */
    startScheduling() {
        // Cancel any existing timer before starting a new one
        clearTimeout(this.currentTimer);
        this.startTimer();
    }
    /**
     * Stops checking for and sending alarms.
     */
    cancelScheduling() {
        clearTimeout(this.currentTimer);
    }
    private startTimer() {
        // Set timeout with our calculation should avoid the time drifting when using setInterval
        // eslint-disable-next-line
        this.currentTimer = setTimeout(this.processAlarms.bind(this), this.getMillisUntilNextExecution());
    }
    /**
     * Begins processing the alarms that match the servers current UTC hour/minute.
     */
    private async processAlarms() {
        // TODO get alarms, send message per alarm, catch errors, send batch of errors back to API
        // Get the alarms for the current hour/minute
        const targetDate = this.getTargetAlarmDate();
        const alarms = await this.raidHubService.getAlarms(targetDate.getUTCHours(), targetDate.getUTCMinutes()).catch(() => null);
        if (alarms) {
            alarms.forEach((alarm: Alarm) => {
                void this.sendMessage(alarm, targetDate);
            })
        }
        // Start the next timer
        this.startTimer()
    }
    /**
     * Returns the time in millis until the alarm job should be run.
     */
    private getMillisUntilNextExecution(): number {
        const now = new Date();
        const currentMinutes = now.getMinutes();
        const currentSeconds = now.getSeconds();
        // Calculate how many minutes away next execution time is, -1 extra minute to account for seconds remaining later
        const excessMinutes = currentMinutes % this.intervalInMinutes;
        const minutesAway = this.intervalInMinutes - excessMinutes - 1;
        // Calculate how many seconds remain
        const secondsAway = 60 - currentSeconds;
        // Have to be careful of minutes being -1 because of the previous adjustment for seconds remaining
        const minuteMillis = minutesAway > 0 ? (minutesAway * 60000) : 0;
        return minuteMillis + (secondsAway * 1000);
    }

    /**
     * Returns the current date rounded to the nearest interval that we're executing alarms at.
     */
    private getTargetAlarmDate(): Date {
        // Convert minutes to ms
        const ms = 1000 * 60 * this.intervalInMinutes;
        // Round the current date/time to the nearest interval
        return new Date(Math.round(Date.now() / ms) * ms);
    }

    /**
     * Sends the message for the specified alarm. Handles both DMs and channel messages.
     * @param alarm -
     * @param alarmDate - The exact date/time the alarm is supposed to go off.
     */
    private async sendMessage(alarm: Alarm, alarmDate: Date) {
        if(alarm.type === 'user') {
            const guild = this.client.guilds.cache.get(alarm.targetGuildId);
            const user = guild ? await guild.members.fetch({user: alarm.targetId}) : undefined;
            if (user) {
                user.send(this.buildMessageContent(alarm, alarmDate)).catch((error: string) => {
                    // TODO Disable alarm if fails
                    console.error('send DM failed ' + error);
                });
            } else {
                console.error('guild/user didn\'t exist');
                // TODO Disable alarm if fails
            }
        } else if (alarm.type === 'channel') {
            const guild = this.client.guilds.cache.get(alarm.targetGuildId);
            const channel = guild ? guild.channels.cache.get(alarm.targetId): undefined;
            if (channel && channel.type === 'text') {
                (channel as TextChannel).send(this.buildMessageContent(alarm, alarmDate)).catch((error: string) => {
                    // TODO Disable alarm if fails
                    console.error('send to channel failed ' + error);
                })
            } else {
                console.error('guild/channel didn\'t exist');
                // TODO Disable alarm if fails
            }
        }
    }
    /**
     * Generates the message that should be sent out for a particular alarm.
     * @param alarm -
     * @param alarmDate - The exact date/time the alarm is supposed to go off.
     */
    private buildMessageContent(alarm: Alarm, alarmDate: Date) {
        const role = alarm.targetRoleId ? '<@&' + alarm.targetRoleId + '> ' : '';
        const purpose = alarm.raidGroup.purpose || 'raid';
        const pluralHour = alarm.offsetHour > 1 ? 's' : '';
        const discordTimestamp = `<t:${this.getUnixTimestamp(alarmDate, alarm.offsetHour)}:t>`;
        const timeLeft = alarm.offsetHour === 0 ? 'now' : `in ${alarm.offsetHour} hour${pluralHour}`;
        return `${role}${alarm.raidGroup.name} is scheduled to do ${purpose} at ${discordTimestamp}, which is ${timeLeft}!`;
    }

    /**
     * Calculates the unix timestamp for the date/time that the alarm is warning about.
     * @param alarmDate - The date/time the alarm should go off.
     * @param offsetInHours - How many hours before the target date/time the alarm is warning about.
     */
    private getUnixTimestamp(alarmDate: Date, offsetInHours: number): number {
        const date = new Date(alarmDate.getTime()); // clone date since setHours modifies original
        // Adding the offset to the time the alarm goes off should result in the actual time the alarm is warning about
        // JS Date should automatically handle hours wrapping across days
        date.setHours(date.getHours() + offsetInHours);
        // JS dates are milliseconds, unix timestamps are seconds, so we have to convert
        return Math.floor(date.getTime() / 1000);
    }
}
