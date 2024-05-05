import { world, system, Player } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';
import { PlayerMenu } from './PlayerMenu';
import { MenuManager } from 'MenuManager';

function playSound(player, success) {
    if (success) {
        system.runTimeout(() => {
            player.playSound("portal_pal.teleport");
        }, 5);
    } else {
        system.runTimeout(() => {
            player.playSound("portal_pal.failure");
        }, 5);
    }
}

world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId === "pp:portal_pal") {
        let menuManager = new MenuManager();

        let you = event.source;
        let spawnPoint = you.getSpawnPoint();

        // Get all the other players in the game.
        let everyone = world.getAllPlayers();
        let otherPlayers = everyone.filter((player) => player.id != you.id);
        
        let playerMenu = new PlayerMenu(menuManager, you, otherPlayers);
        playerMenu.open();

        /*
        // Bail if there's no place to teleport to.
        if (otherPlayers.length == 0 && spawnPoint == undefined) {
            you.sendMessage('No other players in the game and no spawn point set. There\'s no place to teleport!');
            playSound(you, false);

            return;
        }
        */
    }
});


/*  TODO:
 *  Final item texture.
 *  Final behavior and texture pack artwork.
 *  See about upgrading manifest versions so we don't need to turn on experimental stuff?
 */

// Adding to this test.