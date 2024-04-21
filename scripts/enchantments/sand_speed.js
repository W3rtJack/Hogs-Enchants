import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("sand_speed","Sand Speed",3,slots.feet,["soul_speed"]);


// Event start
let tick;
mc.system.afterEvents.scriptEventReceive.subscribe(a =>{
    tick++;
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
            const sandList = ["minecraft:sand","minecraft:sandstone","minecraft:red_sandstone","suspicious_sand"]

            let onBlock = player.dimension.getBlock({x:player.location.x,y:player.location.y-1,z:player.location.z})
            if (sandList.includes(onBlock.typeId)){
                player.addEffect("speed",1,{amplifier:level-1})

                if (tick % 5-level === 0){
                    if (player.isOnGround){
                        if ((player.getVelocity().x > 0.1 || player.getVelocity().x < -0.1) || (player.getVelocity().z > 0.1 || player.getVelocity().z < -0.1))
                            player.dimension.spawnParticle("hog:footprint",{x:player.location.x,y:player.location.y-0.9,z:player.location.z})
                    }
                }
            }
        }
    }
})