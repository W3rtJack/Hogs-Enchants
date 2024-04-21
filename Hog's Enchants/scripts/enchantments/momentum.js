import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("momentum","Momentum",3,slots.feet);


// Event start
mc.system.afterEvents.scriptEventReceive.subscribe(a =>{
    const id = a.id;
    const player = a.sourceEntity;

    if (id == `enchant:${ench.id}` && player.typeId == "minecraft:player"){
        // Getting items
        const equipment = player.getComponent("equippable");
        const item = equipment.getEquipment("Feet");

        // Setting values
        if (!item) return;
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            if (!player.isOnGround && !player.isSneaking){
                player.applyKnockback(player.getVelocity().x,player.getVelocity().z,0.61+(0.5*(level-1)),player.getVelocity().y-player.getVelocity().y*0.2)
            }
        }
    }
})