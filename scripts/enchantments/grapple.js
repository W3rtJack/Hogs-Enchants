import { ItemStack, Player, system, world, Container, Vector } from "@minecraft/server";
import { getCustomEnchants, getUnbreakingChance } from "../main";
import { registerEnchant, slots } from "../enchantment";

const grapple = registerEnchant("grapple","Grapple",1,slots.fishing_rod)


world.afterEvents.projectileHitBlock.subscribe((event) => {
  const { projectile, source } = event;
  if (projectile.typeId !== "minecraft:fishing_hook" || !(source instanceof Player)) return;

  const inventory = source.getComponent("minecraft:equippable");
  const heldItem = inventory.getEquipment("Mainhand");


  if (!heldItem || heldItem.typeId != "minecraft:fishing_rod" || !(grapple.getItem(heldItem).valid) || source.isSneaking) return;

  let prevLoc;
  const id = system.runInterval(() => {
    if (projectile.isValid() && projectile.location) {
      prevLoc = projectile.location;
    } else {
      if (prevLoc && source.location) {
        const dir = Vector.subtract(prevLoc, source.location).normalized();
        const distance = Vector.distance(prevLoc, source.location);
        source.applyKnockback(dir.x, dir.z, distance * 0.7, distance * 0.05);

        for (var i=0;i<5;i++){
          if (!getUnbreakingChance(heldItem)){
            if (heldItem.getComponent("minecraft:durability").maxDurability - heldItem.getComponent("minecraft:durability").damage <= 1){
              world.playSound("random.break",source.location)
              inventory.setEquipment("Mainhand",new ItemStack("minecraft:air"))
            }else {
              heldItem.getComponent("minecraft:durability").damage++;
              inventory.setEquipment("Mainhand",heldItem)
            }
          }
        }
      }
      system.clearRun(id);
    }
  });
});

