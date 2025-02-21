export const generateCode = () => {
	const code = Array.from(
		{ length: 6 },
		() =>
			'1234567890abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)],
	).join('');
	return code;
};
