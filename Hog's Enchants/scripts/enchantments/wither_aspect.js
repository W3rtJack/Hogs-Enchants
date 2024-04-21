import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("wither_aspect","Wither Aspect",2,slots.sword,["fire_aspect"]);


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
            hit.addEffect("wither",100+20*(level-1),{amplifier:0})
        }
    }
})