import { Player } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';
import { MenuManager } from '../MenuManager';
import { SavedData } from '../PortalService';

export class PortalMenu {
    private readonly menuManager: MenuManager;
    private readonly chosenPlayer: Player;
    private readonly savedData: SavedData;
    
    constructor(menuManager: MenuManager, chosenPlayer: Player, savedData: SavedData) {
        this.menuManager = menuManager;
        this.chosenPlayer = chosenPlayer;
        this.savedData = savedData;
    }

    public open(): void {
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

        form.show(this.menuManager.you).then((response: ActionFormResponse) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.portalMenuTeleportToCurrentLocation(this.chosenPlayer);
                } else if (response.selection == 1) {
                    this.menuManager.portalMenuTeleportToSpawn(this.chosenPlayer);
                } else if (response.selection == buttonCount - 1 ) {
                    this.menuManager.portalMenuAddNewPortal();
                } else {
                    // FIXME: if we ever change to show players who are not logged in,
                    //        then we can't always sutract by 2.
                    this.menuManager.portalMenuSelected(this.chosenPlayer,
                                                        response.selection - 2,
                                                        this.savedData);
                }
            }
        });
    }
}
