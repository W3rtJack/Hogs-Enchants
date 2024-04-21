import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";
import { mineList } from "../main";

// Declaring Enchant
const ench = registerEnchant("speed_miner","Speed Miner",3,slots.pickaxe);

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
        mineList["pickaxe"].forEach(tag => {
            if (block.getTags().includes(tag)){
                player.addEffect("haste",100,{amplifier:enchVal-1})
            }
        });
    }
})