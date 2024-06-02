import { world } from '@minecraft/server';
import { PlayerMenu } from './PlayerMenu';
import { MenuManager } from 'MenuManager';
world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId === "pp:portal_pal") {
        let you = event.source;
        let everyone = world.getAllPlayers();
        let otherPlayers = everyone.filter((player) => player.id != you.id);
        otherPlayers.sort((a, b) => a.name.localeCompare(b.name));
        let menuManager = new MenuManager(you);
        let playerMenu = new PlayerMenu(menuManager, otherPlayers);
        playerMenu.open();
    }
});
