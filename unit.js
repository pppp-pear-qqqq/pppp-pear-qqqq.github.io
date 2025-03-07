"use strict";
const temp_pc = document.querySelector('main>template').content.querySelector('.unit.pc');
const temp_npc = document.querySelector('main>template').content.querySelector('.unit.npc');
const temp_weapon = document.querySelector('main>template').content.querySelector('.weapon');
const dialog = document.querySelector('dialog#unit');
const areas = document.querySelectorAll('main>.area');
let selected_unit;
let message = [];
class Weapon {
    constructor(name, acc, rate, crit, dmg) {
        this.name = name;
        this.acc = acc;
        this.rate = rate;
        this.crit = crit;
        this.dmg = dmg;
    }
    get elem() {
        const elem = temp_weapon.cloneNode(true);
        elem.querySelector('.name').innerText = this.name;
        elem.querySelector('.acc').innerText = this.acc.toString();
        elem.querySelector('.rate').innerText = this.rate.toString();
        elem.querySelector('.crit').innerText = this.crit.toString();
        elem.querySelector('.dmg').innerText = this.dmg.toString();
        return elem;
    }
}
class PC {
    constructor(name, hp, mp, eva, def, weapon, weapon_idx, self) {
        this.name = name;
        this.hp = hp;
        this.mp = mp;
        this.eva = eva;
        this.def = def;
        this.weapon = weapon;
        this.weapon_idx = weapon_idx ?? 0;
        this.self = self ?? null;
    }
    get elem() {
        const elem = temp_pc.cloneNode(true);
        elem.querySelector('.name').innerText = this.name;
        elem.querySelector('.hp-now').innerText = this.hp.now.toString();
        elem.querySelector('.hp-max').innerText = this.hp.max.toString();
        elem.querySelector('.mp-now').innerText = this.mp.now.toString();
        elem.querySelector('.mp-max').innerText = this.mp.max.toString();
        elem.querySelector('.eva').innerText = this.eva.toString();
        elem.querySelector('.def').innerText = this.def.toString();
        let i = 0;
        elem.querySelector('.weapons').append(...this.weapon.map(w => {
            const e = w.elem;
            if (i++ === this.weapon_idx)
                e.classList.add('select');
            return e;
        }));
        elem.addEventListener('click', this.click);
        elem.addEventListener('dragstart', this.dragstart);
        elem.addEventListener('drop', this.drop);
        elem.addEventListener('dragover', ev => ev.preventDefault());
        return elem;
    }
    click(ev) {
        if (ev.ctrlKey) {
            const e = ev.currentTarget;
            selected_unit = e;
            dialog.dataset.type = 'pc';
            const set = (key) => dialog.querySelector(`[name="${key}"]`).value = e.querySelector(`.${key}`).innerText;
            set('name');
            set('hp-now');
            set('hp-max');
            set('mp-now');
            set('mp-max');
            set('eva');
            set('def');
            const table = dialog.querySelector('.pc>table>tbody');
            while (table.rows.length > 0)
                table.deleteRow(0);
            const temp_row = table.querySelector('template').content.firstElementChild;
            e.querySelectorAll('.weapon').forEach(e => {
                const row = temp_row.cloneNode(true);
                const set = (key) => row.querySelector(`[name="${key}"]`).value = e.querySelector(`.${key}`).innerText;
                set('name');
                set('acc');
                set('rate');
                set('crit');
                set('dmg');
                row.classList.toggle('select', e.classList.contains('select'));
                table.insertRow().replaceWith(row);
            });
            dialog.showModal();
        }
        else {
            unit_controll(ev.target, ev.shiftKey);
        }
    }
    dragstart(ev) {
        selected_unit = ev.currentTarget;
    }
    drop(ev) {
        const e = ev.currentTarget;
        if (selected_unit != null && selected_unit !== e) {
            const atker = selected_unit.classList.contains('pc') ? pc_from_elem : npc_from_elem;
            battle(atker(selected_unit), pc_from_elem(e));
        }
    }
}
function pc_from_elem(elem) {
    const is_dialog = elem instanceof HTMLDialogElement;
    const get = (key) => {
        if (is_dialog)
            return elem.querySelector(`[name="${key}"]`).value;
        else
            return elem.querySelector(`.${key}`).innerText;
    };
    let weapon_idx = 0, i = 0;
    const weapon = Array.prototype.map.call(elem.querySelectorAll('.weapon'), (e) => {
        const get = (key) => {
            if (is_dialog)
                return e.querySelector(`[name="${key}"]`).value;
            else
                return e.querySelector(`.${key}`).innerText;
        };
        if (e.classList.contains('select'))
            weapon_idx = i;
        ++i;
        return new Weapon(get('name'), Number(get('acc')), Number(get('rate')), Number(get('crit')), Number(get('dmg')));
    });
    return new PC(get('name'), {
        now: Number(get('hp-now')),
        max: Number(get('hp-max')),
    }, {
        now: Number(get('mp-now')),
        max: Number(get('mp-max')),
    }, Number(get('eva')), Number(get('def')), weapon, weapon_idx, !is_dialog ? elem : undefined);
}
class NPC {
    constructor(name, acc, dmg, eva, def, hp, mp, self) {
        this.name = name;
        this.hp = hp;
        this.mp = mp;
        this.eva = eva;
        this.def = def;
        this.acc = acc;
        this.dmg = dmg;
        this.self = self ?? null;
    }
    get elem() {
        const elem = temp_npc.cloneNode(true);
        elem.querySelector('.name').innerText = this.name;
        elem.querySelector('.hp-now').innerText = this.hp.now.toString();
        elem.querySelector('.hp-max').innerText = this.hp.max.toString();
        elem.querySelector('.mp-now').innerText = this.mp.now.toString();
        elem.querySelector('.mp-max').innerText = this.mp.max.toString();
        elem.querySelector('.eva').innerText = this.eva.toString();
        elem.querySelector('.def').innerText = this.def.toString();
        elem.querySelector('.acc').innerText = this.acc.toString();
        elem.querySelector('.dmg').innerText = this.dmg.toString();
        elem.addEventListener('click', this.click);
        elem.addEventListener('dragstart', this.dragstart);
        elem.addEventListener('drop', this.drop);
        elem.addEventListener('dragover', ev => ev.preventDefault());
        return elem;
    }
    click(ev) {
        if (ev.ctrlKey) {
            const e = ev.currentTarget;
            selected_unit = e;
            dialog.dataset.type = 'npc';
            const set = (key) => dialog.querySelector(`[name="${key}"]`).value = e.querySelector(`.${key}`).innerText;
            set('name');
            set('hp-now');
            set('hp-max');
            set('mp-now');
            set('mp-max');
            set('eva');
            set('def');
            const set_npc = (key) => dialog.querySelector(`.npc [name="${key}"]`).value = e.querySelector(`.${key}`).innerText;
            set_npc('acc');
            set_npc('dmg');
            dialog.showModal();
        }
        else {
            unit_controll(ev.target, ev.shiftKey);
        }
    }
    dragstart(ev) {
        selected_unit = ev.currentTarget;
    }
    drop(ev) {
        const e = ev.currentTarget;
        if (selected_unit != null && selected_unit !== e) {
            const atker = selected_unit.classList.contains('pc') ? pc_from_elem : npc_from_elem;
            battle(atker(selected_unit), npc_from_elem(e));
        }
    }
}
function npc_from_elem(elem) {
    const is_dialog = elem instanceof HTMLDialogElement;
    const get = (key) => {
        if (is_dialog)
            return elem.querySelector(`[name="${key}"]`).value;
        else
            return elem.querySelector(`.${key}`).innerText;
    };
    return new NPC(get('name'), Number(get('acc')), Number(get('dmg')), Number(get('eva')), Number(get('def')), {
        now: Number(get('hp-now')),
        max: Number(get('hp-max')),
    }, {
        now: Number(get('mp-now')),
        max: Number(get('mp-max')),
    }, !is_dialog ? elem : undefined);
}
function unit_controll(target, is_shift) {
    const e = target.closest('.hp,.mp,.weapons');
    if (e != null) {
        if (e.classList.contains('hp')) {
            const v = e.querySelector('.hp-now');
            v.innerText = (Number(v.innerText) + (is_shift ? 1 : -1)).toString();
        }
        else if (e.classList.contains('mp')) {
            const v = e.querySelector('.mp-now');
            v.innerText = (Number(v.innerText) + (is_shift ? 1 : -1)).toString();
        }
        else if (e.classList.contains('weapons') && e.children.length > 0) {
            const v = e.querySelector('&>.select');
            if (v != null) {
                v.classList.remove('select');
                if (is_shift)
                    (v.previousElementSibling ?? e.lastElementChild).classList.add('select');
                else
                    (v.nextElementSibling ?? e.firstElementChild).classList.add('select');
            }
            else {
                e.firstElementChild.classList.add('select');
            }
        }
    }
}
var Res;
(function (Res) {
    Res[Res["Fumble"] = 0] = "Fumble";
    Res[Res["Normal"] = 1] = "Normal";
    Res[Res["Critical"] = 2] = "Critical";
})(Res || (Res = {}));
function check_res(dice) {
    if (dice === 2)
        return Res.Fumble;
    else if (dice === 12)
        return Res.Critical;
    else if (dice < 2 || dice > 12)
        throw new Error('ダイスの出目が範囲外です');
    else
        return Res.Normal;
}
function battle(atker, target) {
    const [acc, acc_text, acc_res] = (() => {
        if (atker instanceof PC) {
            const weapon = atker.weapon[atker.weapon_idx];
            const [dice, dice_text] = roll();
            const res = check_res(dice);
            switch (res) {
                case Res.Fumble: return [dice + weapon.acc, `([${dice_text}]->Fumble)`, res];
                case Res.Normal: return [dice + weapon.acc, `([${dice_text}]->${dice}+${weapon.acc})`, res];
                case Res.Critical: return [dice + weapon.acc + 5, `([${dice_text}]->${dice}+${weapon.acc}+Crit)`, res];
            }
        }
        else {
            return [atker.acc, '', Res.Normal];
        }
    })();
    const [eva, eva_text, eva_res] = (() => {
        if (target instanceof PC) {
            const [dice, dice_text] = roll();
            const res = check_res(dice);
            switch (res) {
                case Res.Fumble: return [dice + target.eva, `([${dice_text}]->Fumble)`, res];
                case Res.Normal: return [dice + target.eva, `([${dice_text}]->${dice}+${target.eva})`, res];
                case Res.Critical: return [dice + target.eva + 5, `([${dice_text}]->${dice}+${target.eva}+Crit)`, res];
            }
        }
        else {
            return [target.eva, '', Res.Normal];
        }
    })();
    if (acc_res !== Res.Fumble && (eva_res !== Res.Critical || acc_res === Res.Critical) && (eva_res === Res.Fumble || (acc_res === Res.Critical && eva_res !== Res.Critical) || acc > eva)) {
        let [dmg, dmg_text] = (() => {
            if (atker instanceof NPC) {
                const [dice, dice_text] = roll();
                return [dice + atker.dmg, `([${dice_text}]->${dice}+${atker.dmg})`];
            }
            else {
                const weapon = atker.weapon[atker.weapon_idx];
                const [power, power_text, dice_text, spin] = rate(weapon.rate, weapon.crit);
                let dmg_text = `(${weapon.rate}[${weapon.crit}]->[${dice_text}]=${power_text}->${power}+${weapon.dmg})`;
                if (spin > 0)
                    dmg_text += `(${spin}回転)`;
                else if (spin < 0)
                    dmg_text += '(自動失敗)';
                return [power + weapon.dmg, dmg_text];
            }
        })();
        if (dmg > 0) {
            dmg = Math.max(dmg - target.def, 0);
            dmg_text += ` - def${target.def}`;
            target.hp.now -= dmg;
            const hp = target.self?.querySelector('.hp-now');
            if (hp != null) {
                hp.innerText = target.hp.now.toString();
            }
        }
        push_log(`攻撃 <span class="info">${atker.name}->${target.name}</span> <span class="highlight">命中</span> <span class="info">acc${acc}${acc_text} > eva${eva}${eva_text}</span><br>${dmg}ダメージ！ <span class="info">${dmg_text}</span>`);
    }
    else {
        push_log(`攻撃 <span class="info">${atker.name}->${target.name}</span> <span class="highlight">回避</span> <span class="info">acc${acc}${acc_text} <= eva${eva}${eva_text}</span>`);
    }
}
function add_unit() {
    selected_unit = null;
    dialog.showModal();
}
function delete_unit() {
    message.push('edit-unit-skip');
    if (selected_unit != null) {
        selected_unit.remove();
    }
}
dialog.addEventListener('close', ev => {
    if (message.includes('edit-unit-skip')) {
        message = message.filter(e => e !== 'edit-unit-skip');
    }
    else {
        const e = ev.currentTarget;
        const unit = (() => {
            switch (e.dataset.type) {
                case 'pc': return pc_from_elem(e);
                case 'npc': return npc_from_elem(e);
                default: throw new Error('ユニットタイプが選択されていません');
            }
        })();
        if (selected_unit == null) {
            areas.item(1).appendChild(unit.elem);
            console.log('new');
        }
        else {
            selected_unit.replaceWith(unit.elem);
            console.log('repl');
        }
    }
});
areas.forEach(e => {
    e.addEventListener('dragover', ev => ev.preventDefault());
    e.addEventListener('drop', (ev) => {
        if (selected_unit != null) {
            const e = ev.target;
            if (e.classList.contains('area')) {
                e.appendChild(selected_unit);
                selected_unit = null;
            }
        }
    });
});
document.body.addEventListener('keydown', ev => {
    if (ev.key === 'v' && ev.ctrlKey) {
        if (dialog.open) {
            ev.preventDefault();
            load_clipboard();
            message.push('edit-unit-skip');
            dialog.close();
        }
    }
});
async function load_clipboard() {
    try {
        // @ts-ignore
        const permission = await navigator.permissions.query({ name: 'clipboard-read' });
        console.log('Permission state:', permission.state);
        const text = await navigator.clipboard.readText();
        if (!text)
            throw new Error('クリップボードが空です');
        const data = JSON.parse(text);
        console.log('Parsed data:', data);
        const weapon_num = Number(data.weaponNum);
        let weapon = [];
        for (let i = 1; i <= weapon_num; ++i) {
            weapon.push(new Weapon(data[`weapon${i}Name`] ?? '', Number(data[`weapon${i}AccTotal`] ?? 0), Number(data[`weapon${i}Rate`] ?? 0), Number(data[`weapon${i}Crit`] ?? 10), Number(data[`weapon${i}DmgTotal`] ?? 0)));
        }
        const pc = new PC(data.characterName, { now: Number(data.hpTotal), max: Number(data.hpTotal) }, { now: Number(data.mpTotal), max: Number(data.mpTotal) }, Number(data.defenseTotal1Eva), Number(data.defenseTotal1Def), weapon);
        areas.item(1).appendChild(pc.elem);
    }
    catch (error) {
        alert(`エラーが発生しました: ${error || '与えられたフォーマットが正しい形式ではありません'}`);
    }
}
