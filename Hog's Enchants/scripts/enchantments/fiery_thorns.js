import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("fiery_thorns","Fiery Thorns",3,slots.chest);


// Event start
mc.world.afterEvents.entityHitEntity.subscribe(a =>{
    const hit = a.hitEntity;
    const attacker = a.damagingEntity;

    if (hit.typeId == "minecraft:player"){
        // Getting items
        const equipment = hit.getComponent("equippable");
        const item = equipment.getEquipment("Chest");

        if (!item) return;

        // Setting values
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            // Running valid code
            let rand = Math.random()*10
            if (rand < (level+0.5)**1.5){
                attacker.setOnFire(5)
            }
        }
    }
})