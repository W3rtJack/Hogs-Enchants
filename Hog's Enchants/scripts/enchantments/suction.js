import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("suction","Suction",2,slots.sword,["knockback"]);


// Event start
mc.world.afterEvents.entityHitEntity.subscribe(a =>{
    const hit = a.hitEntity;
    const attacker = a.damagingEntity;

    if (!hit) return

    if (attacker.typeId == "minecraft:player"){
        // Getting items
        const equipment = attacker.getComponent("equippable");
        const item = equipment.getEquipment("Mainhand");

        if (!item) return

        // Setting values
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            // Running valid code
            let loc = {
                x: attacker.location.x-hit.location.x,
                y: attacker.location.y-hit.location.y,
                z: attacker.location.z-hit.location.z
            }
            hit.applyKnockback(loc.x,loc.z,level,0.3+loc.y*0.2)
        }
    }
})