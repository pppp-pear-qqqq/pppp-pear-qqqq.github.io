const log = document.querySelector<HTMLOutputElement>('#log')!;

function add_column(table: HTMLTableElement, class_name?: string, body_index?: number) {
	const body = table.tBodies[body_index ?? 0];
	const temp = body.querySelector('template')!.content;
	const item = class_name != null ? temp.querySelector(`.${class_name}`) : temp.firstElementChild;
	const row = body.insertRow();
	row.replaceWith(item!.cloneNode(true));
}
function remove_column(table: HTMLTableElement, body_index?: number) {
	table.tBodies[body_index ?? 0].deleteRow(-1);
}
function push_log(text: string) {
	log.innerHTML += `<div>${text !== null && text !== void 0 ? text : ''}</div>`;
	log.scroll(0, log.scrollHeight);
}

{
	const log = document.querySelector<HTMLTextAreaElement>('[name="log"]');
	log?.addEventListener('keydown', ev => {
		if (ev.shiftKey && ev.key == 'Enter') {
			if (log.value != '') {
				push_log(log.value.replace(/\r|\n|\r\n/g, '<br>'));
				message.push('push-free-log');
			}
		}
	})
	log?.addEventListener('input', () => {
		if (message.includes('push-free-log')) {
			message = message.filter(e => e !== 'push-free-log');
			log.value = '';
		}
	})
}
