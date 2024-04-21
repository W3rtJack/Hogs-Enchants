import { world, system } from "@minecraft/server";


// This is what will reference when using registerEnchant
// You can use this to set and enchantment level and get if its on an item with the level attached
// For more information on how they work, look at an enchantment
export class Enchantment {
    constructor (id,name,maxLevel,slot){
        this.id = id;
        this.name = name;
        this.maxLevel = maxLevel;
        this.slot = slot;
    }

    start(){
    }

    setItem(item,level){
        item.setDynamicProperty(`enchant.${this.id}.valid`,true)
        item.setDynamicProperty(`enchant.${this.id}.level`,level)
        return true
    }

    getItem(item){
        if (item.getDynamicProperty(`enchant.${this.id}.valid`)){
            const level = item.getDynamicProperty(`enchant.${this.id}.level`)
            return {valid:true,level:level}
        }else {
            return {valid:false,level:0}
        }
    }
}

const regName = []
// To register an enchantment in your enchantment file/area run this function
// id being just how to find it, mostly useless to the user
// name is the visible name it will show to players
// Max level is the maximum level the enchantment can be, without cheating
// Slot can be a string or array saying what enchantment slot it checks for e.g. sword, chest, shovel.
// For slot use the dict slots below
export function registerEnchant(id,name,maxLevel,slot){
    var s = ""
    if (typeof(slot) == "object"){
        var newSlot = ""
        slot.forEach(s => {
            newSlot += s+","
        });
        s = newSlot
    }else {
        s = slot
    }

    // This is mainly useless for you to read through

    // Setting the name
    var name = `${id}╨${name}╨${maxLevel}╨${slot}`

    regName.push(name)

    // Returns enchantment for use in the enchantment file
    // for finding if items have the enchantment on them
    return new Enchantment(id,name,maxLevel,slot)
}


var tick=0;
world.setDynamicProperty(`ench.start`,false)


// I am so sure theres a better way to do this
// This is the detection of when the player joins and sets up the registered enchantments
// Assuming the other addons that use it have been loaded before tick 3
const onTick = () => {
    tick++

    const player = world.getPlayers()[0]

    if (tick > 3){
        if (player != undefined){
            if (world.getDynamicProperty("ench.start") != true){
                world.setDynamicProperty(`startTick`,tick)
                world.setDynamicProperty(`ench.start`,true)
                regName.forEach(name=> {
                    const loc = world.getPlayers()[0].location
                    loc.y += 100;
                    const ench = world.getDimension("overworld").spawnEntity("hog:enchant_registry",loc);
                    ench.nameTag = name;
                })
            }


            // Okay this is the point where I realise. keeping it as lore is better but im too committed
            // Some of these comments are helpful some are not
            // This is making sure the items in all projects with this file have the dynamic properties :skull:
            const itemEnchanting = player.dimension.getEntities({
                type: "hog:item_enchant"
            })
        
            for (const i of itemEnchanting){
                if (i.getDynamicProperty("i.done") != true){
                    const str = i.nameTag.split("╨")
                    const playerName = str[0];
                    const id = str[1];
                    const level = str[2]
                    const p = i.dimension.getEntities({type:"minecraft:player",name:playerName})[0]
                    const equipment = p.getComponent("equippable");
                    const item = equipment.getEquipment("Mainhand");
                    item.setDynamicProperty(`enchant.${id}.valid`,true)
                    item.setDynamicProperty(`enchant.${id}.level`,level)
                    equipment.setEquipment("Mainhand",item)
                    i.setDynamicProperty("i.done",true)
                }
            }
        }
    }
    system.run(onTick);

}
onTick();

// The names of the slots
// These are the same as the enum in script api
// Use these for any hogchantments
export const slots = {
    feet: "ArmorFeet",
    chest: "ArmorTorso",
    head: "ArmorHead",
    legs: "ArmorLegs",
    axe: "Axe",
    bow: "Bow",
    carrot_stick: "CarrotStick",
    cosmetic_head: "CosmeticHead",
    crossbow: "Crossbow",
    elytra: "Elytra",
    fishing_rod: "FishingRod",
    flintsteel: "Flintsteel",
    hoe: "Hoe",
    pickaxe: "Pickaxe",
    shears: "Shears",
    shield: "Shield",
    shovel: "Shovel",
    sword: "Sword",
    trident: "Spear"
}