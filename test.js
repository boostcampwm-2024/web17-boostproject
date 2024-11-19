function getDate52WeeksAgo() {
	const today = new Date();
	const weeksAgo = 52 * 7; // 52주 * 7일
	const date52WeeksAgo = new Date(today.setDate(today.getDate() - weeksAgo));
	return date52WeeksAgo;
  }
  
  console.log(getDate52WeeksAgo());
