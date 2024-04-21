import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";
import { getUnbreakingChance } from "../main";

// Declaring Enchant
const ench = registerEnchant("sculk_stream","Sculk Stream",1,slots.crossbow,["barrage"]);


// Event start
mc.world.afterEvents.itemCompleteUse.subscribe(a =>{
    const item = a.itemStack;
    const player = a.source;
    const duration = a.useDuration;

    if (!item) return

    // Setting values
    const {valid, level} = ench.getItem(item);

    // If the enchantment is on
    if (valid){
        // Running valid code
        player.addTag("charged")
        mc.world.playSound("mob.warden.sonic_charge",player.location)
    }
})


mc.system.afterEvents.scriptEventReceive.subscribe(a =>{
    const id = a.id;
    const player = a.sourceEntity;

    if (id == `enchant:${ench.id}` && player.typeId == "minecraft:player"){
        const equipment = player.getComponent("equippable");
        var item = equipment.getEquipment("Mainhand");

        if (!item) return;
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            if (player.hasTag("charged")){
                player.removeTag("charged")
                item.setDynamicProperty("enchant.charged",true)
                equipment.setEquipment("Mainhand",item)
            }
            else if (player.hasTag("uncharge")){
                player.removeTag("uncharge")
                item.setDynamicProperty("enchant.charged",false)

                // Durability update
                for (var i=0;i<10;i++){
                    if (!getUnbreakingChance(item)){
                        if (item.getComponent("minecraft:durability").maxDurability - item.getComponent("minecraft:durability").damage <= 1){
                            mc.world.playSound("random.break",player.location)
                            item = new mc.ItemStack("minecraft:air")
                            break;
                        }else {
                            item.getComponent("minecraft:durability").damage++;
                            player.getComponent("equippable").setEquipment("Mainhand",item)
                        }
                    }
                }

                // Updating Item
                equipment.setEquipment("Mainhand",item)
            }
        }
    }
})

mc.world.afterEvents.itemUse.subscribe(a => {
    const item = a.itemStack;
    const player = a.source;

    if (!item) return

    // Setting values
    const {valid, level} = ench.getItem(item);

    // If the enchantment is on
    if (valid){
        // Running valid code
        if (item.getDynamicProperty("enchant.charged")){
            player.addTag("uncharge")
            player.runCommand(`kill @e[type=arrow,c=1]`)

            player.applyDamage(4,{cause:"void"})

            spawnBeam(player,25)
            
        }
    }
})


function spawnBeam(player,dist){
    mc.world.playSound("mob.warden.sonic_boom",player.location);
    const view = player.getViewDirection()

    for (var i=0;i<dist;i++){
        const loc = {
            x: Math.round(player.location.x + view.x * i,2),
            y: Math.round(player.location.y + view.y * i + 1.5,2),
            z: Math.round(player.location.z + view.z * i,2)
        }

        player.runCommand(`execute positioned ${loc.x} ${loc.y} ${loc.z} as @s run damage @e[name=!${player.name},r=3] ${(20-i >= 10 ? 20-i : 10)} void entity @s`)
        player.dimension.spawnParticle("minecraft:sonic_explosion",loc)
    }
}