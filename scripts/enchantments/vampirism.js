import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("vampirism","Vampirism",3,slots.sword);


// Event start
mc.world.afterEvents.entityHitEntity.subscribe(a =>{
    const hit = a.hitEntity;
    const attacker = a.damagingEntity;

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
            let rand = Math.random()*12
            if (rand < level){
                hit.dimension.spawnParticle("hog:blood_emitter",{x:hit.location.x,y:hit.location.y+2,z:hit.location.z});
                attacker.addEffect("instant_health",1,{amplifier:0})
            }
        }
    }
})