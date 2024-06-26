import { world, Player } from '@minecraft/server';
import { Logger } from './Logger';

interface Portal {
    name: string;
    color: number;
    private: boolean;
    location: { x: number;
                y: number;
                z: number; }
    dimension: { id: string; }
}

interface Data {
    player: string;
    portals: Portal[];
}

export class PortalService {
    private makePropertyName(player: Player): string {
        return `pp_${player.id}`;
    }

    private slimPortalLocation(portal: Portal) {
        portal.location.x = Math.floor(portal.location.x);
        portal.location.y = Math.floor(portal.location.y);
        portal.location.z = Math.floor(portal.location.z);
    }

    public addPortal(player: Player, portal: Portal): boolean {
        this.slimPortalLocation(portal);
        
        let fetchedData = this.fetchDataFor(player);
        fetchedData.portals.push(portal);

        // TODO: Probably need to resort the portals here instead of always tacking on to the end.

        // TODO: Need to figure out size and not saving more than 10KB.
        // const size = new TextEncoder().encode(JSON.stringify(writeData)).length;
        // Logger.log(size.toString());

        let isSuccess = false;
        try {
            let propertyName = this.makePropertyName(player);
            world.setDynamicProperty(propertyName, JSON.stringify(fetchedData));
            isSuccess = true;
        } catch (error) {}
        
        return isSuccess;
    }

    public fetchDataFor(player: Player): Data {
        let propertyName = this.makePropertyName(player);
        let fetchedData: Data = { player: player.name, portals: [] };

        try {
            let readData = world.getDynamicProperty(propertyName);
            if (readData !== undefined) {
                fetchedData = JSON.parse(readData.toString());
            }
        } catch (error) {}

        return fetchedData;
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
