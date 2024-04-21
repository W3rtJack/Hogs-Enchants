import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";
import { getUnbreakingChance, mineList } from "../main";

// Declaring Enchant
const ench = registerEnchant("rocket_retainer","Rocket Retainer",2,slots.elytra);

// Event start
mc.world.afterEvents.itemUse.subscribe(t=> {
    // Default values
    const player = t.source
    const item = t.itemStack

    // Getting items
    const equipment = player.getComponent("equippable");
    const item2 = equipment.getEquipment("Chest");
    
    // Getting item valid
    if (!item) return
    if (!item2) return

    // Setting values
    const {valid, level} = ench.getItem(item2);


    if (valid){
        if (item.typeId == "minecraft:firework_rocket"){            
            let rand = Math.random()*10
            if (rand < 2*level+0.5){
                
                equipment.setEquipment("Mainhand",item)
            }
        }
    }
})