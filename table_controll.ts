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