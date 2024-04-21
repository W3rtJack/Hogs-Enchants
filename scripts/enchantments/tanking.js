import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("tanking","Tanking",3,slots.legs);


// Event start
mc.system.afterEvents.scriptEventReceive.subscribe(a =>{
    const id = a.id;
    const player = a.sourceEntity;

    if (id == `enchant:${ench.id}` && player.typeId == "minecraft:player"){
        // Getting items
        const equipment = player.getComponent("equippable");
        const item = equipment.getEquipment("Legs");

        // Setting values
        if (!item) return;
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            player.addEffect("health_boost",10,{amplifier:level-1,showParticles:false});
        }
    }
})