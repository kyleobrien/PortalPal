import { world } from '@minecraft/server';

export abstract class Logger {
    public static log(text: string): void {
        world.sendMessage(text);
    }
}
