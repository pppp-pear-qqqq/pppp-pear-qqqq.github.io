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
