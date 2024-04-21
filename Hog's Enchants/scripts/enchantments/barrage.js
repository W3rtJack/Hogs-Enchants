import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";
import { getUnbreakingChance } from "../main";

// Declaring Enchant
const ench = registerEnchant("barrage","Barrage",5,slots.crossbow,["multishot"]);


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
        if (player.isSneaking){
            const max = 4*level
            const amt = item.getDynamicProperty("enchant.chargedAmount") > 0 ? item.getDynamicProperty("enchant.chargedAmount") : 0
            if (amt < max){
                item.setDynamicProperty("enchant.chargedAmount",amt+1)
                player.getComponent("equippable").setEquipment("Mainhand",item)

                player.sendMessage(`§c${amt+1}/${max} arrows loaded`)
            }else {
                player.sendMessage(`§cYour crossbow is fully loaded`)
                player.addTag("charged")
            }
        }else {
            player.addTag("charged")
        }
    }
})


mc.system.afterEvents.scriptEventReceive.subscribe(a =>{
    const id = a.id;
    const player = a.sourceEntity;

    if (id == `enchant:${ench.id}` && player.typeId == "minecraft:player"){
        const equipment = player.getComponent("equippable");
        const item = equipment.getEquipment("Mainhand");

        if (!item) return;
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            if (player.hasTag("charged")){
                player.removeTag("charged")
                item.setDynamicProperty("enchant.charged",true)
                equipment.setEquipment("Mainhand",item)
            }
            if (player.hasTag("uncharge")){
                player.removeTag("uncharge")
                item.setDynamicProperty("enchant.charged",false)
                equipment.setEquipment("Mainhand",item)
            }
        }

        if (player.getDynamicProperty("enchant.charged.shoot") > 0){
            if (valid){
                const playerVel = player.getVelocity()
                const view = player.getViewDirection()
                const loc = {
                    x: player.location.x+playerVel.x+view.x,
                    y: player.location.y+playerVel.y+view.y+1.5,
                    z: player.location.z+playerVel.z+view.z
                }
                const arrow = player.dimension.spawnEntity("minecraft:arrow",loc)

                const vSpeed = 5

                const vel = {
                    x: view.x * vSpeed,
                    y: view.y * vSpeed,
                    z: view.z * vSpeed
                }
                arrow.applyImpulse(vel)
                arrow.setRotation(player.getRotation())

                player.setDynamicProperty("enchant.charged.shoot",player.getDynamicProperty("enchant.charged.shoot")-1)
                item.setDynamicProperty("enchant.chargedAmount",item.getDynamicProperty("enchant.chargedAmount")-1)
                equipment.setEquipment("Mainhand",item)
            }else {
                player.setDynamicProperty("enchant.charged.shoot",0)
            }
        }
    }
})


mc.world.afterEvents.itemUse.subscribe(a => {
    const item = a.itemStack;
    const player = a.source;
    const duration = a.useDuration;

    if (!item) return

    // Setting values
    const {valid, level} = ench.getItem(item);

    // If the enchantment is on
    if (valid){
        // Running valid code
        if (item.getDynamicProperty("enchant.charged")){
            player.addTag("uncharge")
            const arrowAmt = item.getDynamicProperty("enchant.chargedAmount")
            player.setDynamicProperty("enchant.charged.shoot",arrowAmt+1)
            player.runCommand(`kill @e[type=arrow,c=1]`)
        }
    }
})


