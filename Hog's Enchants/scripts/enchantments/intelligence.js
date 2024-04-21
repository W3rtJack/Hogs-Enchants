import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("intelligence","Intelligence",5,slots.sword);


// Event start
mc.world.afterEvents.entityDie.subscribe(a =>{
    const dead = a.deadEntity;
    const player = a.damageSource.damagingEntity;

    if (!player) return;

    if (player.typeId == "minecraft:player"){
        // Getting items
        const equipment = player.getComponent("equippable");
        const item = equipment.getEquipment("Mainhand");

        if (!item) return

        // Setting values
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            if (dead.typeId != "minecraft:player"){
                for (let i=0;i<level;i++){
                    if (Math.random()<0.43){
                        dead.runCommand("summon xp_orb")
                    }
                }
            }
        }
    }
})