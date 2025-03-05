"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.weapon_idx = weapon_idx !== null && weapon_idx !== void 0 ? weapon_idx : 0;
        this.self = self !== null && self !== void 0 ? self : null;
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
                table.insertRow().replaceWith(row);
            });
            dialog.showModal();
        }
        else {
            unit_controll(ev.target);
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
        this.self = self !== null && self !== void 0 ? self : null;
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
            unit_controll(ev.target);
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
function unit_controll(target) {
    var _a;
    const e = target.closest('.hp,.mp,.weapons');
    if (e != null) {
        if (e.classList.contains('hp')) {
            const v = e.querySelector('.hp-now');
            v.innerText = (Number(v.innerText) - 1).toString();
        }
        else if (e.classList.contains('mp')) {
            const v = e.querySelector('.mp-now');
            v.innerText = (Number(v.innerText) - 1).toString();
        }
        else if (e.classList.contains('weapons') && e.children.length > 0) {
            const v = e.querySelector('&>.select');
            if (v != null) {
                v.classList.remove('select');
                ((_a = v.nextElementSibling) !== null && _a !== void 0 ? _a : e.firstElementChild).classList.add('select');
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
    var _a;
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
            return [atker.acc, `(${atker.acc})`, Res.Normal];
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
            return [target.eva, `(${target.eva})`, Res.Normal];
        }
    })();
    if ((acc_res === Res.Critical && eva_res !== Res.Critical) || (eva_res !== Res.Critical && acc > eva)) {
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
            const hp = (_a = target.self) === null || _a === void 0 ? void 0 : _a.querySelector('.hp-now');
            if (hp != null) {
                hp.innerText = target.hp.now.toString();
            }
        }
        push_log(`命中 <small>acc${acc}${acc_text} > eva${eva}${eva_text}</small><br>${dmg}ダメージ！ <small>${dmg_text}</small>`);
    }
    else {
        push_log(`回避 <small>acc${acc}${acc_text} <= eva${eva}${eva_text}</small>`);
    }
}
function roll(dice = 2) {
    if (dice < 1)
        throw new Error('ダイスの個数が1個未満です');
    let result = [];
    for (let i = 0; i < dice; ++i)
        result.push(Math.ceil(Math.random() * 6));
    return [result.reduce((sum, v) => sum + v), `${result.join(',')}`];
}
function rate(rate, crit) {
    let dmg = [];
    let roll_log = [];
    for (let i = 0; i < 100; ++i) {
        const [dice, dice_text] = roll();
        roll_log.push(dice_text);
        if (dice !== 2)
            dmg.push(rate_map[rate][dice - 3]);
        if (dice < crit)
            break;
    }
    return [dmg.reduce((sum, v) => sum + v, 0), dmg.join(','), roll_log.join(' '), dmg.length - 1];
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
function load_clipboard() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            // @ts-ignore
            const permission = yield navigator.permissions.query({ name: 'clipboard-read' });
            console.log('Permission state:', permission.state);
            const text = yield navigator.clipboard.readText();
            if (!text)
                throw new Error('クリップボードが空です');
            const data = JSON.parse(text);
            console.log('Parsed data:', data);
            const weapon_num = Number(data.weaponNum);
            let weapon = [];
            for (let i = 1; i <= weapon_num; ++i) {
                weapon.push(new Weapon((_a = data[`weapon${i}Name`]) !== null && _a !== void 0 ? _a : '', Number((_b = data[`weapon${i}AccTotal`]) !== null && _b !== void 0 ? _b : 0), Number((_c = data[`weapon${i}Rate`]) !== null && _c !== void 0 ? _c : 0), Number((_d = data[`weapon${i}Crit`]) !== null && _d !== void 0 ? _d : 10), Number((_e = data[`weapon${i}DmgTotal`]) !== null && _e !== void 0 ? _e : 0)));
            }
            const pc = new PC(data.characterName, { now: Number(data.hpTotal), max: Number(data.hpTotal) }, { now: Number(data.mpTotal), max: Number(data.mpTotal) }, Number(data.defenseTotal1Eva), Number(data.defenseTotal1Def), weapon);
            areas.item(1).appendChild(pc.elem);
        }
        catch (error) {
            alert(`エラーが発生しました: ${error || '与えられたフォーマットが正しい形式ではありません'}`);
        }
    });
}
