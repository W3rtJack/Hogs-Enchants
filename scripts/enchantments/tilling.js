import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";
import { getUnbreakingChance, mineList } from "../main";

// Declaring Enchant
const ench = registerEnchant("tilling","Tilling",3,[slots.hoe,slots.shovel]);


// Event start
mc.world.afterEvents.itemUseOn.subscribe(t=> {
    // Default values
    const block = t.block
    const player = t.source
    const item = t.itemStack
    
    // Getting item valid
    if (!item) return

    // Setting values
    const {valid, level} = ench.getItem(item);


    if (valid){
        var count = 1;

        if (item.hasTag("minecraft:is_shovel")){
            if (block.type.id == "minecraft:grass_path"){
                for (var x=-level;x<level+1;x++){
                    for (var z=-level;z<level+1;z++){
                        let blockTry = player.dimension.getBlock({x:block.location.x+x,y:block.location.y,z:block.location.z+z})
                        if (blockTry.typeId == "minecraft:grass_block" || blockTry.typeId == "minecraft:dirt"){
                            let blockTest = player.dimension.getBlock({x:block.location.x+x,y:block.location.y+1,z:block.location.z+z})
                            if (blockTest.typeId == "minecraft:air"){
                                player.runCommand(`setblock ${block.location.x+x} ${block.location.y} ${block.location.z+z} grass_path`)
                                count++;
                            }
                        }
                        
                    }
                }
            }
        }
        if (item.hasTag("minecraft:is_hoe")){
            if (block.type.id == "minecraft:farmland"){
                for (var x=-level;x<level+1;x++){
                    for (var z=-level;z<level+1;z++){
                        let blockTry = player.dimension.getBlock({x:block.location.x+x,y:block.location.y,z:block.location.z+z})
                        if (blockTry.typeId == "minecraft:grass_block" || blockTry.typeId == "minecraft:dirt"){
                            let blockTest = player.dimension.getBlock({x:block.location.x+x,y:block.location.y+1,z:block.location.z+z})
                            if (blockTest.typeId == "minecraft:air"){
                                player.runCommand(`setblock ${block.location.x+x} ${block.location.y} ${block.location.z+z} farmland`)
                                count++;
                            }
                        }
                        
                    }
                }
            }
        }

        var brokeCount = 0;
        for (var i=0;i<count;i++){
            if (!getUnbreakingChance(item)){
                brokeCount++;
                if (item.getComponent("minecraft:durability").maxDurability - item.getComponent("minecraft:durability").damage <= 1){
                    mc.world.playSound("random.break",player.location)
                    player.getComponent("equippable").setEquipment("Mainhand",new mc.ItemStack("minecraft:air"))
                }else {
                    item.getComponent("minecraft:durability").damage++;
                    player.getComponent("equippable").setEquipment("Mainhand",item)
                }
            }
        }
        player.runCommand(`say ${brokeCount}`)
    }
})