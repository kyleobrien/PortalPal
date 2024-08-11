import { world } from '@minecraft/server';
export var PortalColors;
(function (PortalColors) {
    PortalColors[PortalColors["purple"] = 0] = "purple";
    PortalColors[PortalColors["magenta"] = 1] = "magenta";
    PortalColors[PortalColors["red"] = 2] = "red";
    PortalColors[PortalColors["yellow"] = 3] = "yellow";
    PortalColors[PortalColors["green"] = 4] = "green";
    PortalColors[PortalColors["turquoise"] = 5] = "turquoise";
    PortalColors[PortalColors["blue"] = 6] = "blue";
})(PortalColors || (PortalColors = {}));
export class ReadWriteService {
    addPortal(portal, player) {
        this.slimPortal(portal);
        portal.id = this.makeUniqueID();
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
        catch {
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
    writeSavedData(savedData, forPlayer) {
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
        }
        catch (error) {
            // TODO: Better handling here.
        }
        return success;
    }
    makePropertyName(player) {
        return `pp_${player.id}`;
    }
    makeUniqueID() {
        // This is a hack since I don't have access to GUIDs,
        // but I'm going with a good enough, straightforward solution.
        // These should be unique across a single player's portals, which is sufficient.
        return new Date().getTime().toString();
    }
    slimPortal(portal) {
        portal.location.x = Math.floor(portal.location.x);
        portal.location.y = Math.floor(portal.location.y);
        portal.location.z = Math.floor(portal.location.z);
    }
}
