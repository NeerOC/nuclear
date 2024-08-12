import {Behavior, BehaviorContext} from "../../../Core/Behavior";
import * as bt from '../../../Core/BehaviorTree';
import Specialization from '../../../Core/Specialization';
import common from '../../../Core/Common';
import spell from "../../../Core/Spell";
import objMgr, {me} from "../../../Core/ObjectManager";

export class DemonhunterHavocBehavior extends Behavior {
  context = BehaviorContext.Any; // PVP ?
  specialization = Specialization.DemonHunter.Havoc;
  version = wow.GameVersion.Retail;

  build() {
    return new bt.Decorator(
      ret => !spell.isGlobalCooldown(),
      new bt.Selector(
        common.waitForTarget(),
        common.waitForCastOrChannel(),
        spell.cast("Throw Glaive", ret => !(objMgr.getObjectByGuid(me.target).hasAuraByMe("Master of the Glaive"))),
        spell.cast("Essence Break", ret => true), // should check cds
        spell.cast("Eye Beam", ret => me.power > 49),
        spell.cast("Felblade", ret => true),
        spell.cast("Blade Dance", me, ret =>
          me.power > 35
          && me.isWithinMeleeRange(me.target)
          && wow.SpellBook.getSpellByName("Essence Break").cooldown.duration > 3000
          && wow.SpellBook.getSpellByName("Eye Beam").cooldown.duration > 3000
        ),
        spell.cast("Chaos Strike", ret => me.power > 50),
        spell.cast("Throw Glaive", ret => me.power > 80),
      )
    );
  }



}
