import { world } from '@minecraft/server';
export class Logger {
    static log(text) {
        world.sendMessage(text);
    }
}
