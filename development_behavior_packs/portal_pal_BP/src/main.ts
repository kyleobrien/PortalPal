import { world } from '@minecraft/server';

import { MenuManager } from './MenuManager';

// DEBUG ONLY. DELETES ALL SAVED PORTALS.

/*
world.afterEvents.worldInitialize.subscribe(event => {
    world.clearDynamicProperties();
});
*/

world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId === "pp:portal_pal") {
        let menuManager = new MenuManager(event.source);
        menuManager.start();
    }
});
