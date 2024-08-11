import { world } from '@minecraft/server';
export class PortalService {
    addPortal(portal, player) {
        this.slimPortal(portal);
        portal.id = this.generateUniqueID();
        let savedData = this.fetchDataForPlayer(player);
        savedData.portals.push(portal);
        return this.writeSavedData(savedData, player);
    }
    editPortal(portal, player) {
        let success = this.deletePortal(portal, player);
        if (!success) {
            return false;
        }
        return this.addPortal(portal, player);
    }
    deletePortal(portal, player) {
        let savedData = this.fetchDataForPlayer(player);
        savedData.portals = savedData.portals.filter((p) => {
            return p.id !== portal.id;
        });
        return this.writeSavedData(savedData, player);
    }
    fetchDataForPlayer(player, excludePrivate = false) {
        let propertyName = this.makePropertyName(player);
        let fetchedData = { player: player.name, portals: [] };
        try {
            let readData = world.getDynamicProperty(propertyName);
            if (readData !== undefined) {
                fetchedData = JSON.parse(readData.toString());
            }
        }
        catch { }
        if (excludePrivate) {
            let publicPortals = fetchedData.portals.filter((portal) => {
                return portal.private === false;
            });
            fetchedData.portals = publicPortals;
        }
        return fetchedData;
    }
    writeSavedData(savedData, forPlayer) {
        savedData.portals = savedData.portals.sort((a, b) => a.name.localeCompare(b.name));
        // TODO: Need to figure out size and not saving more than 10KB.
        // const size = new TextEncoder().encode(JSON.stringify(writeData)).length;
        // Logger.log(size.toString());
        /*
        let test = this.getByteSize(JSON.stringify(savedData))
        Utilities.log(`SIZE: ${test}`);

        let test2 = new Blob([JSON.stringify(savedData)]).size;
        Utilities.log(`SIZE 2: ${test2}`);

        JSON.stringify(savedData).
        */
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
    slimPortal(portal) {
        portal.location.x = Math.floor(portal.location.x);
        portal.location.y = Math.floor(portal.location.y);
        portal.location.z = Math.floor(portal.location.z);
    }
    getByteSize(str) {
        let byteSize = 0;
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code <= 0x7f) {
                byteSize += 1; // 1 byte for ASCII characters
            }
            else if (code <= 0x7ff) {
                byteSize += 2; // 2 bytes for characters in the range 0x80-0x7FF
            }
            else if (code >= 0xd800 && code <= 0xdbff) {
                // Surrogate pair (4 bytes)
                byteSize += 4;
                i++; // Skip the next code unit
            }
            else {
                byteSize += 3; // 3 bytes for other characters in the range 0x800-0xFFFF
            }
        }
        return byteSize;
    }
}
