import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "enchantment.js";

// Declaring Enchant
const ench = registerEnchant("smashing","Smashing",3,slots.sword);

// Event start
mc.world.afterEvents.entityHitEntity.subscribe(a =>{
    const hit = a.hitEntity;
    const attacker = a.damagingEntity;

    if (attacker.typeId == "minecraft:player"){
        // Getting items
        const equipment = attacker.getComponent("equippable");
        const item = equipment.getEquipment("Mainhand");

        // Checking if the item is valid if not, stopping
        if (!item) return

        // Setting values
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            // Running valid code
            const vel = attacker.getVelocity()

            if (!attacker.isOnGround && vel.y < -0.1 && !attacker.isSneaking){
                attacker.applyKnockback(vel.x,vel.z,0,level*0.4+0.3)
            }
        }
    }
})
