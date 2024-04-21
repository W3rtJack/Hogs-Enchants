import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";
import { getUnbreakingChance, mineList } from "../main";

// Declaring Enchant
const ench = registerEnchant("replenish","Replenish",1,slots.hoe);

// Event start
mc.world.afterEvents.playerBreakBlock.subscribe(g=> {
    // Default values
    const player = g.player
    const item = g.itemStackBeforeBreak
    const block = g.brokenBlockPermutation
    const newBlock = g.block
    
    // Getting item valid
    if (!item) return

    // Setting values
    const {valid, level} = ench.getItem(item);


    if (valid){
        if (block.type.id == "minecraft:potatoes"){
            if (hasItem(player,"minecraft:potato")){
                player.runCommand(`setblock ${newBlock.location.x} ${newBlock.location.y} ${newBlock.location.z} potatoes`)
                player.runCommand("clear @s potato -1 1")
            }
        }
        else if (block.type.id == "minecraft:carrots"){
            if (hasItem(player,"minecraft:carrot")){
                player.runCommand(`setblock ${newBlock.location.x} ${newBlock.location.y} ${newBlock.location.z} carrots`)
                player.runCommand("clear @s carrot -1 1")
            }
        }
        else if (block.type.id == "minecraft:beetroot"){
            if (hasItem(player,"minecraft:beetroot_seeds")){
                player.runCommand(`setblock ${newBlock.location.x} ${newBlock.location.y} ${newBlock.location.z} beetroot`)
                player.runCommand("clear @s beetroot_seeds -1 1")
            }
        }
        else if (block.type.id == "minecraft:wheat"){
            if (hasItem(player,"minecraft:wheat_seeds")){
                player.runCommand(`setblock ${newBlock.location.x} ${newBlock.location.y} ${newBlock.location.z} wheat`)
                player.runCommand("clear @s wheat_seeds -1 1")
            }
        }
    }
})