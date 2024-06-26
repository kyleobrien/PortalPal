import { world, system, Player } from '@minecraft/server';
import { MainMenu } from './menus/MainMenu';
import { MenuManager } from './MenuManager';

// DEBUG ONLY
world.afterEvents.worldInitialize.subscribe(event => {
    world.clearDynamicProperties();
});

world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId === "pp:portal_pal") {
        let you = event.source;
        let everyone = world.getAllPlayers();
        let otherPlayers = everyone.filter((player) => player.id != you.id);
        
        otherPlayers.sort((a, b) => a.name.localeCompare(b.name));

        let menuManager = new MenuManager(you);
        
        let mainMenu = new MainMenu(menuManager, otherPlayers);
        mainMenu.open();
    }
});
