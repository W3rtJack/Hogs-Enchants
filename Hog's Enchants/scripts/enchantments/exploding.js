import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("exploding","Exploding",3,slots.chest,["thorns","fiery_thorns"]);


// Event start
mc.world.afterEvents.entityHitEntity.subscribe(a =>{
    const hit = a.hitEntity;
    const attacker = a.damagingEntity;

    if (hit.typeId == "minecraft:player"){
        // Getting items
        const equipment = hit.getComponent("equippable");
        const item = equipment.getEquipment("Chest");

        if (!item) return

        // Setting values
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            // Running valid code
            let rand = Math.random()*9
            if (rand < level){
                hit.addEffect("resistance",10,{amplifier:10})
                hit.addEffect("instant_health",1,{amplifier:0})
                hit.dimension.createExplosion({x:hit.location.x,y:hit.location.y+2,z:hit.location.z},2,{breaksBlocks:false});
            }
        }
    }
})