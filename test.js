const getTodayDate = () => {
	const today = new Date();
	return today.toISOString().split('T')[0].replace(/-/g, '');
};
console.log(getTodayDate());
