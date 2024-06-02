import { world } from '@minecraft/server';
import { PlayerMenu } from './PlayerMenu';
import { MenuManager } from 'MenuManager';
world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId === "pp:portal_pal") {
        let you = event.source;
        let everyone = world.getAllPlayers();
        let otherPlayers = everyone.filter((player) => player.id != you.id);
        let menuManager = new MenuManager(you);
        let playerMenu = new PlayerMenu(menuManager, you, otherPlayers);
        playerMenu.open();
    }
});
/*  TODO:
 *  Final item texture.
 *  Final behavior and texture pack artwork.
 *  See about upgrading manifest versions so we don't need to turn on experimental stuff?
 */
// Adding to this test.
