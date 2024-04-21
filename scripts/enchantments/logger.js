import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";
import { getUnbreakingChance, mineList } from "../main";

// Declaring Enchant
const ench = registerEnchant("logger","Logger",3,slots.axe);

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
        const diamondLevel = item.getDynamicProperty("enchant.diamond_droppings.level")
        mineList["axe"].forEach(tag => {
            if (block.getTags().includes(tag)){
                if (player.isSneaking){
                    logger(newBlock,0,level,diamondLevel)
                }
            }
        });

        if (!getUnbreakingChance(item)){
            if (item.getComponent("minecraft:durability").maxDurability - item.getComponent("minecraft:durability").damage <= 1){
              mc.world.playSound("random.break",player.location)
              equipment.setEquipment("Mainhand",new mc.ItemStack("minecraft:air"))
            }else {
                item.getComponent("minecraft:durability").damage++;
              equipment.setEquipment("Mainhand",item)
            }
        }
    }
})


function logger(block,iter,maxIter,diamond=0){
    if (iter < maxIter){
        let newIter = iter+1
        if (block.above().hasTag("log")){
            logger(block.above(),newIter,maxIter)
        }
        if (block.below().hasTag("log")){
            logger(block.below(),newIter,maxIter)
        }
        if (block.east().hasTag("log")){
            logger(block.east(),newIter,maxIter)
        }
        if (block.west().hasTag("log")){
            logger(block.west(),newIter,maxIter)
        }
        if (block.south().hasTag("log")){
            logger(block.south(),newIter,maxIter)
        }
        if (block.north().hasTag("log")){
            logger(block.north(),newIter,maxIter)
        }
    }

    if (diamond >= 1){
        const rand = Math.random()*100
        if (rand<diamond){
            const diamond = new mc.ItemStack("minecraft:diamond")
            block.dimension.spawnItem(diamond,block.location)
        }
    }

    block.dimension.runCommand(`setblock ${block.location.x} ${block.location.y} ${block.location.z} air [] destroy`)
}