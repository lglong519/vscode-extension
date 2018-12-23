export default function (func: any, wait: number) {
	let timer: NodeJS.Timer;
	return () => {
		clearTimeout(timer);
		timer = setTimeout(func, wait);
	};
}
