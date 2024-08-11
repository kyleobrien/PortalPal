import { MessageFormResponse, MessageFormData } from '@minecraft/server-ui';

import { MenuManager } from '../MenuManager';
import { Portal } from '../ReadWriteService';

export class ConfirmMenu {
    private readonly menuManager: MenuManager;
    private readonly portal: Portal;
    
    constructor(menuManager: MenuManager, portal: Portal) {
        this.menuManager = menuManager;
        this.portal = portal;
    }

    public open(): void {
        let body= `Are you sure you want to delete the portal named "${this.portal.name}"? This action cannot be undone.`;
        let form = new MessageFormData().title("Delete Portal")
                                        .body(body)
                                        .button1("Cancel")
                                        .button2("Delete");
        
        form.show(this.menuManager.you).then((response: MessageFormResponse) => {
            if ((response.selection !== undefined) && (response.selection === 1)) {
                this.menuManager.confirmMenuDeletePortal(this.portal);
            }
        });
    }
}
