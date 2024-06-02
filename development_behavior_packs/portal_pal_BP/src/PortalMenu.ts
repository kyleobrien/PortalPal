import { Player } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';
import { MenuManager } from 'MenuManager';

export class PortalMenu {
    private readonly menuManager: MenuManager;

    private readonly you: Player;
    private readonly chosenPlayer: Player;
    private readonly isYou: boolean;
    
    constructor(menuManager: MenuManager, you: Player, chosenPlayer: Player) {
        this.menuManager = menuManager;

        this.you = you;
        this.chosenPlayer = chosenPlayer;

        this.isYou = (you.id == chosenPlayer.id);
    }

    public open() {
        let form = new ActionFormData().title('Available Portals');
    
        // TODO: Need to decide on an icon for each type of portal.
        
        form.button("Current Location", "textures/items/diamond_helmet");
        form.button("Spawn Point", "textures/items/diamond_helmet");

        // TODO: Need to get all the saved portals and add buttons.
        // If the player is not you, need to only show the ones that are not private.
       
        form.show(this.you).then((response: ActionFormResponse) => {
            if (response.canceled) {
                // They've canceled. Do nothing.
            } else if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.teleportToCurrentLocation(this.chosenPlayer);
                } else if (response.selection == 1) {
                    this.menuManager.teleportToSpawn(this.chosenPlayer);
                } else {
                    // TODO: Figure out how to handle custom portals.
                }
            }
        });
    }
}
