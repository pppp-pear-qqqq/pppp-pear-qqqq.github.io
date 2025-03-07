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

function link_value(self: HTMLInputElement, mode: 1 | 0 | -1) {
	self.parentElement?.parentElement?.querySelectorAll('input').forEach(target => {
		if (target != self) {
			if (target.value == '' || mode === 0) {
				target.valueAsNumber = self.valueAsNumber;
			} else switch (mode) {
				case 1: target.valueAsNumber = Math.max(target.valueAsNumber, self.valueAsNumber); break;
				case -1: target.valueAsNumber = Math.min(target.valueAsNumber, self.valueAsNumber); break;
			}
		}
	})
}

function push_log(text: string) {
	const div = document.createElement('div');
	div.innerHTML = text ?? '';
	div.addEventListener('click', log_click);
	log.appendChild(div);
	log.scroll(0, log.scrollHeight);
}
function log_click(ev: Event) {
	const e = ev.currentTarget as HTMLElement;
	const item = document.createElement('textarea');
	item.addEventListener('focusout', log_focusout);
	item.addEventListener('input', () => {
		item.style.removeProperty('min-height');
		item.style.minHeight = `${item.scrollHeight}px`;
	})
	item.value = e.innerHTML.replace(/<br>/g, '\n');
	e.replaceWith(item);
	item.style.minHeight = `${item.scrollHeight}px`;
	item.focus();
}
function log_focusout(ev: Event) {
	const e = ev.currentTarget as HTMLTextAreaElement;
	if (e.value != '') {
		const item = document.createElement('div');
		item.addEventListener('click', log_click);
		item.innerHTML = e.value.replace(/\r|\n|\r\n/g, '<br>');
		e.replaceWith(item);
	} else {
		e.remove();
	}
}
function save_log(form: HTMLElement) {
	const type = form.querySelector<HTMLSelectElement>('[name="type"]')!.value as '.txt' | '.html' | '.json';
	const filename = form.querySelector<HTMLInputElement>('[name="name"]')!.value;
	const blob = log_to_blob(type);
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob!);
	if (filename == '') {
		a.download = `sw25log_${Date.now()}${type}`;
	} else {
		a.download = `${filename}${type}`;
	}
	a.click();
}
function log_to_clipboard(form: HTMLElement) {
	const type = form.querySelector<HTMLSelectElement>('[name="type"]')!.value as '.txt' | '.html' | '.json';
	const blob = log_to_blob(type);
	blob.text().then(text => {
		navigator.clipboard.writeText(text);
	}).catch(err => {
		console.error(err);
	});
}
function log_to_blob(type: '.txt' | '.html' | '.json') {
	switch (type) {
		case '.txt': {
			const text: string[] = [];
			log.childNodes.forEach(e => {
				text.push((e as HTMLElement).innerText);
			});
			return new Blob([text.join('\n')], { type: 'text/plain' });
		}
		case '.html': return new Blob([log.innerText], { type: 'text/html' });
		case '.json': {
			const text: string[] = [];
			log.childNodes.forEach(e => {
				text.push((e as HTMLElement).innerHTML);
			});
			return new Blob([JSON.stringify(text)], { type: 'text/plain' });
		}
	}
}

{
	const log = document.querySelector<HTMLTextAreaElement>('[name="log"]');
	log?.addEventListener('keydown', ev => {
		if (ev.shiftKey && ev.key == 'Enter') {
			if (log.value != '') {
				const text = log.value
					.replace(/\r|\n|\r\n/g, '<br>')
					.replaceAll(/(^|\s+)(\d+)d6/g, (match, _, num: string) => {
						const [result, text] = roll(Number(num));
						return `${match}<span class="info"> -> [${text}] -> </span>${result}`;
					})
					.replaceAll(/(^|\s+)k(\d+)(@(\d+))?/g, (match, _0, power: string, _1, crit: string | undefined) => {
						console.log(power, crit, crit != null ? /\d+/.test(crit) : false)
						const [result, powers, dices, spin] = rate(Number(power), (crit != null ? /\d+/.test(crit) : false) ? Number(crit) : 10);
						let result_text = `${match}<span class="info"> -> [${dices}]=${powers} -> </span>`;
						if (spin > 0) result_text += `${result}<span class="info">(${spin}回転)</span>`;
						else if (spin < 0) result_text += '自動失敗';
						else result_text += result.toString();
						return result_text;
					})
				push_log(text);
				message.push('push-free-log');
			}
		}
	})
	log?.addEventListener('input', ev => {
		if (message.includes('push-free-log')) {
			message = message.filter(e => e !== 'push-free-log');
			log.value = '';
		}
	})
}
