import { world, Player } from '@minecraft/server';

export interface Portal {
    id: string;
    name: string;
    color: number;
    private: boolean;
    location: { x: number;
                y: number;
                z: number; }
    dimension: string;
}

export enum PortalColors {
    purple = 0,
    magenta = 1,
    red = 2,
    yellow = 3,
    green = 4,
    turquoise = 5,
    blue = 6
}

export interface SavedData {
    player: string;
    portals: Portal[];
}

export class ReadWriteService {
    public addPortal(portal: Portal, player: Player): boolean {
        this.slimPortal(portal);
        portal.id = this.makeUniqueID();
        
        let savedData = this.fetchDataForPlayer(player);
        savedData.portals.push(portal);

        return this.writeSavedData(savedData, player);
    }

    public editPortal(portal: Portal, player: Player): boolean {
        let success = this.deletePortal(portal, player);
        if (!success) {
            return false;
        }

        return this.addPortal(portal, player);
    }

    public deletePortal(portal: Portal, player: Player): boolean {
        let savedData = this.fetchDataForPlayer(player);
        
        savedData.portals = savedData.portals.filter((p) => {
            return p.id !== portal.id;
        });
        
        return this.writeSavedData(savedData, player);
    }

    public fetchDataForPlayer(player: Player, excludePrivate: boolean = false): SavedData {
        let propertyName = this.makePropertyName(player);
        let fetchedData: SavedData = { player: player.name, portals: [] };

        try {
            let readData = world.getDynamicProperty(propertyName);
            if (readData !== undefined) {
                fetchedData = JSON.parse(readData.toString());
            }
        } catch {
            // TODO: Better handling here.
        }

        if (excludePrivate) {
            let publicPortals = fetchedData.portals.filter((portal) => {
                return portal.private === false;
            });

            fetchedData.portals = publicPortals;
        }

        return fetchedData;
    }

    private writeSavedData(savedData: SavedData, forPlayer: Player): boolean {
        savedData.portals = savedData.portals.sort((a, b) => a.name.localeCompare(b.name));

        // TODO: Need to figure out size and not saving more than 10KB.
        // None of the approaches work below, because I don't have access to the libraries.

        // const size = new TextEncoder().encode(JSON.stringify(writeData)).length;
        // const size = new Blob([JSON.stringify(savedData)]).size;

        let success = false;
        try {
            let propertyName = this.makePropertyName(forPlayer);
            world.setDynamicProperty(propertyName, JSON.stringify(savedData));
            success = true;
        } catch (error) {
            // TODO: Better handling here.
        }
        
        return success;
    }

    private makePropertyName(player: Player): string {
        return `pp_${player.id}`;
    }

    private makeUniqueID(): string {
        // This is a hack since I don't have access to GUIDs,
        // but I'm going with a good enough, straightforward solution.
        // These should be unique across a single player's portals, which is sufficient.
        return new Date().getTime().toString();
    }

    private slimPortal(portal: Portal): void {
        portal.location.x = Math.floor(portal.location.x);
        portal.location.y = Math.floor(portal.location.y);
        portal.location.z = Math.floor(portal.location.z);
    }
}
