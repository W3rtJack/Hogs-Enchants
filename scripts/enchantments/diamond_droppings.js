import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";
import { mineList } from "../main";

// Declaring Enchant
const ench = registerEnchant("diamond_droppings","Diamond Droppings",2,[slots.axe,slots.pickaxe,slots.sword,slots.hoe,slots.shovel],["silk_touch"]);

// Event start
mc.world.afterEvents.entityDie.subscribe(a =>{
    const dead = a.deadEntity;
    const player = a.damageSource.damagingEntity;

    if (!player) return;

    if (player.typeId == "minecraft:player"){
        // Getting items
        const equipment = player.getComponent("equippable");
        const item = equipment.getEquipment("Mainhand");

        if (!item) return

        // Setting values
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            if (dead.typeId != "minecraft:player"){
                let rand = Math.random()*100
                if (rand<level){
                    const diamond = new mc.ItemStack("minecraft:diamond")
                    dead.dimension.spawnItem(diamond,dead.location)
                }
            }
        }
    }
})

mc.world.afterEvents.playerBreakBlock.subscribe(g=> {
    const player = g.player
    const item = g.itemStackBeforeBreak
    const block = g.brokenBlockPermutation
    const newBlock = g.block

    if (!item) return

    // Setting values
    const {valid, level} = ench.getItem(item);

    if (!valid) return

    if (item.hasTag("minecraft:is_pickaxe")){
        if (!silkTouch(item)){
            mineList["pickaxe"].forEach(tag => {
                if (block.getTags().includes(tag)){
                    let rand = Math.random()*100
                    if (rand<level){
                        const diamond = new mc.ItemStack("minecraft:diamond")
                        player.dimension.spawnItem(diamond,dead.location)
                    }
                }
            })
        }
    }
    if (item.hasTag("minecraft:is_shovel")){
        if (!silkTouch(item)){
            mineList["shovel"].forEach(tag => {
                if (block.getTags().includes(tag)){
                    let rand = Math.random()*100
                    if (rand<level){
                        const diamond = new mc.ItemStack("minecraft:diamond")
                        player.dimension.spawnItem(diamond,dead.location)
                    }
                }
            })
        }
    }
    if (item.hasTag("minecraft:is_hoe")){
        if (!silkTouch(item)){
            mineList["hoe"].forEach(tag => {
                if (block.getTags().includes(tag)){
                    let rand = Math.random()*100
                    if (rand<level){
                        const diamond = new mc.ItemStack("minecraft:diamond")
                        player.dimension.spawnItem(diamond,dead.location)
                    }
                }
            })
        }
    }
    if (item.hasTag("minecraft:is_axe")){
        if (!silkTouch(item)){
            mineList["axe"].forEach(tag => {
                if (block.getTags().includes(tag)){
                    let rand = Math.random()*100
                    if (rand<level){
                        const diamond = new mc.ItemStack("minecraft:diamond")
                        player.dimension.spawnItem(diamond,dead.location)
                    }
                }
            })
        }
    }
})

function silkTouch(item){
    const ench = item.getComponent("enchantable");
    if (ench.hasEnchantment("silk_touch")){
        return true
    }else {
        return false
    }
}