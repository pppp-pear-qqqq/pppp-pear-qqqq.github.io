"use strict";
const log = document.querySelector('#log');
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
function push_log(text) {
    const div = document.createElement('div');
    div.innerHTML = text !== null && text !== void 0 ? text : '';
    div.addEventListener('click', log_click);
    log.appendChild(div);
    log.scroll(0, log.scrollHeight);
}
function log_click(ev) {
    const e = ev.currentTarget;
    const item = document.createElement('textarea');
    item.addEventListener('focusout', log_focusout);
    item.addEventListener('input', () => {
        item.style.removeProperty('min-height');
        item.style.minHeight = `${item.scrollHeight}px`;
    });
    item.value = e.innerHTML.replace(/<br>/g, '\n');
    e.replaceWith(item);
    item.style.minHeight = `${item.scrollHeight}px`;
    item.focus();
}
function log_focusout(ev) {
    const e = ev.currentTarget;
    if (e.value != '') {
        const item = document.createElement('div');
        item.addEventListener('click', log_click);
        item.innerHTML = e.value.replace(/\r|\n|\r\n/g, '<br>');
        e.replaceWith(item);
    }
    else {
        e.remove();
    }
}
function save_log(form) {
    const type = form.querySelector('[name="type"]').value;
    const filename = form.querySelector('[name="name"]').value;
    const blob = log_to_blob(type);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    if (filename == '') {
        a.download = `sw25log_${Date.now()}${type}`;
    }
    else {
        a.download = `${filename}${type}`;
    }
    a.click();
}
function log_to_clipboard(form) {
    const type = form.querySelector('[name="type"]').value;
    const blob = log_to_blob(type);
    blob.text().then(text => {
        navigator.clipboard.writeText(text);
    }).catch(err => {
        console.error(err);
    });
}
function log_to_blob(type) {
    switch (type) {
        case '.txt': {
            const text = [];
            log.childNodes.forEach(e => {
                text.push(e.innerText);
            });
            return new Blob([text.join('\n')], { type: 'text/plain' });
        }
        case '.html': return new Blob([log.innerText], { type: 'text/html' });
        case '.json': {
            const text = [];
            log.childNodes.forEach(e => {
                text.push(e.innerHTML);
            });
            return new Blob([JSON.stringify(text)], { type: 'text/plain' });
        }
    }
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
