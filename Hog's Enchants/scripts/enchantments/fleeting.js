import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("fleeting","Fleeting",2,slots.legs,["tanking"]);


// Event start
mc.world.afterEvents.entityHitEntity.subscribe(a =>{
    const hit = a.hitEntity;
    const attacker = a.damagingEntity;

    if (hit.typeId == "minecraft:player"){
        // Getting items
        const equipment = hit.getComponent("equippable");
        const item = equipment.getEquipment("Legs");

        if (!item) return

        // Setting values
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            // Running valid code
            hit.addEffect("speed",100,{amplifier:level-1})
        }
    }
})