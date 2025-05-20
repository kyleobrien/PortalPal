import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';
import { Player } from '@minecraft/server';
import { MenuManager } from '../MenuManager';
import { PortalColors, SavedData } from '../ReadWriteService';
import { Utilities } from '../Utilities';

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

        if (Utilities.arePlayersTheSame(this.menuManager.players.you, this.chosenPlayer)) {
            form.button("Add Portal", "textures/icons/menu_plus");
            buttonCount += 1;
        }

        form.show(this.menuManager.players.you).then((response: ActionFormResponse) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.portalMenuTeleportToCurrentLocationOfPlayer(this.chosenPlayer);
                } else if (response.selection == 1) {
                    this.menuManager.portalMenuTeleportToSpawnOfPlayer(this.chosenPlayer);
                } else if ((response.selection == buttonCount - 1 ) &&
                           Utilities.arePlayersTheSame(this.menuManager.players.you, this.chosenPlayer)) {
                    this.menuManager.portalMenuAddNewPortal();
                } else {
                    // TODO: if we ever change to show players who are not logged in,
                    //       then we can't always sutract by 2.
                    let portal = this.savedData.portals[response.selection - 2];
                    this.menuManager.portalMenuTeleportToPortal(portal, this.chosenPlayer);
                }
            }
        });
    }
}
