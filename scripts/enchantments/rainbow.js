import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";
import { getUnbreakingChance, mineList } from "../main";

// Declaring Enchant
const ench = registerEnchant("rainbow","Rainbow",1,slots.shears);

const woolList = [
    "minecraft:black_wool",
    "minecraft:blue_wool",
    "minecraft:brown_wool",
    "minecraft:cyan_wool",
    "minecraft:gray_wool",
    "minecraft:green_wool",
    "minecraft:light_blue_wool",
    "minecraft:light_gray_wool",
    "minecraft:lime_wool",
    "minecraft:magenta_wool",
    "minecraft:orange_wool",
    "minecraft:pink_wool",
    "minecraft:purple_wool",
    "minecraft:red_wool",
    "minecraft:white_wool",
    "minecraft:yellow_wool"
]


// Event start
mc.world.beforeEvents.playerInteractWithEntity.subscribe(t=> {
    // Default values
    const player = t.player;
    const item = t.itemStack;
    const entity = t.target;

    // Getting item valid
    if (!item) return

    // Setting values
    const {valid, level} = ench.getItem(item);


    if (valid){
        if (entity.typeId == "minecraft:sheep"){
            if (!entity.hasComponent("minecraft:is_sheared") && !entity.hasComponent("minecraft:is_baby")){
                t.cancel = true;

                mc.system.run(()=>{

                    entity.triggerEvent("minecraft:on_sheared");
                    const randColor = Math.floor(Math.random()*woolList.length)
                    const randAmt = Math.round(Math.random()*3,0)+1;

                    const loc = entity.location;
                    loc.y++;

                    entity.dimension.spawnItem(new mc.ItemStack(woolList[randColor],randAmt),loc)

                    if (!getUnbreakingChance(item)){
                        if (item.getComponent("minecraft:durability").maxDurability - item.getComponent("minecraft:durability").damage <= 1){
                        mc.world.playSound("random.break",player.location)
                        equipment.setEquipment("Mainhand",new mc.ItemStack("minecraft:air"))
                        }else {
                            item.getComponent("minecraft:durability").damage++;
                            player.getComponent("equippable").setEquipment("Mainhand",item)
                        }
                    }
                })

            }
        }
    }
})