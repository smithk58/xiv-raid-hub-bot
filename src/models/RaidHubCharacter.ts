export interface RaidHubCharacter {
    defaultClass: string;
    isOwner: boolean;
    character: {id: number, name: string, server: string};
}
