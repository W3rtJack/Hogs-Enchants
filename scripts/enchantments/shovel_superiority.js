import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("shovel_superiority","Shovel Superiority",5,slots.shovel);


// Event start
mc.world.afterEvents.entityHitEntity.subscribe(a =>{
    const hit = a.hitEntity;
    const attacker = a.damagingEntity;

    if (hit.typeId == "minecraft:player"){
        // Getting items
        const equipment = hit.getComponent("equippable");
        const item = equipment.getEquipment("Mainhand");

        if (!item) return

        // Setting values
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            // Running valid code
            hit.applyDamage(3*level)
        }
    }
})