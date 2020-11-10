import { RaidGroup } from './RaidGroup';

export interface Alarm {
    id: number;
    type: 'user' | 'channel';
    targetGuildId: string;
    targetId: string;
    offsetHour: number;
    raidGroup: RaidGroup;
    targetRoleId?: string;
}
