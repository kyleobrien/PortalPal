import { world } from '@minecraft/server';
import { MenuManager } from './MenuManager';

world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId === "pp:portal_pal") {
        (new MenuManager(event.source)).openMainMenu();
    }
});

// DEBUG ONLY. UNCOMMENT, REBUILD, AND OPEN WORLD TO DELETE ALL SAVED PORTALS.
/*
world.afterEvents.worldInitialize.subscribe(event => {
    world.clearDynamicProperties();
});
*/
