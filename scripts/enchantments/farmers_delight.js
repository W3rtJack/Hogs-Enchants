import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";

// Declaring Enchant
const ench = registerEnchant("farmers_delight","Farmers Delight",2,slots.hoe);

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
        if (block.getState("growth") > 6){
            if (block.type.id == "minecraft:potatoes"){
                const dropItem = new mc.ItemStack("minecraft:potato",level*2)
                newBlock.dimension.spawnItem(dropItem,newBlock.location)
            }
            else if (block.type.id == "minecraft:carrots"){
                const dropItem = new mc.ItemStack("minecraft:carrot",level*2)
                newBlock.dimension.spawnItem(dropItem,newBlock.location)
            }
            else if (block.type.id == "minecraft:beetroot"){
                const dropItem = new mc.ItemStack("minecraft:beetroot",level)
                newBlock.dimension.spawnItem(dropItem,newBlock.location)
                const dropItem2 = new mc.ItemStack("minecraft:beetroot_seeds",level)
                newBlock.dimension.spawnItem(dropItem2,newBlock.location)
            }
            else if (block.type.id == "minecraft:wheat"){
                const dropItem = new mc.ItemStack("minecraft:wheat",level)
                newBlock.dimension.spawnItem(dropItem,newBlock.location)
                const dropItem2 = new mc.ItemStack("minecraft:wheat_seeds",level)
                newBlock.dimension.spawnItem(dropItem2,newBlock.location)
            }
            
        }
    }
})