import { world } from '@minecraft/server';
import { PortalPalApplication } from './PortalPalApplication';

world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId === "pp:portal_pal") {
        let portalPalApplication = new PortalPalApplication(event.source);
        portalPalApplication.initialize();
    }
});

/*
// BELOW IS FOR DEBUG ONLY. UNCOMMENT, REBUILD, AND OPEN WORLD TO DELETE ALL SAVED PORTALS.
world.afterEvents.worldInitialize.subscribe(event => {
    world.clearDynamicProperties();
});
*/
