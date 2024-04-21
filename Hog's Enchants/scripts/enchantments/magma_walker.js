import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("magma_walker","Magma Walker",2,slots.feet,["frost_walker"]);


// Event start
mc.system.afterEvents.scriptEventReceive.subscribe(a =>{
    const id = a.id;
    const player = a.sourceEntity;

    if (id == `enchant:${ench.id}` && player.typeId == "minecraft:player"){
        // Getting items
        const equipment = player.getComponent("equippable");
        const item = equipment.getEquipment("Feet");

        // Setting values
        if (!item) return;
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            let dist = level*2
            player.runCommand(`fill ~-${dist} ~-1 ~-${dist} ~${dist} ~-1 ~${dist} hog:crumbling_magma [] replace lava`)
        }
    }
})