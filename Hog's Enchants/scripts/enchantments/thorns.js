import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";
import { getUnbreakingChance } from "../main";

// Declaring Enchant
const ench = registerEnchant("thorns","Thorns",3,slots.shield);


// Event start
mc.world.afterEvents.entityHitEntity.subscribe(a =>{
    const hit = a.hitEntity;
    const attacker = a.damagingEntity;

    if (hit.typeId == "minecraft:player"){
        // Getting items
        const equipment = hit.getComponent("equippable");
        var item = equipment.getEquipment("Offhand");

        if (!item) if (equipment.getEquipment("Mainhand")){
           item = equipment.getEquipment("Mainhand")
        }else {
            return
        }

        // Setting values
        const {valid, level} = ench.getItem(item);

        // If the enchantment is on
        if (valid){
            // Running valid code
            if (hit.isSneaking){
                let rand = Math.random()*10
                if (rand < (level+0.5)**1.5){
                    attacker.runCommand(`damage @s ${level+1} thorns`)

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
            }
        }
    }
})