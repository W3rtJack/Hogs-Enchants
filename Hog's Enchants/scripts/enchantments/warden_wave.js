import * as mc from "@minecraft/server"
import { registerEnchant, slots } from "../enchantment";
import { getUnbreakingChance } from "../main";

// Declaring Enchant
const ench = registerEnchant("warden_wave","Warden Wave",3,slots.shield);


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
                let rand = Math.random()*15
                if (rand < (level+0.5)**1.5){
                    const loc = hit.location;
                    loc.y += 0.5;
                    hit.dimension.spawnParticle("hog:sculk_launch",loc);
                    mc.world.playSound(`note.chime`,loc,{volume:5,pitch:0.7})

                    const affectedEntities = hit.dimension.getEntities({
                        maxDistance: 5,
                        location: loc
                    })

                    for (const entity of affectedEntities){
                        if (entity != hit){
                            const loc = hit.location;
                            const entLoc = entity.location;
                            const newLoc = {
                                x: entLoc.x-loc.z,
                                y: entLoc.y-loc.y,
                                z: entLoc.z-loc.z
                            }

                            entity.applyKnockback(newLoc.x,newLoc.z,2,0.8)

                            if (entity.typeId == "minecraft:warden"){
                                entity.runCommand("event entity @e force_dig")
                            }
                        }
                    }
                }
            }
        }
    }
})