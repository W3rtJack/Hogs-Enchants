import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("lava_strider","Lava Strider",3,slots.feet,["depth_strider","magma_walker"]);


// Event start
mc.system.afterEvents.scriptEventReceive.subscribe(a =>{
    const id = a.id;
    const player = a.sourceEntity;

    if (id == `enchant:${ench.id}` && player.typeId == "minecraft:player"){
        // Getting items
        const equipment = player.getComponent("equippable");
        const item = equipment.getEquipment("Feet");

        // Setting values
        if (!item){
            player.getComponent("minecraft:lava_movement").resetToDefaultValue()
            return
        };
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            player.getComponent("minecraft:lava_movement").setCurrentValue(player.getComponent("minecraft:lava_movement").defaultValue*(1.3*level))
        }else {
            player.getComponent("minecraft:lava_movement").resetToDefaultValue()
        }
    }
})