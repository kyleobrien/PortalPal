import { world, Player } from '@minecraft/server';

export abstract class Utilities {
    public static arePlayersTheSame(player1: Player, player2: Player): boolean {
        if (player1.id === player2.id) {
            return true;
        }

        return false;
    }

    public static log(text: string): void {
        world.sendMessage(text);
    }
}
