import { world } from '@minecraft/server';
export class PortalService {
    addPortal(player, portal) {
        this.slimPortalLocation(portal);
        portal.id = this.generateUniqueID();
        let fetchedData = this.fetchDataFor(player);
        fetchedData.portals.push(portal);
        // TODO: Probably need to resort the portals here instead of always tacking on to the end.
        // TODO: Need to figure out size and not saving more than 10KB.
        // const size = new TextEncoder().encode(JSON.stringify(writeData)).length;
        // Logger.log(size.toString());
        return this.writeSavedData(fetchedData, player);
    }
    editPortal(player, portal) {
        return false;
    }
    deletePortal(deletedPortal, player) {
        let savedData = this.fetchDataFor(player, false);
        let temp = savedData.portals.filter(function (portal) {
            return portal.id != deletedPortal.id;
        });
        savedData.portals = temp;
        return this.writeSavedData(savedData, player);
    }
    fetchDataFor(player, excludePrivate = false) {
        let propertyName = this.makePropertyName(player);
        let fetchedData = { player: player.name, portals: [] };
        try {
            let readData = world.getDynamicProperty(propertyName);
            if (readData !== undefined) {
                fetchedData = JSON.parse(readData.toString());
            }
        }
        catch (error) { }
        if (excludePrivate) {
            let publicPortals = fetchedData.portals.filter((portal) => {
                return portal.private === false;
            });
            fetchedData.portals = publicPortals;
        }
        return fetchedData;
    }
    writeSavedData(savedData, forPlayer) {
        let isSuccess = false;
        try {
            let propertyName = this.makePropertyName(forPlayer);
            world.setDynamicProperty(propertyName, JSON.stringify(savedData));
            isSuccess = true;
        }
        catch (error) { }
        return isSuccess;
    }
    makePropertyName(player) {
        return `pp_${player.id}`;
    }
    generateUniqueID() {
        // This is a hack since I don't have access to GUIDs,
        // so I'm going with a good enough, straightforward solution.
        // These should be unique across a single player's portals, which is sufficient.
        return new Date().getTime().toString();
    }
    slimPortalLocation(portal) {
        portal.location.x = Math.floor(portal.location.x);
        portal.location.y = Math.floor(portal.location.y);
        portal.location.z = Math.floor(portal.location.z);
    }
}
/**
 * besides what the form has, need to save:
 * coordinates
 * dimension
 * save the players name  one time?
 */
// getDynamicPropertyIds if I want to get a list of players even if they are offline
/*
function updateWorldProperty(propertyName: string): boolean {
    let paintStr = mc.world.getDynamicProperty(propertyName);
    let paint: { color: string; intensity: number } | undefined = undefined;

    console.log('Current value is: ' + paintStr);

    if (paintStr === undefined) {
        paint = {
            color: 'purple',
            intensity: 0,
        };
    } else {
        if (typeof paintStr !== 'string') {
            console.warn('Paint is of an unexpected type.');
            return false;
        }

        try {
            paint = JSON.parse(paintStr);
        } catch (e) {
            console.warn('Error parsing serialized struct.');
            return false;
        }
    }

    if (!paint) {
        console.warn('Error parsing serialized struct.');
        return false;
    }

    paint.intensity++;
    paintStr = JSON.stringify(paint); // be very careful to ensure your serialized JSON str cannot exceed limits
    mc.world.setDynamicProperty(propertyName, paintStr);

    return true;
}
*/
// TODO: enforce 10,000 bytes of text data limit?
// may want to use clearDynamicProperties() to delete everything...
