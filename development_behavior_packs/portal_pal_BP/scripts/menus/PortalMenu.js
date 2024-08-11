import { ActionFormData } from '@minecraft/server-ui';
import { PortalColors } from '../ReadWriteService';
import { Utilities } from 'Utilities';
export class PortalMenu {
    constructor(menuManager, chosenPlayer, savedData) {
        this.menuManager = menuManager;
        this.chosenPlayer = chosenPlayer;
        this.savedData = savedData;
    }
    open() {
        let form = new ActionFormData().title('Available Portals');
        // TODO: if we ever change to show players who are not logged in,
        //       then we need to conditionally add these buttons.
        form.button("Current Location", "textures/items/compass_item");
        form.button("Spawn Point", "textures/items/bed_purple");
        let buttonCount = 2;
        for (const portal of this.savedData.portals) {
            let iconPath = `textures/icons/portal_${PortalColors[portal.color]}.png`;
            form.button(portal.name, iconPath);
            buttonCount += 1;
        }
        if (Utilities.arePlayersTheSame(this.menuManager.you, this.chosenPlayer)) {
            form.button("Add Portal", "textures/icons/menu_plus");
            buttonCount += 1;
        }
        form.show(this.menuManager.you).then((response) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.portalMenuTeleportToCurrentLocationOfPlayer(this.chosenPlayer);
                }
                else if (response.selection == 1) {
                    this.menuManager.portalMenuTeleportToSpawnOfPlayer(this.chosenPlayer);
                }
                else if ((response.selection == buttonCount - 1) &&
                    Utilities.arePlayersTheSame(this.menuManager.you, this.chosenPlayer)) {
                    this.menuManager.portalMenuAddNewPortal();
                }
                else {
                    // TODO: if we ever change to show players who are not logged in,
                    //       then we can't always sutract by 2.
                    let portal = this.savedData.portals[response.selection - 2];
                    this.menuManager.portalMenuTeleportToPortal(portal, this.chosenPlayer);
                }
            }
        });
    }
}
