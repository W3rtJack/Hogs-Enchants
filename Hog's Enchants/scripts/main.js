import * as mc from '@minecraft/server'
import * as mcui from '@minecraft/server-ui'
import { Enchantment, slots } from './enchantment'


import {} from "enchantList.js"

const enchantList = []

export const mineList = {
    "pickaxe": [ "diamond_pick_diggable" ],
    "axe": [ "log" ],
    "hoe": [ "minecraft:crop" ],
    "shovel": [ "dirt","sand","gravel","grass","snow" ]
}

function registerEnchantments(){
    const enchants = mc.world.getPlayers()[0].dimension.getEntities({
        type: "hog:enchant_registry"
    })

    for (const enchant of enchants){
        const str = enchant.nameTag.split("╨")
        const id = str[0];
        const name = str[1];
        const maxLevel = str[2];
        var slot = str[3];
        var cancelList = str[4];

        if (slot.includes(",")){
            var newSlot = []
            const slots = slot.split(",")
            slots.forEach(s=> {
                if (s != "") newSlot.push(s)
            })

            slot = newSlot;
        }

        if (cancelList != "" && cancelList != undefined){
            cancelList = cancelList.split(",")
        }else {
            cancelList = []
        }

        enchantList.push(new Enchantment(id,name,maxLevel,slot,cancelList))

        enchant.kill()
    }
}


var tick = 0;


const onTick = () => {
    tick++

    if (tick > mc.world.getDynamicProperty("startTick")+5){
        registerEnchantments()
    }


    for (let player of mc.world.getPlayers()){
        const equipment = player.getComponent("equippable")

        enchantList.forEach(ench=> {
            player.runCommand(`scriptevent enchant:${ench.id}`)
        })

        try { player.runCommand("fill ~-5 ~-5 ~-5 ~5 ~5 ~5 air [] replace light_block")} catch {};
    }

    mc.system.run(onTick);
}
onTick();

function hasItem(player,testItem){
    const inv = player.getComponent("inventory").container
    for (let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i)
        
        if (item?.typeId == testItem){
            return true
        }
    }
    return false
}

mc.world.afterEvents.itemUseOn.subscribe(a =>{
    mc.system.run(()=>{

    
    let block = a.block
    let player = a.source
    let item = a.itemStack

    

        if (block.type.id == "hog:hogchanting_table"){
            let lore = item.getLore()
            let type = findType(item)

            const enchList = []

            if (type != ""){
                var i = 0;

                const form = new mcui.ActionFormData()
                .title("Hogchanting Table")
                .body("Each enchantment will take 1 enchantment stone and 8 levels to level up once");

                enchantList.forEach(element => {
                    if (element.slot.includes(type)){
                        form.button(`${element.name}\nMax Level: ${element.maxLevel}`)
                        enchList.push(element)
                        i++;
                    }
                });

                form.button("§4§lDisenchant\n§r§cThis will remove all custom enchants")

                if (i >= 1){
                
                    form.show(player).then(response => {
                        var hasEnchStone = false
                        var changed = false
                        var enchNum = -1;

                        const equipment = player.getComponent("equippable")

                        
                        const inv = player.getComponent("inventory").container
                        for (let i = 0; i < inv.size; i++) {
                            const item = inv.getItem(i)
                            
                            if (item?.typeId == "hog:enchanting_stone"){
                                hasEnchStone = true
                            }
                        }

                        
                        if (response.canceled) return;
                        else if (response.selection == i){
                            const dis = disenchant(item);
                            item = dis.item;
                            const levels = dis.level
                            item = updateLore(item);
                            item.clearDynamicProperties()
                            equipment.setEquipment("Mainhand",item)

                            player.runCommand(`xp ${60*levels}`)
                            mc.world.playSound("block.grindstone.use",player.location)
                        }
                        else {
                            // Checking for the level above 8
                            if (player.level >= 8){
                                // Checking if the player indeed has an enchanting stone
                                if (hasEnchStone){
                                    // Checking whether they dont have the max level
                                    if (enchList[response.selection].getItem(item).level < enchList[response.selection].maxLevel){
                                        // Checking whether they don't have any blacklisted enchantments
                                        var enchAllowed = true;

                                        // I cannot be bothered to give decent names
                                        const enches = getCustomEnchants(item)


                                        enches.forEach(e=> {
                                            if (e.cancelList != [] && e.cancelList != undefined){
                                                if (e.cancelList.includes(enchList[response.selection].id)){
                                                    enchAllowed = false
                                                }
                                            }
                                            if (enchList[response.selection].cancelList.includes(e.id)){
                                                enchAllowed = false;
                                            }
                                        })

                                        item.getComponent("enchantable").getEnchantments().forEach(e=> {
                                            if (enchList[response.selection].cancelList != [] && enchList[response.selection].cancelList != undefined){
                                                if (enchList[response.selection].cancelList.includes(e.type.id)){
                                                    enchAllowed = false;
                                                }
                                            }
                                        })

                                        if (enchAllowed){
                                            enchList[response.selection].setItem(item,enchList[response.selection].getItem(item).level+1)
                                            item = updateLore(item)
                                            equipment.setEquipment("Mainhand",item)

                                            // Spawning the fucking item_enchant
                                            // Love british time changing...
                                            const name = `${player.name}╨${enchList[response.selection].id}╨${enchList[response.selection].getItem(item).level+1}`
                                            const loc = player.location;
                                            loc.y += 100
                                            const ie = player.dimension.spawnEntity("hog:item_enchant",loc);
                                            ie.nameTag = name;


                                            player.runCommand("xp -6l @s")
                                            player.runCommand("clear @s hog:enchanting_stone 0 1")
                                        }else {
                                            player.sendMessage(`§cYou have enchantments with arent allowed with ${enchList[response.selection].name} already equipped`)
                                        }
                                    }else {
                                        player.sendMessage(`§cYou already have the max level for ${enchList[response.selection].name}!`)
                                    }
                                }else {
                                    player.sendMessage(`§cYou don't have enough enchanting stones to enchant!`)
                                }
                            }else {
                                player.sendMessage(`§cYou don't have enough XP levels to enchant!\nMinimum required: 8 levels`)
                            }
                            return;
                        }
                    })
                }
                
            }
        }

    })
})

function findType(item){
    if (item.hasComponent("minecraft:enchantable")){
        const newItem = new mc.ItemStack(item.typeId,1)
        const ench = newItem.getComponent("minecraft:enchantable")

        if (ench.canAddEnchantment({level:1,type:"sharpness"}) && !ench.canAddEnchantment({level:1,type:"efficiency"}) && !ench.canAddEnchantment({level:1,type:"impaling"})){
            return slots.sword
        }
        if (ench.canAddEnchantment({level:1,type:"sharpness"}) && ench.canAddEnchantment({level:1,type:"efficiency"})){
            return slots.axe
        }
        if (item.typeId.includes("shovel")){
            return slots.shovel
        }
        if (item.typeId.includes("hoe")){
            return slots.hoe
        }
        if (item.typeId.includes("pickaxe")){
            return slots.pickaxe
        }
        if (ench.canAddEnchantment({level:1,type:"impaling"})){
            return slots.trident
        }
        if (ench.canAddEnchantment({level:1,type:"aqua_affinity"})){
            return slots.head
        }
        if (ench.canAddEnchantment({level:1,type:"protection"}) && !ench.canAddEnchantment({level:1,type:"aqua_affinity"}) && !ench.canAddEnchantment({level:1,type:"swift_sneak"}) && !ench.canAddEnchantment({level:1,type:"depth_strider"})){
            return slots.chest
        }
        if (ench.canAddEnchantment({level:1,type:"swift_sneak"})){
            return slots.legs
        }
        if (ench.canAddEnchantment({level:1,type:"depth_strider"})){
            return slots.feet
        }
        if (ench.canAddEnchantment({level:1,type:"lure"})){
            return slots.fishing_rod
        }
        if (item.typeId.includes("elytra")){
            return slots.elytra
        }
        if (item.typeId.includes("shield")){
            return slots.shield
        }
        if (item.typeId.includes("shears")){
            return slots.shears
        }
        if (item.typeId.includes("flint_and_steel")){
            return slots.flintsteel
        }
        if (ench.canAddEnchantment({level:1,type:"quick_charge"})){
            return slots.crossbow
        }
    }
    return ""
}


function numToNumeral(num){
    var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},roman = '',i;
    for ( i in lookup ) {
      while ( num >= lookup[i] ) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
}



function romanToInt(s) {
    const myMap=new Map();
    myMap.set('I', 1);
    myMap.set('V', 5);
    myMap.set('X', 10);
    myMap.set('L', 50);
    myMap.set('C', 100);
    myMap.set('D', 500);
    myMap.set('M', 1000);
   var result=0;
   if(s){
     var s1=s.split('');
     s1.forEach(function(e,i){
          result += myMap.get(e) < myMap.get(s1[i+1]) ? -myMap.get(e) : myMap.get(e);  // used ternary oprator with '-' where required
     });
   }
   return result; //move it outside loop
}




export function getCustomEnchants(item){
    var enchantments = []

    const slot = findType(item)

    enchantList.forEach(ench=> {
        if (ench.slot == slot){
            if (ench.getItem(item).valid){
                enchantments.push(ench)
            }
        }
    })

    return enchantments
}


function updateLore(item){
    var lore = []
    enchantList.forEach(ench=> {
        const enchItem = ench.getItem(item)
        if (enchItem.valid){
            lore.push(`§7${ench.name} ${numToNumeral(enchItem.level)}`)
        }
    })

    item.setLore(lore)

    return item
}


export function getUnbreakingChance(item){
    if (item.getComponent("minecraft:enchantable").hasEnchantment("unbreaking")){
        const unbreaking = item.getComponent("minecraft:enchantable").getEnchantment("unbreaking")
        const rand = Math.random()*100
        const unbreakingChance = 100/(unbreaking.level+1)

        mc.world.getDimension("overworld").runCommand(`say ${unbreaking.level}`)

        if (rand < unbreakingChance){
            return false
        }else {
            return true
        }
    }
}


function disenchant(item){
    var levels = 0;
    var newItem = item;
    enchantList.forEach(ench=> {
        levels += ench.removeItem(newItem)
    })


    return {item:newItem,level:levels}
}




mc.world.beforeEvents.playerBreakBlock.subscribe(a=> {
    const player = a.player;
    const block = a.block;

    if (block.typeId == "hog:hogchanting_table"){
        mc.system.run(()=>{
            player.runCommand(`execute positioned ${block.location.x} ${block.location.y} ${block.location.z} run event entity @e[type=hog:coin,c=1] hog:dissapear`)
        })
    }
})