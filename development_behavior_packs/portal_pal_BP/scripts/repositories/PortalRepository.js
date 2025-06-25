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
export class FetchSavedDateError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FetchSavedDateError';
        Object.setPrototypeOf(this, FetchSavedDateError.prototype);
    }
}
export class PortalRepository {
    /**
     * Adds a new portal for a player.
     * @param { Portal } portal The portal to add.
     * @param { PortalPalPlayer } player The player to add it for.
     * @returns { boolean } If adding the portal was successful (or not).
     */
    addPortal(portal, player) {
        PortalRepository.slimPortal(portal);
        portal.id = PortalRepository.makeUniqueID();
        let savedData;
        try {
            savedData = this.fetchSavedDataForPlayer(player);
        }
        catch {
            return false;
        }
        savedData.portals.push(portal);
        return this.writeSavedData(savedData, player);
    }
    /**
     * Edits the properties of an existing portal.
     * @param { Portal } portal The portal to edit.
     * @param { PortalPalPlayer } player The player who owns the portal.
     * @returns { boolean } If the edit was successful (or not).
     */
    editPortal(portal, player) {
        const success = this.deletePortal(portal, player);
        if (!success) {
            return false;
        }
        return this.addPortal(portal, player);
    }
    /**
     * Deletes the specified portal belonging to a player.
     * @param { Portal } portal The portal to delete.
     * @param { PortalPalPlayer } player The player who owns the portal.
     * @returns { boolean } If the delete was successful (or not).
     */
    deletePortal(portal, player) {
        let savedData;
        try {
            savedData = this.fetchSavedDataForPlayer(player);
        }
        catch {
            return false;
        }
        savedData.portals = savedData.portals.filter((p) => {
            return p.id !== portal.id;
        });
        return this.writeSavedData(savedData, player);
    }
    /**
     * Reads a player's saved data from Minecraft's key-value, property storage.
     * @param { PortalPalPlayer } player The player whose portals to get.
     * @param  { boolean } excludePrivate Flag to prevent returning a player's private portals.
     * @returns { SavedData } An object containing the player's saved portals.
     */
    fetchSavedDataForPlayer(player, excludePrivate = false) {
        const propertyName = PortalRepository.makePropertyName(player);
        let fetchedData = { player: player.minecraftPlayer.name, portals: [] };
        try {
            let readData = world.getDynamicProperty(propertyName);
            if (readData !== undefined) {
                fetchedData = JSON.parse(readData.toString());
            }
        }
        catch {
            throw new FetchSavedDateError(`Could not fetch saved data for player: ${player.minecraftPlayer.name}`);
        }
        if (excludePrivate) {
            const publicPortals = fetchedData.portals.filter((portal) => {
                return portal.private === false;
            });
            fetchedData.portals = publicPortals;
        }
        return fetchedData;
    }
    /**
     * Writes a player's saved data to Minecraft's key-value, property storage.
     * @param { SavedDate } savedData The data to save.
     * @param { PortalPalPlayer } forPlayer The player to save it for.
     * @returns { boolean } If saving the data was successful (or not).
     */
    writeSavedData(savedData, forPlayer) {
        savedData.portals = savedData.portals.sort((a, b) => a.name.localeCompare(b.name));
        let success = false;
        try {
            const propertyName = PortalRepository.makePropertyName(forPlayer);
            world.setDynamicProperty(propertyName, JSON.stringify(savedData));
            success = true;
        }
        catch (error) {
            // Do nothing, success is already false.
        }
        return success;
    }
    /**
     * Generates a property name for a player used to store their portals.
     * @param { PortalPalPlayer } player The player to generate the property name for.
     * @returns { string } A property name.
     */
    static makePropertyName(player) {
        return `pp_${player.minecraftPlayer.id}`;
    }
    /**
     * Generates a unique ID to identify a portal.
     * This ID is not guarenteed to be unique across players.
     * @returns { string } A unique (enough) ID.
     */
    static makeUniqueID() {
        // This is a hack since I don't have access to GUIDs,
        // but I'm going with a good enough, straightforward solution.
        // These should be unique across a single player's portals, which is sufficient.
        return new Date().getTime().toString();
    }
    /**
     * Takes a portal and reduces the precision of it's location to a whole number.
     * Doing this makes the portal take up significantly less space in storage.
     * @param { Portal } portal The portal to slim.
     */
    static slimPortal(portal) {
        portal.location.x = Math.floor(portal.location.x);
        portal.location.y = Math.floor(portal.location.y);
        portal.location.z = Math.floor(portal.location.z);
    }
}
