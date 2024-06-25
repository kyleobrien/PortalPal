import { Player } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';
import { MenuManager } from '../MenuManager';

export class PortalMenu {
    private readonly menuManager: MenuManager;
    private readonly chosenPlayer: Player;
    
    constructor(menuManager: MenuManager, chosenPlayer: Player) {
        this.menuManager = menuManager;
        this.chosenPlayer = chosenPlayer;
    }

    public open(): void {
        let form = new ActionFormData().title('Available Portals');
            
        form.button("Current Location", "textures/items/diamond_helmet");
        form.button("Spawn Point", "textures/items/diamond_helmet");

        let buttonCount = 2;

        // TODO: Need to get all the saved portals and add buttons.
        // If the player is not you, need to only show the ones that are not private.
        // Increment the button count for each custom portal.

        if (this.menuManager.isPlayerYou(this.chosenPlayer)) {
            form.button("Add Portal", "textures/items/diamond_helmet");
        }

        buttonCount += 1;

        form.show(this.menuManager.you).then((response: ActionFormResponse) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.teleportToCurrentLocation(this.chosenPlayer);
                } else if (response.selection == 1) {
                    this.menuManager.teleportToSpawn(this.chosenPlayer);
                } else if (response.selection == buttonCount - 1 ) {
                    this.menuManager.addNewPortal();
                } else {
                    // TODO: Figure out how to handle custom portals.
                }
            }
        });
    }
}
