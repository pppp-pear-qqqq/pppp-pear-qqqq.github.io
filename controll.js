"use strict";
function add_column(table, class_name, body_index) {
    const body = table.tBodies[body_index !== null && body_index !== void 0 ? body_index : 0];
    const temp = body.querySelector('template').content;
    const item = class_name != null ? temp.querySelector(`.${class_name}`) : temp.firstElementChild;
    const row = body.insertRow();
    row.replaceWith(item.cloneNode(true));
}
function remove_column(table, body_index) {
    table.tBodies[body_index !== null && body_index !== void 0 ? body_index : 0].deleteRow(-1);
}
{
    const log = document.querySelector('[name="log"]');
    log === null || log === void 0 ? void 0 : log.addEventListener('keydown', ev => {
        if (ev.shiftKey && ev.key == 'Enter') {
            if (log.value != '') {
                push_log(log.value.replace(/\r|\n|\r\n/g, '<br>'));
                message.push('push-free-log');
            }
        }
    });
    log === null || log === void 0 ? void 0 : log.addEventListener('input', () => {
        if (message.includes('push-free-log')) {
            message = message.filter(e => e !== 'push-free-log');
            log.value = '';
        }
    });
}
