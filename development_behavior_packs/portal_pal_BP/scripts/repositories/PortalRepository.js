import { world } from '@minecraft/server';
export var PortalColor;
(function (PortalColor) {
    PortalColor[PortalColor["purple"] = 0] = "purple";
    PortalColor[PortalColor["magenta"] = 1] = "magenta";
    PortalColor[PortalColor["red"] = 2] = "red";
    PortalColor[PortalColor["yellow"] = 3] = "yellow";
    PortalColor[PortalColor["green"] = 4] = "green";
    PortalColor[PortalColor["turquoise"] = 5] = "turquoise";
    PortalColor[PortalColor["blue"] = 6] = "blue";
})(PortalColor || (PortalColor = {}));
export class PortalRepository {
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
        let fetchedData = { player: player.minecraftPlayer.name, portals: [] };
        try {
            let readData = world.getDynamicProperty(propertyName);
            if (readData !== undefined) {
                fetchedData = JSON.parse(readData.toString());
            }
        }
        catch {
            // TODO: Better handling here. Throw a custom exception to catch and display to the current player.
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
        let success = false;
        try {
            let propertyName = this.makePropertyName(forPlayer);
            world.setDynamicProperty(propertyName, JSON.stringify(savedData));
            success = true;
        }
        catch (error) {
            // TODO: Better handling here. Throw a custom exception and catch in caller to display a message.
        }
        return success;
    }
    makePropertyName(player) {
        return `pp_${player.minecraftPlayer.id}`;
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
