import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("covering_cloak","Covering Cloak",2,slots.chest);

// Event start
mc.system.afterEvents.scriptEventReceive.subscribe(a =>{
    const id = a.id;
    const player = a.sourceEntity;

    if (id == `enchant:${ench.id}` && player.typeId == "minecraft:player"){
        // Getting items
        const equipment = player.getComponent("equippable");
        const item = equipment.getEquipment("Chest");

        // Setting values
        if (!item) return;
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            if (player.isSneaking){
                const time = player.getDynamicProperty("enchant.sneakingTime") == undefined ? 0 : player.getDynamicProperty("enchant.sneakingTime")

                player.setDynamicProperty("enchant.sneakingTime",time > 120-(20*level) ? 120-(20*level) : time+1)

                if (time+1 > 120-(20*level)){
                    player.addEffect("invisibility",20)
                    player.runCommand(`playanimation @s animation.hide.chest a 1`)

                    if (player.getDynamicProperty("enchant.hidden") != true){
                        const loc = player.location;
                        loc.y++;
                        player.dimension.spawnParticle("hog:poof",loc)
                        mc.world.playSound("scrape",player.location)
                        player.setDynamicProperty("enchant.hidden",true)
                    }
                }
            }else {
                const time = player.getDynamicProperty("enchant.sneakingTime") == undefined ? 0 : player.getDynamicProperty("enchant.sneakingTime")
                player.setDynamicProperty("enchant.sneakingTime",time < 0 ? 0 : time-5)
                player.setDynamicProperty("enchant.hidden",false)
            }
        }
    }
})