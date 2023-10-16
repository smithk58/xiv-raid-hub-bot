import { RaidGroup } from './RaidGroup';

export interface WeeklyRaidTime {
    utcHour: number;
    utcMinute: number;
    utcTimezoneOffset: number;
    unixTimestamp: number;
    raidGroup: RaidGroup
}
