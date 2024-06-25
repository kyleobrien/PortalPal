import { world, Player } from '@minecraft/server';
import { Logger } from './Logger';

interface Portal {
    name: string;
    color: number;
    private: boolean;
    location: {   
                    x: number;
                    y: number;
                    z: number;
                }
    dimension: {
                    id: string;
                 }
    }

interface Data {
    player: string;
    portals: Portal[];
}

export class PortalService {
    private makePropertyName(player: Player): string {
        return `pp_${player.id}`;
    }

    // TODO: figure out how to do the type on "portal" parameter
    public addPortal(player: Player, portal) {
        let savedString = JSON.stringify(portal);
        Logger.log(savedString);
       
        // TODO: Need to figure out size and not saving more than 10KB.
        //const size = new TextEncoder().encode(JSON.stringify(savedString)).length
        //Logger.log(size.toString());

        let propertyName = this.makePropertyName(player);
        Logger.log(propertyName);

        let writeData: Data = { player: player.name, portals: [] };

        try {
            let readData = world.getDynamicProperty(propertyName);
            if (readData !== undefined) {
                writeData = JSON.parse(readData.toString());
            }
        } catch (error) {
            
        }
        
        writeData.portals.push(portal);

        // TODO: Probably need to resort the portals here instead of always tacking on to the end.
        
        let test = JSON.stringify(writeData);
        Logger.log(test);
        world.setDynamicProperty(propertyName, test);
    }

    public fetchAllPortalsFor(player: Player): any[] | null {
        // TODO: there's no error handling here.
        let propertyName = this.makePropertyName(player);
        let savedPortalsJSON = world.getDynamicProperty(propertyName);

        if (savedPortalsJSON !== undefined) {
            return JSON.parse(savedPortalsJSON.toString());
        }

        return null;
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
