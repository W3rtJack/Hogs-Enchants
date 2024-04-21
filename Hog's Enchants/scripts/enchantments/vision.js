import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("vision","Vision",3,slots.head);


// Event start
mc.system.afterEvents.scriptEventReceive.subscribe(a =>{
    const id = a.id;
    const player = a.sourceEntity;

    if (id == `enchant:${ench.id}` && player.typeId == "minecraft:player"){
        // Getting items
        const equipment = player.getComponent("equippable");
        const item = equipment.getEquipment("Head");

        // Setting values
        if (!item) return;
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            player.runCommand(`fill ~ ~1 ~ ~ ~1 ~ light_block ["block_light_level"=${level * 5}] replace air`);
        }
    }
})