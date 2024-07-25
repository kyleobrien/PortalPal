import { Player } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';

import { MenuManager } from '../MenuManager';
import { SavedData } from '../ReadWriteService';
import { Utilities } from 'Utilities';

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
        form.button("Current Location", "textures/items/diamond_helmet");
        form.button("Spawn Point", "textures/items/diamond_helmet");

        let buttonCount = 2;

        for (const portal of this.savedData.portals) {
            let iconPath = "textures/icons/portal_";
            switch (portal.color) {
                case 0:
                    iconPath += "red";
                    break;
                case 1:
                    iconPath += "orange";
                    break;
                case 2:
                    iconPath += "yellow";
                    break;
                case 3:
                    iconPath += "green";
                    break;
                case 4:
                    iconPath += "blue";
                    break;
                case 5:
                    iconPath += "brown";
                    break;
                case 6:
                    iconPath += "pink";
                    break;
                case 7:
                    iconPath += "purple";
                    break;
            }

            iconPath += ".png";

            form.button(portal.name, iconPath);
            buttonCount += 1;
        }

        if (Utilities.arePlayersTheSame(this.menuManager.you, this.chosenPlayer)) {
            form.button("Add Portal", "textures/items/diamond_helmet");
            buttonCount += 1;
        }

        form.show(this.menuManager.you).then((response: ActionFormResponse) => {
            if (response.selection !== undefined) {
                if (response.selection == 0) {
                    this.menuManager.portalMenuTeleportToCurrentLocationOfPlayer(this.chosenPlayer);
                } else if (response.selection == 1) {
                    this.menuManager.portalMenuTeleportToSpawnOfPlayer(this.chosenPlayer);
                } else if ((response.selection == buttonCount - 1 ) &&
                           Utilities.arePlayersTheSame(this.menuManager.you, this.chosenPlayer)) {
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
