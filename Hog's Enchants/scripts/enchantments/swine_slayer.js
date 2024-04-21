import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("swine_slayer","Swine Slayer",5,slots.sword,["sharpness","bane_of_arthropods","smite"]);


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
            hit.runCommand(`damage @s[family=pig] ${level*2} entity_attack`)
            hit.runCommand(`damage @s[family=hoglin] ${level*2} entity_attack`)
            hit.runCommand(`damage @s[family=piglin] ${level*2} entity_attack`)
            hit.runCommand(`damage @s[family=zombie_pigman] ${level*2} entity_attack`)
            hit.runCommand(`damage @s[family=zoglin] ${level*2} entity_attack`)
        }
    }
})