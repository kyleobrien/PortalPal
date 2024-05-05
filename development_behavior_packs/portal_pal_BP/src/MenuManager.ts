import { Player } from '@minecraft/server';

export class MenuManager {
    constructor() {

    }
    
    public playerMenuSelected(player: Player) {
        // TODO: Implement handling of player selection.
    }
}

/*
Held over code from selecting from the menu.
let targetPlayer = otherPlayers[response.selection];
                let teleportOptions = {
                    checkForBlocks: true,
                    dimension: targetPlayer.dimension
                };

                if (you.tryTeleport(targetPlayer.location, teleportOptions)) {
                    you.sendMessage(`Teleported to ${targetPlayer.name}...`);
                    playSound(you, true);
                } else {
                    you.sendMessage('Failed to create a portal! Try again later.');
                    playSound(you, false);
                }
            } else {
                // They've selected the spawn point.
                
                //let spawnPointLocation = new Vector3(
                //    spawnPoint.x,
                //    spawnPoint.y,
                //    spawnPoint.z
                //);

                let spawnPointLocation = { x: spawnPoint.x, y: spawnPoint.y, z: spawnPoint.z };

                let teleportOptions = {
                    checkForBlocks: true,
                    dimension: spawnPoint.dimension
                };

                if (you.tryTeleport(spawnPointLocation, teleportOptions)) {
                    you.sendMessage('Teleported to spawn point...');
                    playSound(you, true);
                } else {
                    you.sendMessage('Failed to create a portal! Try again later.');
                    playSound(you, false);
                }
            }
            */