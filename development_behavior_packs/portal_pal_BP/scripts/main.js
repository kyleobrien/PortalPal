import { world, system } from '@minecraft/server';
import { PlayerView } from './PlayerView';
function playSound(player, success) {
    if (success) {
        system.runTimeout(() => {
            player.playSound("portal_pal.teleport");
        }, 5);
    }
    else {
        system.runTimeout(() => {
            player.playSound("portal_pal.failure");
        }, 5);
    }
}
world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId === "pp:portal_pal") {
        let you = event.source;
        let spawnPoint = you.getSpawnPoint();
        // Get all the other players in the game.
        let everyone = world.getAllPlayers();
        let otherPlayers = everyone.filter((player) => player.id != you.id);
        let playerView = new PlayerView(you, otherPlayers);
        playerView.open();
        /*
        // Bail if there's no place to teleport to.
        if (otherPlayers.length == 0 && spawnPoint == undefined) {
            you.sendMessage('No other players in the game and no spawn point set. There\'s no place to teleport!');
            playSound(you, false);

            return;
        }
        */
        /*
        // Create the form and add buttons for all teleport targets.
        let form = new ActionFormData()
        .title('PortalPal')
        .body('Open a portal and go to:');
    
        for (const player of otherPlayers) {
            form.button(player.name, "textures/items/diamond_helmet");
        }
        
        if (spawnPoint != undefined) {
            form.button('Spawn Point', "textures/items/bed_purple");
        }
        
        // Show the form and teleport them based on the response.
        form.show(you).then((response) => {
            if (response.canceled) {
                // They've canceled. Do nothing.
            } else if (response.selection < otherPlayers.length) {
                // They've selected a player.
                let targetPlayer = otherPlayers[response.selection];
                let teleportOptions = {
                    checkForBlocks: true,
                    dimension: targetPlayer.dimension
                };

                if (you.tryTeleport(targetPlayer.location, teleportOptions)) {
                    you.sendMessage(`Teleported to ${targetPlayer.name}...`);
                    playSound(you, true);
                } else {
                    you.sendMessage('Failed to create a portal! Try again later.');
                    playSound(you, false);
                }
            } else {
                // They've selected the spawn point.
                
                //let spawnPointLocation = new Vector3(
                //    spawnPoint.x,
                //    spawnPoint.y,
                //    spawnPoint.z
                //);

                let spawnPointLocation = { x: spawnPoint.x, y: spawnPoint.y, z: spawnPoint.z };

                let teleportOptions = {
                    checkForBlocks: true,
                    dimension: spawnPoint.dimension
                };

                if (you.tryTeleport(spawnPointLocation, teleportOptions)) {
                    you.sendMessage('Teleported to spawn point...');
                    playSound(you, true);
                } else {
                    you.sendMessage('Failed to create a portal! Try again later.');
                    playSound(you, false);
                }
            }
        });
        */
    }
});
/*  TODO:
 *  Final item texture.
 *  Final behavior and texture pack artwork.
 *  See about upgrading manifest versions so we don't need to turn on experimental stuff?
 */
// Adding to this test.
