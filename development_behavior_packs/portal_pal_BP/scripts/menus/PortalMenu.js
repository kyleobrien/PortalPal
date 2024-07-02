import { ActionFormData } from '@minecraft/server-ui';
export class PortalMenu {
    constructor(menuManager, chosenPlayer, savedData) {
        this.menuManager = menuManager;
        this.chosenPlayer = chosenPlayer;
        this.savedData = savedData;
    }
    open() {
        let form = new ActionFormData().title('Available Portals');
        // TODO: need to figure out all the button icons.
        // FIXME: if we ever change to show players who are not logged in,
        //        then we need to conditionally add these buttons.
        form.button("Current Location", "textures/items/diamond_helmet");
        form.button("Spawn Point", "textures/items/diamond_helmet");
        let buttonCount = 2;
        for (const portal of this.savedData.portals) {
            form.button(portal.name, "textures/items/diamond_helmet");
            buttonCount += 1;
        }
        if (this.menuManager.isPlayerYou(this.chosenPlayer)) {
            form.button("Add Portal", "textures/items/diamond_helmet");
            buttonCount += 1;
        }
        form.show(this.menuManager.you).then((response) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.portalMenuTeleportToCurrentLocation(this.chosenPlayer);
                }
                else if (response.selection == 1) {
                    this.menuManager.portalMenuTeleportToSpawn(this.chosenPlayer);
                }
                else if (response.selection == buttonCount - 1) {
                    this.menuManager.portalMenuAddNewPortal();
                }
                else {
                    // FIXME: if we ever change to show players who are not logged in,
                    //        then we can't always sutract by 2.
                    let portal = this.savedData.portals[response.selection - 2];
                    this.menuManager.portalMenuSelected(this.chosenPlayer, portal);
                }
            }
        });
    }
}
