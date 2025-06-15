import { world } from '@minecraft/server';
export class Utilities {
    static log(text) {
        world.sendMessage(text);
    }
}
