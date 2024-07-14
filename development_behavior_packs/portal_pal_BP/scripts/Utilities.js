import { world } from '@minecraft/server';
export class Utilities {
    static arePlayersTheSame(player1, player2) {
        if (player1.id === player2.id) {
            return true;
        }
        return false;
    }
    static log(text) {
        world.sendMessage(text);
    }
}
